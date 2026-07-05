// Refreshes MAL-derived stats (malScore, malMembers, malTomatometer, adjustedScore)
// for every anime in data/anime.json.
//
// malMembers is the number of voting members — the sum of vote counts across all
// ten score buckets (1 through 10) on each anime's MAL /stats page. This is neither
// the total members count on the main page nor the "Completed" status count; it's
// specifically how many people actually cast a score, which is the relevant sample
// size for a Bayesian average of malScore.
//
// adjustedScore uses a Bayesian average pulling low-sample scores toward the global
// mean. Neither Bayesian constant is hardcoded — both are recomputed each run from
// the whole list, so they stay in step with what's typical here instead of going
// stale as the list grows:
//   - MIN_MEMBERS: median voting members across the list, floored to the nearest 1,000
//   - GLOBAL_MEAN: mean malScore across the list
//
// Both values are also written to data/bayesian_constants.json as a snapshot. This
// repo is the single source of truth for these constants — the Google Apps Script
// spreadsheet fetches this same file (from the live site) instead of independently
// computing its own median/mean from the sheet, so the two never drift apart the
// way they would if each recomputed live off its own (differently-timed, differently
// -scoped) data.
//
// Usage: node scrape_mal_stats.js

const fs = require('fs');
const dataDir = require('path').join(__dirname, 'data');
const path = require('path').join(dataDir, 'anime.json');
const constantsPath = require('path').join(dataDir, 'bayesian_constants.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36';
const THROTTLE_MS = 400;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function median(vals) {
  const sorted = [...vals].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function mean(vals) {
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function adjustedScore(score, votingMembers, minMembers, globalMean) {
  const denom = votingMembers + minMembers;
  return (votingMembers / denom) * score + (minMembers / denom) * globalMean;
}

async function fetchMalStats(malId, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const pageRes = await fetch(`https://myanimelist.net/anime/${malId}`, { headers: { 'User-Agent': UA } });
      if (pageRes.status !== 200) throw new Error(`main page status ${pageRes.status}`);
      const pageHtml = await pageRes.text();
      const scoreMatch = pageHtml.match(/<div class="score-label\s+score-\d+">(\d+\.\d+)<\/div>/);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

      const statsRes = await fetch(`https://myanimelist.net/anime/${malId}/x/stats`, { headers: { 'User-Agent': UA } });
      if (statsRes.status !== 200) throw new Error(`stats page status ${statsRes.status}`);
      const statsHtml = await statsRes.text();

      // Each row on the stats page gives the vote count for one score (1-10).
      // Voting members (the sample size for the Bayesian average) is the sum of
      // all ten; Tomatometer is just the 8/9/10 percentages, same as before.
      const regex = /<td width="20" class="score-label score-(\d+)">\d+<\/td>\s*<td>.*?width: (\d+\.\d+)%;.*?\((\d+) votes\)/gs;
      let votingMembers = 0, tomatometerTotal = 0, m;
      while ((m = regex.exec(statsHtml)) !== null) {
        const rank = parseInt(m[1], 10);
        votingMembers += parseInt(m[3], 10);
        if (rank >= 8) tomatometerTotal += parseFloat(m[2]);
      }
      const tomatometer = parseFloat(tomatometerTotal.toFixed(1));

      if (score === null || votingMembers === 0) throw new Error('missing score or voting member count');
      return { score, votingMembers, tomatometer };
    } catch (e) {
      if (attempt === retries - 1) throw e;
      await sleep(1500);
    }
  }
}

(async () => {
  const anime = JSON.parse(fs.readFileSync(path, 'utf-8'));

  const uniqueIds = new Set();
  anime.forEach(a => {
    if (Array.isArray(a.malId)) a.malId.forEach(id => uniqueIds.add(id));
    else uniqueIds.add(a.malId);
  });
  const idList = [...uniqueIds];

  const statsById = {};
  console.log(`Fetching MAL stats for ${idList.length} unique MAL IDs...`);
  for (let i = 0; i < idList.length; i++) {
    const malId = idList[i];
    try {
      statsById[malId] = await fetchMalStats(malId);
      console.log(`[${i + 1}/${idList.length}] malId ${malId} -> score=${statsById[malId].score}, votingMembers=${statsById[malId].votingMembers}, tomatometer=${statsById[malId].tomatometer}`);
    } catch (e) {
      console.log(`[${i + 1}/${idList.length}] malId ${malId} -> FAILED: ${e.message}`);
    }
    await sleep(THROTTLE_MS);
  }

  const allVotingMembers = Object.values(statsById).map(s => s.votingMembers).filter(v => v != null);
  const allScores = Object.values(statsById).map(s => s.score).filter(v => v != null);
  const minMembers = Math.floor(median(allVotingMembers) / 1000) * 1000;
  const globalMean = mean(allScores);
  console.log(`\nDynamic MIN_MEMBERS (median voting members, floored to nearest 1000): ${minMembers}`);
  console.log(`Dynamic GLOBAL_MEAN (mean malScore across the list): ${globalMean}`);

  fs.writeFileSync(constantsPath, JSON.stringify({
    minMembers,
    globalMean,
    sampleSize: allScores.length,
    computedAt: new Date().toISOString(),
  }, null, 2) + '\n', 'utf-8');

  let updatedFlat = 0, updatedStats = 0;
  const missing = [];
  anime.forEach(a => {
    if (Array.isArray(a.malId)) {
      a.malStats.forEach(s => {
        const stat = statsById[s.malId];
        if (!stat) { missing.push(`${a.title} (malStats ${s.malId})`); return; }
        s.malScore = stat.score;
        s.malMembers = stat.votingMembers;
        s.malTomatometer = stat.tomatometer;
        s.adjustedScore = adjustedScore(stat.score, stat.votingMembers, minMembers, globalMean);
        updatedStats++;
      });
    } else {
      const stat = statsById[a.malId];
      if (!stat) { missing.push(`${a.title} (malId ${a.malId})`); return; }
      a.malScore = stat.score;
      a.malMembers = stat.votingMembers;
      a.malTomatometer = stat.tomatometer;
      a.adjustedScore = adjustedScore(stat.score, stat.votingMembers, minMembers, globalMean);
      updatedFlat++;
    }
  });

  fs.writeFileSync(path, JSON.stringify(anime, null, 2) + '\n', 'utf-8');
  console.log(`\nDone. Updated ${updatedFlat} flat entries, ${updatedStats} malStats sub-entries.`);
  if (missing.length) {
    console.log(`Missing/failed (${missing.length}):`);
    missing.forEach(m => console.log(' -', m));
  }
})();
