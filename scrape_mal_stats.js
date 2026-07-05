// Refreshes MAL-derived stats (malScore, malMembers, malTomatometer, adjustedScore)
// for every anime in data/anime.json.
//
// malMembers is the "Completed" status count from each anime's MAL /stats page
// (not the total members count on the main page), since that reflects users who've
// actually finished it rather than everyone who's ever added it to a list.
//
// adjustedScore uses a Bayesian average pulling low-sample scores toward the global
// mean. Neither Bayesian constant is hardcoded — both are recomputed each run from
// the whole list, so they stay in step with what's typical here instead of going
// stale as the list grows:
//   - MIN_MEMBERS: median Completed count across the list, floored to the nearest 1,000
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

function adjustedScore(score, completed, minMembers, globalMean) {
  const denom = completed + minMembers;
  return (completed / denom) * score + (minMembers / denom) * globalMean;
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

      const completedMatch = statsHtml.match(/<span class="dark_text">Completed:<\/span>\s*([\d,]+)/);
      const completed = completedMatch ? parseInt(completedMatch[1].replace(/,/g, ''), 10) : null;

      const regex = /<td width="20" class="score-label score-(10|9|8)">(\d+)<\/td>\s*<td>.*?width: (\d+\.\d+)%/g;
      let total = 0, m;
      while ((m = regex.exec(statsHtml)) !== null) total += parseFloat(m[3]);
      const tomatometer = parseFloat(total.toFixed(1));

      if (score === null || completed === null) throw new Error('missing score or completed count');
      return { score, completed, tomatometer };
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
      console.log(`[${i + 1}/${idList.length}] malId ${malId} -> score=${statsById[malId].score}, completed=${statsById[malId].completed}, tomatometer=${statsById[malId].tomatometer}`);
    } catch (e) {
      console.log(`[${i + 1}/${idList.length}] malId ${malId} -> FAILED: ${e.message}`);
    }
    await sleep(THROTTLE_MS);
  }

  const allCompleted = Object.values(statsById).map(s => s.completed).filter(v => v != null);
  const allScores = Object.values(statsById).map(s => s.score).filter(v => v != null);
  const minMembers = Math.floor(median(allCompleted) / 1000) * 1000;
  const globalMean = mean(allScores);
  console.log(`\nDynamic MIN_MEMBERS (median Completed count, floored to nearest 1000): ${minMembers}`);
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
        s.malMembers = stat.completed;
        s.malTomatometer = stat.tomatometer;
        s.adjustedScore = adjustedScore(stat.score, stat.completed, minMembers, globalMean);
        updatedStats++;
      });
    } else {
      const stat = statsById[a.malId];
      if (!stat) { missing.push(`${a.title} (malId ${a.malId})`); return; }
      a.malScore = stat.score;
      a.malMembers = stat.completed;
      a.malTomatometer = stat.tomatometer;
      a.adjustedScore = adjustedScore(stat.score, stat.completed, minMembers, globalMean);
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
