// ── Filter definitions ─────────────────────────────────────────────────────

const DEMOGRAPHICS = ['Josei', 'Seinen', 'Shoujo', 'Shounen'];

const ALL_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
];

// Only tags appearing in ≥5 anime at ≥75% rank
// Ordered hierarchically: what-it's-about content descriptors (alphabetical,
// now that none of them are genre-gated), then who's-involved facts (paired
// with Studio after).
const FILTER_GROUPS = [
  {
    label: 'Fantasy & Supernatural',
    items: [
      'Aliens', 'Animals', 'Creature Taming', 'Demons', 'Gods', 'Henshin',
      'Magic', 'Mythology', 'Super Power', 'Witch', 'Youkai',
    ],
  },
  {
    label: 'Activities & Hobbies',
    items: [
      'Acting', 'Athletics', 'Band', 'Card Battle', 'Drawing',
      'Outdoor Activities', 'Rock Music', 'Video Games',
    ],
  },
  {
    label: 'Relationships & Romance',
    items: [
      'Cohabitation', 'Fake Relationship', 'Female Harem', 'Heterosexual',
      'LGBTQ+ Themes', 'Love Triangle', 'Marriage', 'Unrequited Love', 'Yuri',
    ],
  },
  {
    label: 'Setting',
    items: [
      'Coastal', 'College', 'Foreign', 'Historical', 'Isekai', 'Medieval',
      'Office', 'Rural', 'School', 'School Club', 'Urban', 'Urban Fantasy', 'Work',
    ],
  },
  {
    label: 'Themes',
    items: [
      'Assassins', 'Coming of Age', 'Crime', 'Environmental', 'Espionage',
      'Family Life', 'Food', 'Found Family', 'Guns', 'Otaku Culture',
      'Philosophy', 'Politics', 'Proxy Battle', 'Rehabilitation', 'Revenge',
      'Royal Affairs', 'Travel', 'War',
    ],
  },
  {
    label: 'Tone',
    items: [
      'Cute Girls Doing Cute Things', 'Episodic', 'Iyashikei', 'Meta',
      'Parody', 'Slapstick', 'Surreal Comedy',
    ],
  },
  {
    label: 'Cast',
    items: [
      'Ensemble Cast', 'Female Protagonist', 'Male Protagonist',
      'Primarily Adult Cast', 'Primarily Child Cast', 'Primarily Female Cast',
      'Primarily Teen Cast',
    ],
  },
  {
    label: 'Characters',
    items: [
      'Anti-Hero', 'Disability', 'Hikikomori',
      'Idol', 'Kuudere', 'Maids', 'Office Lady', 'Ojou-sama', 'Orphan',
      'Tsundere',
    ],
  },
];

const NSFW_GROUP = {
  label: 'Mature Content',
  items: ['Inseki', 'Large Breasts', 'Nudity'],
};

const SEASON_META = {
  WINTER: { emoji: '❄️', label: 'Winter', className: 'season-winter' },
  SPRING: { emoji: '🌸', label: 'Spring', className: 'season-spring' },
  SUMMER: { emoji: '☀️', label: 'Summer', className: 'season-summer' },
  FALL: { emoji: '🍁', label: 'Fall', className: 'season-fall' },
};

const AWARD_META = {
  gold: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => "Jeric's AOTY Winner",
    hover: () => 'This anime is my favorite from this year',
  },
  fivechAOTY: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => '5ch AOTY Winner',
    hover: () => 'This anime was crowned Anime of the Year by members of 5ch',
  },
  fourchanAOTY: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => '4chan AOTY Winner',
    hover: () => 'This anime was crowned Anime of the Year by members of /a/',
  },
  jury: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => 'r/anime AOTY Jury Winner',
    hover: () => 'This anime won the r/anime Anime of the Year award among the jury',
  },
  public: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => 'r/anime AOTY Public Winner',
    hover: () => 'This anime won the r/anime Anime of the Year award among the public',
  },
  motyJury: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => 'r/anime MOTY Jury Winner',
    hover: () => 'This anime won the r/anime Movie of the Year award among the jury',
  },
  motyPublic: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => 'r/anime MOTY Public Winner',
    hover: () => 'This anime won the r/anime Movie of the Year award among the public',
  },
  crunchyroll: {
    emoji: '🏆',
    className: 'award-gold',
    label: () => 'Crunchyroll AOTY Winner',
    hover: () => 'This anime won the Crunchyroll Anime Award for Anime of the Year',
  },
  fresh: {
    emoji: '🍅',
    className: 'award-fresh',
    label: () => 'Certified Fresh',
    hover: () => 'Anime that are highly-acclaimed and good starters, regardless of what genres you usually watch',
  },
  rotten: {
    emoji: '🗑️',
    className: 'award-rotten',
    label: () => 'Certified Rotten',
    hover: () => 'Anime that score poorly across most metrics. Watch at your own risk',
  },
};

// MAL-derived stats shown on the detail modal
const MAL_STAT_META = {
  malScore: {
    name: 'MAL Score',
    label: (v) => `MAL Score: ${v}`,
    hover: 'This is the score for this anime on MyAnimeList',
  },
  adjustedScore: {
    name: 'Weighted Score',
    label: (v) => `Weighted Score: ${v.toFixed(2)}`,
    hover: "A version of the MAL score adjusted for how many people have completed it, so a niche anime with a handful of 10s doesn't outrank a widely-rated favorite",
  },
  malTomatometer: {
    name: '🍅 Tomatometer',
    label: (v) => `🍅 Tomatometer: ${v}%`,
    hover: "This is the percentage of MAL users who've rated this anime an 8 or higher",
  },
};

// Filter chips for anime.specialAwards — "medalist" covers any AOTY/MOTY win
const SPECIAL_TITLES_META = {
  medalist: {
    label: '🏆 Award Winning',
    hover: 'Anime recognized for outstanding achievement in their year of release.',
  },
  fresh: { label: `${AWARD_META.fresh.emoji} Certified Fresh`, hover: AWARD_META.fresh.hover() },
  rotten: { label: `${AWARD_META.rotten.emoji} Certified Rotten`, hover: AWARD_META.rotten.hover() },
};

const MEDALIST_AWARDS = ['gold', 'fivechAOTY', 'fourchanAOTY', 'crunchyroll', 'jury', 'public', 'motyJury', 'motyPublic'];

// Certified Fresh/Rotten are no longer hand-curated — they're derived
// automatically from where an anime's Weighted Score ranks against every
// other anime with a score: top 10% is Fresh, bottom 10% is Rotten. Reuses
// the same metricRankings population the Scoring Metrics chips are colored
// from, so the two stay consistent with each other.
function getFreshRottenStatus(anime) {
  // Prereq anime never carry the Fresh/Rotten title, even if their Weighted
  // Score would otherwise qualify — someone has to watch something else
  // first, so it's not a title worth surfacing on its own.
  if (anime.requiresPrereq) return null;
  const list = metricRankings.adjustedScore;
  if (!list) return null;
  const rank = list.findIndex(x => x.id === anime.id) + 1;
  if (rank === 0) return null;
  const pct = rank / list.length;
  if (pct <= 0.10) return 'fresh';
  if (pct > 0.90) return 'rotten';
  return null;
}

function animeHasSpecialTitle(anime, key) {
  const awards = anime.specialAwards || [];
  if (key === 'medalist') return MEDALIST_AWARDS.some(a => awards.includes(a));
  if (key === 'fresh' || key === 'rotten') return getFreshRottenStatus(anime) === key;
  return awards.includes(key);
}

// ── State ──────────────────────────────────────────────────────────────────

const state = {
  genres: new Set(),
  tags: new Set(),
  studios: new Set(),
  specialTitles: new Set(),
  excludedGenres: new Set(),
  excludedTags: new Set(),
  excludedStudios: new Set(),
  excludedSpecialTitles: new Set(),
  lengths: new Set(),
  excludedLengths: new Set(),
  yearMin: null,
  yearMax: null,
  scoreMin: null,
  scoreMax: null,
  malScoreMin: null,
  malScoreMax: null,
  adjustedScoreMin: null,
  adjustedScoreMax: null,
  malTomatometerMin: null,
  malTomatometerMax: null,
};

// Default is AND (every selected filter, within and across groups, must
// match). Toggling this on switches everything to OR (any one match is enough).
let orMode = false;
let matureEnabled = false;
// Anime that need prior series/season context (requiresPrereq) are hidden
// from every view by default; this reveals them everywhere results are shown.
let showAllAnime = false;
// Populated in buildFilterUI once anime data is loaded — only Mature Content
// tags that clear the ≥5-anime qualification bar are ever shown as chips or
// used to decide whether an anime counts as "mature" for hiding purposes.
let qualifiedMatureTags = [];

// ── Data ───────────────────────────────────────────────────────────────────

let animeData = [];
let animeMap = new Map();
let tagDescriptions = {};

async function loadData() {
  const res = await fetch('data/anime.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Could not load anime.json — run fetch_anime.py first.');
  animeData = await res.json();
  animeMap = new Map(animeData.map(a => [a.id, a]));

  try {
    const tagRes = await fetch('data/tag_descriptions.json', { cache: 'no-cache' });
    if (tagRes.ok) tagDescriptions = await tagRes.json();
  } catch {
    // Tooltips are a nice-to-have; missing descriptions shouldn't break the app.
  }

  computeMetricRankings();
}

// A handful of entries (e.g. the Re:ZERO OVAs, which bundle two separate MAL
// entries) store their MAL stats in a malStats array instead of flat fields
// — fall back to the first one so those entries still rank/display.
function getStatsSource(anime) {
  return anime.malScore !== undefined
    ? anime
    : (Array.isArray(anime.malStats) && anime.malStats[0]) || {};
}

// Per-metric ranking of every anime, used to color-code each stat chip by
// how that anime's value compares to the rest of the list.
let metricRankings = {};
function computeMetricRankings() {
  metricRankings = {};
  ['malScore', 'adjustedScore', 'malTomatometer'].forEach(key => {
    const list = animeData
      .map(a => ({ id: a.id, value: getStatsSource(a)[key] }))
      .filter(x => x.value !== undefined)
      .sort((a, b) => b.value - a.value);
    metricRankings[key] = list;
  });
}

// Rank-based color coding: #1 and #2 overall get unique colors, then a
// blue gradient for top 5/10/20/50%, orange for the bottom 10%, and no
// special color for the unremarkable middle. Hover text is only shown for
// tiers that actually got a special color (top 50% or better, or bottom
// 10%) — the boring middle stretch gets neither color nor hover text.
function metricRankInfo(anilistId, key) {
  const list = metricRankings[key];
  if (!list) return null;
  const rank = list.findIndex(x => x.id === anilistId) + 1;
  if (rank === 0) return null;
  const total = list.length;
  const watched = "of the anime I've watched";

  if (rank === 1) return { color: '#8b0000', hover: `This anime is first for this metric ${watched}` };
  if (rank === 2) return { color: '#006400', hover: `This anime is second for this metric ${watched}` };

  const pct = rank / total;
  if (pct <= 0.05) return { color: '#0000cd', hover: `This anime is in the top 5% for this metric ${watched}` };
  if (pct <= 0.10) return { color: '#1e90ff', hover: `This anime is in the top 10% for this metric ${watched}` };
  if (pct <= 0.20) return { color: '#add8e6', hover: `This anime is in the top 20% for this metric ${watched}` };
  if (pct <= 0.50) return { color: '#f0ffff', hover: `This anime is in the top 50% for this metric ${watched}` };
  if (pct > 0.90) return { color: '#ff6d01', hover: `This anime is in the bottom 10% for this metric ${watched}` };

  return { color: null, hover: null };
}

// Picks readable black/white text for an arbitrary background hex color.
function readableTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#111318' : '#ffffff';
}

// ── Engine ─────────────────────────────────────────────────────────────────

// Length/Genres/Tags/Studios/Special Titles all take a `requireAll` flag —
// true (the default) means every selection of that type must match, false
// (when the OR toggle is on) means any one of them is enough. Year/Score are
// single range checks with no internal multi-select, so they don't need it.
function lengthMatches(anime, requireAll) {
  const minutes = anime.lengthMinutes;
  if (!minutes) return true;
  const hours = minutes / 60;
  const bucketMatch = {
    short: hours < 5,
    medium: hours >= 5 && hours <= 10,
    long: hours > 10,
  };
  const selected = [...state.lengths];
  return requireAll ? selected.every(k => bucketMatch[k]) : selected.some(k => bucketMatch[k]);
}

function matchesYearFilter(anime) {
  if (state.yearMin === null && state.yearMax === null) return true;
  const y = anime.year;
  if (!y) return true;
  if (state.yearMin !== null && y < state.yearMin) return false;
  if (state.yearMax !== null && y > state.yearMax) return false;
  return true;
}

function matchesScoreFilter(anime) {
  if (state.scoreMin === null && state.scoreMax === null) return true;
  const s = anime.score;
  if (!s) return true;
  if (state.scoreMin !== null && s < state.scoreMin) return false;
  if (state.scoreMax !== null && s > state.scoreMax) return false;
  return true;
}

// Scoring Metrics sliders (MAL Score, Weighted Score, Tomatometer) all follow
// the same min/max range-check shape as My Score above, just reading their
// value off getStatsSource() instead of anime.score directly.
function makeStatRangeFilter(statKey, minKey, maxKey) {
  return function (anime) {
    if (state[minKey] === null && state[maxKey] === null) return true;
    const value = getStatsSource(anime)[statKey];
    if (value === undefined) return true;
    if (state[minKey] !== null && value < state[minKey]) return false;
    if (state[maxKey] !== null && value > state[maxKey]) return false;
    return true;
  };
}
const matchesMalScoreFilter = makeStatRangeFilter('malScore', 'malScoreMin', 'malScoreMax');
const matchesAdjustedScoreFilter = makeStatRangeFilter('adjustedScore', 'adjustedScoreMin', 'adjustedScoreMax');
const matchesTomatometerFilter = makeStatRangeFilter('malTomatometer', 'malTomatometerMin', 'malTomatometerMax');

function specialTitleMatches(anime, requireAll) {
  const selected = [...state.specialTitles];
  return requireAll ? selected.every(key => animeHasSpecialTitle(anime, key)) : selected.some(key => animeHasSpecialTitle(anime, key));
}

function genreMatches(anime, requireAll) {
  const animeGenres = new Set(anime.genres.map(g => g.toLowerCase()));
  const selected = [...state.genres];
  return requireAll
    ? selected.every(g => animeGenres.has(g.toLowerCase()))
    : selected.some(g => animeGenres.has(g.toLowerCase()));
}

function tagMatches(anime, requireAll) {
  const animeTagsMap = new Map(anime.tags.map(t => [t.name.toLowerCase(), t.rank]));
  const selected = [...state.tags];
  const tagQualifies = t => {
    const rank = animeTagsMap.get(t.toLowerCase());
    return rank !== undefined && rank >= 75;
  };
  return requireAll ? selected.every(tagQualifies) : selected.some(tagQualifies);
}

function studioMatches(anime, requireAll) {
  const animeStudios = new Set((anime.studios || []).map(s => s.toLowerCase()));
  const selected = [...state.studios];
  return requireAll
    ? selected.every(s => animeStudios.has(s.toLowerCase()))
    : selected.some(s => animeStudios.has(s.toLowerCase()));
}

function isMatureAnime(anime) {
  if ((anime.genres || []).some(g => g.toLowerCase() === 'ecchi')) return true;
  const tagMap = new Map(anime.tags.map(t => [t.name.toLowerCase(), t.rank]));
  return qualifiedMatureTags.some(name => {
    const rank = tagMap.get(name.toLowerCase());
    return rank !== undefined && rank >= 75;
  });
}

function isExcluded(anime) {
  const genres = new Set(anime.genres.map(g => g.toLowerCase()));
  const tags = new Set(anime.tags.map(t => t.name.toLowerCase()));
  const studios = new Set((anime.studios || []).map(s => s.toLowerCase()));
  for (const g of state.excludedGenres) {
    if (genres.has(g.toLowerCase())) return true;
  }
  for (const t of state.excludedTags) {
    if (tags.has(t.toLowerCase())) return true;
  }
  for (const s of state.excludedStudios) {
    if (studios.has(s.toLowerCase())) return true;
  }
  for (const key of state.excludedSpecialTitles) {
    if (animeHasSpecialTitle(anime, key)) return true;
  }
  if (state.excludedLengths.size > 0) {
    const minutes = anime.lengthMinutes;
    if (minutes) {
      const hours = minutes / 60;
      const bucketMatch = {
        short: hours < 5,
        medium: hours >= 5 && hours <= 10,
        long: hours > 10,
      };
      for (const bucket of state.excludedLengths) {
        if (bucketMatch[bucket]) return true;
      }
    }
  }
  return false;
}

function scoreAnime(anime) {
  let score = 0;
  const matched = [];

  const animeGenres = new Set(anime.genres.map(g => g.toLowerCase()));
  const animeTagsMap = new Map(anime.tags.map(t => [t.name.toLowerCase(), t.rank]));

  for (const genre of state.genres) {
    if (animeGenres.has(genre.toLowerCase())) {
      score += 10;
      matched.push(genre);
    }
  }

  for (const tag of state.tags) {
    const rank = animeTagsMap.get(tag.toLowerCase());
    if (rank !== undefined && rank >= 75) {
      score += (rank / 100) * 5;
      matched.push(tag);
    }
  }

  // Studio matches aren't pushed into `matched` — the studio name is already
  // shown under the title on every card, so listing it again there would be
  // redundant.
  const animeStudios = new Set((anime.studios || []).map(s => s.toLowerCase()));
  for (const studio of state.studios) {
    if (animeStudios.has(studio.toLowerCase())) {
      score += 10;
    }
  }

  return { score, matched };
}

// Every active filter type (one with at least one selection/range set)
// becomes one boolean check per anime. Default (orMode off) requires ALL
// active checks to pass — both within a single group's multi-selections and
// across every group. Turning the OR toggle on flips both to "any one is
// enough" instead.
function passesFilters(anime, requireAll) {
  const checks = [];
  if (state.lengths.size > 0) checks.push(lengthMatches(anime, requireAll));
  if (state.yearMin !== null || state.yearMax !== null) checks.push(matchesYearFilter(anime));
  if (state.scoreMin !== null || state.scoreMax !== null) checks.push(matchesScoreFilter(anime));
  if (state.malScoreMin !== null || state.malScoreMax !== null) checks.push(matchesMalScoreFilter(anime));
  if (state.adjustedScoreMin !== null || state.adjustedScoreMax !== null) checks.push(matchesAdjustedScoreFilter(anime));
  if (state.malTomatometerMin !== null || state.malTomatometerMax !== null) checks.push(matchesTomatometerFilter(anime));
  if (state.specialTitles.size > 0) checks.push(specialTitleMatches(anime, requireAll));
  if (state.genres.size > 0) checks.push(genreMatches(anime, requireAll));
  if (state.tags.size > 0) checks.push(tagMatches(anime, requireAll));
  if (state.studios.size > 0) checks.push(studioMatches(anime, requireAll));

  if (checks.length === 0) return true;
  return requireAll ? checks.every(Boolean) : checks.some(Boolean);
}

function recommend() {
  updateFilterCount();
  const hasFilters =
    state.genres.size > 0 || state.tags.size > 0 || state.studios.size > 0 || state.specialTitles.size > 0 ||
    state.excludedGenres.size > 0 || state.excludedTags.size > 0 || state.excludedStudios.size > 0 ||
    state.excludedSpecialTitles.size > 0 || state.excludedLengths.size > 0 ||
    state.lengths.size > 0 || state.yearMin !== null || state.yearMax !== null ||
    state.scoreMin !== null || state.scoreMax !== null ||
    state.malScoreMin !== null || state.malScoreMax !== null ||
    state.adjustedScoreMin !== null || state.adjustedScoreMax !== null ||
    state.malTomatometerMin !== null || state.malTomatometerMax !== null;

  if (!hasFilters) {
    renderDefault();
    return;
  }

  const requireAll = !orMode;

  const results = animeData
    .filter(a => showAllAnime || !a.requiresPrereq)
    .filter(a => matureEnabled || !isMatureAnime(a))
    .filter(a => !isExcluded(a))
    .map(a => {
      const { score, matched } = scoreAnime(a);
      return { ...a, _score: score, matched };
    })
    .filter(a => passesFilters(a, requireAll))
    .sort((a, b) => {
      if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
      const aStats = getStatsSource(a);
      const bStats = getStatsSource(b);
      if ((bStats.adjustedScore || 0) !== (aStats.adjustedScore || 0)) return (bStats.adjustedScore || 0) - (aStats.adjustedScore || 0);
      if ((bStats.malTomatometer || 0) !== (aStats.malTomatometer || 0)) return (bStats.malTomatometer || 0) - (aStats.malTomatometer || 0);
      if ((bStats.malScore || 0) !== (aStats.malScore || 0)) return (bStats.malScore || 0) - (aStats.malScore || 0);
      return (a.title || a.titleRomaji || '').localeCompare(b.title || b.titleRomaji || '');
    });

  renderResults(results);
}

// ── Render ─────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCard(anime) {
  const title = anime.title || anime.titleRomaji;
  const score = anime.score > 0 ? `★ ${anime.score}` : '—';
  const studios = (anime.studios || []).join(', ');
  const matched = anime.matched || [];

  return `
    <div class="card" data-id="${anime.id}" title="${escapeHtml(title)}">
      <div class="card-cover">
        <img src="${escapeHtml(anime.cover)}" alt="" loading="lazy">
        <div class="card-score">${score}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(title)}</h3>
        ${studios ? `<div class="card-studio">${escapeHtml(studios)}</div>` : ''}
        ${matched.length ? `<div class="card-matched">↳ ${matched.map(escapeHtml).join(', ')}</div>` : ''}
      </div>
    </div>
  `;
}

function openModal(id) {
  const anime = animeMap.get(id);
  if (!anime) return;

  const overlay = document.getElementById('modal-overlay');
  const title = anime.title || anime.titleRomaji;

  overlay.querySelector('.modal-cover img').src = anime.cover;
  overlay.querySelector('.modal-cover img').alt = title;
  overlay.querySelector('.modal-score').textContent = anime.score > 0 ? `★ ${anime.score}` : '—';
  overlay.querySelector('.modal-title-text').textContent = title;
  overlay.querySelector('.modal-studio').textContent = (anime.studios || []).join(', ');

  const seasonChip = overlay.querySelector('.modal-season-chip');
  const seasonInfo = SEASON_META[anime.season];
  if (seasonInfo && anime.year) {
    seasonChip.textContent = `${seasonInfo.emoji} ${seasonInfo.label} ${anime.year}`;
    seasonChip.className = `modal-season-chip ${seasonInfo.className}`;
    seasonChip.classList.remove('hidden');
  } else {
    seasonChip.classList.add('hidden');
  }

  const metaRow = overlay.querySelector('.modal-meta');
  metaRow.querySelectorAll('.modal-award-chip').forEach(el => el.remove());
  const freshRottenStatus = getFreshRottenStatus(anime);
  const displayAwards = [
    ...(freshRottenStatus ? [freshRottenStatus] : []),
    ...(anime.specialAwards || []).filter(a => a !== 'fresh' && a !== 'rotten'),
  ];
  displayAwards.forEach(awardId => {
    const info = AWARD_META[awardId];
    if (!info) return;
    const chip = document.createElement('span');
    chip.className = `modal-award-chip award-chip ${info.className}`;
    chip.textContent = `${info.emoji} ${info.label(anime.year)}`;
    metaRow.appendChild(chip);
    // Fresh/Rotten hover text lives on the "Special Titles" filter chips instead.
    if (awardId !== 'fresh' && awardId !== 'rotten') {
      attachHoverTooltip(chip, info.hover(anime.year));
    }
  });

  overlay.querySelector('.modal-genres').innerHTML =
    (anime.genres || []).map(g => `<span class="genre-pill">${escapeHtml(g)}</span>`).join('');

  const statsSource = getStatsSource(anime);
  const statsSection = overlay.querySelector('.modal-stats-section');
  const statsRow = overlay.querySelector('.modal-stats');
  statsRow.innerHTML = '';
  ['malScore', 'adjustedScore', 'malTomatometer'].forEach(key => {
    const value = statsSource[key];
    if (value === undefined) return;
    const meta = MAL_STAT_META[key];
    const chip = document.createElement('span');
    chip.className = 'stat-chip';
    chip.textContent = meta.label(value);
    const rankInfo = metricRankInfo(anime.id, key);
    if (rankInfo?.color) {
      chip.style.background = rankInfo.color;
      chip.style.borderColor = rankInfo.color;
      chip.style.color = readableTextColor(rankInfo.color);
    }
    if (rankInfo?.hover) {
      attachHoverTooltip(chip, rankInfo.hover);
    } else {
      chip.style.cursor = 'default';
    }
    statsRow.appendChild(chip);
  });
  statsSection.classList.toggle('hidden', statsRow.children.length === 0);

  overlay.querySelector('.modal-description').textContent =
    anime.description || 'No description available.';
  const reviewLink = overlay.querySelector('.modal-review-link');
  const reviewUrl = (anime.notes || '').match(/https?:\/\/\S+/)?.[0] ?? null;
  if (reviewUrl) {
    reviewLink.href = reviewUrl;
    reviewLink.classList.remove('hidden');
  } else {
    reviewLink.classList.add('hidden');
  }

  const anilistUrl = /^https?:\/\//.test(anime.url || '') ? anime.url : '#';
  overlay.querySelector('.modal-anilist-link').href = anilistUrl;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderResults(results) {
  const grid = document.getElementById('results');
  const status = document.getElementById('status-bar');

  if (!results.length) {
    status.textContent = '';
    status.classList.add('hidden');
    grid.innerHTML = `
      <div class="empty-state">
        <div class="emoji">¯\\_(ツ)_/¯</div>
        <p>No matches for those filters. Try removing some or picking different combinations.</p>
      </div>`;
    return;
  }

  status.textContent = `${results.length} match${results.length === 1 ? '' : 'es'} from my completed list`;
  status.classList.remove('hidden');
  grid.innerHTML = results.map(renderCard).join('');
}

function renderHeroCollage() {
  const collage = document.getElementById('hero-collage');
  if (!collage) return;

  const covers = animeData.filter(a => !a.requiresPrereq && !isMatureAnime(a) && a.cover).map(a => a.cover);
  const shuffled = [...covers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const tileCount = 32;
  collage.innerHTML = shuffled.slice(0, tileCount)
    .map(url => `<img src="${escapeHtml(url)}" alt="" loading="lazy">`)
    .join('');
}

function renderDefault() {
  const grid = document.getElementById('results');
  const status = document.getElementById('status-bar');
  const top = animeData
    .filter(a => (showAllAnime || !a.requiresPrereq) && a.score >= 9)
    .filter(a => matureEnabled || !isMatureAnime(a))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if ((b.averageScore || 0) !== (a.averageScore || 0)) return (b.averageScore || 0) - (a.averageScore || 0);
      return (a.title || a.titleRomaji || '').localeCompare(b.title || b.titleRomaji || '');
    });

  if (!top.length) {
    grid.innerHTML = '';
    status.classList.add('hidden');
    return;
  }

  status.textContent = 'My highest-rated picks — select filters above to find something specific';
  status.classList.remove('hidden');
  grid.innerHTML = top.map(renderCard).join('');
}

function updateFilterCount() {
  const count =
    state.genres.size + state.tags.size + state.studios.size + state.specialTitles.size +
    state.excludedGenres.size + state.excludedTags.size + state.excludedStudios.size +
    state.excludedSpecialTitles.size + state.excludedLengths.size +
    state.lengths.size +
    (state.yearMin !== null || state.yearMax !== null ? 1 : 0) +
    (state.scoreMin !== null || state.scoreMax !== null ? 1 : 0) +
    (state.malScoreMin !== null || state.malScoreMax !== null ? 1 : 0) +
    (state.adjustedScoreMin !== null || state.adjustedScoreMax !== null ? 1 : 0) +
    (state.malTomatometerMin !== null || state.malTomatometerMax !== null ? 1 : 0);
  const el = document.getElementById('filter-count');
  if (el) el.textContent = count > 0 ? `${count} filter${count === 1 ? '' : 's'} active` : '';
  updateGroupBadges();
}

// ── Tag tooltips ───────────────────────────────────────────────────────────
// Desktop: hover (with a short delay) or keyboard focus shows the tooltip.
// Mobile: long-press (~500ms) shows it without triggering the tap-to-select
// action; a normal quick tap still selects the chip as usual.

let tooltipEl = null;
let tooltipHoverTimer = null;
let tooltipOwner = null;

function ensureTooltipEl() {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'tag-tooltip hidden';
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}

function showTooltip(target, text) {
  const el = ensureTooltipEl();
  el.textContent = text;
  el.classList.remove('hidden');
  tooltipOwner = target;

  const rect = target.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  let top = rect.top - elRect.height - 8;
  const placedAbove = top >= 8;
  if (!placedAbove) top = rect.bottom + 8;

  let left = rect.left + rect.width / 2 - elRect.width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - elRect.width - 8));

  el.style.top = `${top + window.scrollY}px`;
  el.style.left = `${left + window.scrollX}px`;
  el.classList.toggle('tooltip-below', !placedAbove);
}

function hideTooltip() {
  if (tooltipEl) tooltipEl.classList.add('hidden');
  tooltipOwner = null;
}

function attachHoverTooltip(el, text, { suppressClick = false } = {}) {
  el.addEventListener('mouseenter', () => {
    clearTimeout(tooltipHoverTimer);
    tooltipHoverTimer = setTimeout(() => showTooltip(el, text), 350);
  });
  el.addEventListener('mouseleave', () => {
    clearTimeout(tooltipHoverTimer);
    hideTooltip();
  });
  el.addEventListener('focus', () => showTooltip(el, text));
  el.addEventListener('blur', hideTooltip);

  let longPressTimer = null;
  const cancelLongPress = () => clearTimeout(longPressTimer);
  el.addEventListener('touchstart', () => {
    cancelLongPress();
    longPressTimer = setTimeout(() => {
      showTooltip(el, text);
      if (suppressClick) el._suppressClick = true;
    }, 500);
  }, { passive: true });
  el.addEventListener('touchend', cancelLongPress);
  el.addEventListener('touchmove', cancelLongPress);
  el.addEventListener('touchcancel', cancelLongPress);
}

// ── Filter UI ──────────────────────────────────────────────────────────────

// Every chip type gets its own include/exclude Set pair so the same
// Unselected → Include → Exclude → Unselected cycle works everywhere.
const CHIP_SETS = {
  genre: ['genres', 'excludedGenres'],
  studio: ['studios', 'excludedStudios'],
  tag: ['tags', 'excludedTags'],
  length: ['lengths', 'excludedLengths'],
  specialTitle: ['specialTitles', 'excludedSpecialTitles'],
};

function makeFilterChip(label, type, extraClass, value, hoverText) {
  value = value !== undefined ? value : label;

  const btn = document.createElement('button');
  btn.className = 'filter-chip' + (extraClass ? ` ${extraClass}` : '');
  btn.textContent = label;
  btn.dataset.type = type;
  btn.dataset.value = value;

  if (hoverText) {
    attachHoverTooltip(btn, hoverText, { suppressClick: true });
  } else if (type === 'tag' && tagDescriptions[label]) {
    attachHoverTooltip(btn, tagDescriptions[label], { suppressClick: true });
  }

  btn.addEventListener('click', () => {
    if (btn._suppressClick) {
      btn._suppressClick = false;
      return;
    }
    hideTooltip();
    const [includeKey, excludeKey] = CHIP_SETS[type];
    const includeSet = state[includeKey];
    const excludeSet = state[excludeKey];

    if (!includeSet.has(value) && !excludeSet.has(value)) {
      // Unselected → Include
      includeSet.add(value);
      btn.classList.add('active');
    } else if (includeSet.has(value)) {
      // Include → Exclude
      includeSet.delete(value);
      excludeSet.add(value);
      btn.classList.remove('active');
      btn.classList.add('excluded');
    } else {
      // Exclude → Unselected
      excludeSet.delete(value);
      btn.classList.remove('excluded');
      btn.blur();
    }

    recommend();
  });

  return btn;
}

const collapsibleGroups = [];

function makeGroup(label, extraClass) {
  const group = document.createElement('div');
  group.className = 'filter-group' + (extraClass ? ` ${extraClass}` : '');
  const labelEl = document.createElement('div');
  labelEl.className = 'filter-group-label';
  labelEl.textContent = label;
  const chips = document.createElement('div');
  chips.className = 'filter-chips';
  group.appendChild(labelEl);
  group.appendChild(chips);
  return { group, chips };
}

// Reusable dual-handle range slider — same mechanics as Year Range (two
// overlapping <input type="range"> elements plus a fill bar), just
// parameterized so Scoring Metrics can build four of these without
// re-deriving the whole widget each time.
function makeRangeSlider({ idPrefix, min, max, step = 1, formatValue = (v) => v, onChange }) {
  const parse = step < 1 ? parseFloat : (v) => parseInt(v, 10);
  const wrapper = document.createElement('div');
  wrapper.className = 'year-slider-wrapper';

  const display = document.createElement('div');
  display.className = 'year-display';
  const minLabel = document.createElement('span');
  minLabel.className = 'year-display-val';
  minLabel.id = `${idPrefix}-min-display`;
  minLabel.textContent = formatValue(min);
  const dash = document.createElement('span');
  dash.className = 'year-display-dash';
  dash.textContent = '—';
  const maxLabel = document.createElement('span');
  maxLabel.className = 'year-display-val';
  maxLabel.id = `${idPrefix}-max-display`;
  maxLabel.textContent = formatValue(max);
  display.appendChild(minLabel);
  display.appendChild(dash);
  display.appendChild(maxLabel);

  const trackContainer = document.createElement('div');
  trackContainer.className = 'year-track-container';
  const trackBg = document.createElement('div');
  trackBg.className = 'year-track-bg';
  const trackFill = document.createElement('div');
  trackFill.className = 'year-track-fill';
  trackFill.id = `${idPrefix}-track-fill`;
  trackBg.appendChild(trackFill);

  const minInput = document.createElement('input');
  minInput.type = 'range';
  minInput.className = 'year-slider';
  minInput.id = `${idPrefix}-slider-min`;
  minInput.min = min;
  minInput.max = max;
  minInput.step = step;
  minInput.value = min;
  minInput.style.zIndex = '4';

  const maxInput = document.createElement('input');
  maxInput.type = 'range';
  maxInput.className = 'year-slider';
  maxInput.id = `${idPrefix}-slider-max`;
  maxInput.min = min;
  maxInput.max = max;
  maxInput.step = step;
  maxInput.value = max;
  maxInput.style.zIndex = '3';

  const updateFill = () => {
    const range = max - min;
    const lo = parse(minInput.value);
    const hi = parse(maxInput.value);
    trackFill.style.left = ((lo - min) / range * 100) + '%';
    trackFill.style.right = ((max - hi) / range * 100) + '%';
    minLabel.textContent = formatValue(lo);
    maxLabel.textContent = formatValue(hi);
    minInput.style.zIndex = (hi > min && (lo <= min || lo >= hi)) ? '4' : '2';
  };

  const handleChange = () => {
    const lo = parse(minInput.value) <= min ? null : parse(minInput.value);
    const hi = parse(maxInput.value) >= max ? null : parse(maxInput.value);
    updateFill();
    onChange(lo, hi);
    recommend();
  };

  minInput.addEventListener('input', () => {
    if (parse(minInput.value) > parse(maxInput.value)) minInput.value = maxInput.value;
    handleChange();
  });
  maxInput.addEventListener('input', () => {
    if (parse(maxInput.value) < parse(minInput.value)) maxInput.value = minInput.value;
    handleChange();
  });

  trackContainer.appendChild(trackBg);
  trackContainer.appendChild(minInput);
  trackContainer.appendChild(maxInput);
  wrapper.appendChild(display);
  wrapper.appendChild(trackContainer);
  return wrapper;
}

// Collapsible groups render their name as a small pill in a shared, wrapping
// nav row instead of a full-width label — clicking a pill reveals the group's
// content (label + chips) below the nav, keeping the panel compact when
// nothing is expanded instead of stacking empty full-width rows.
function makeCollapsibleGroup(label, categoryNav, extraClass, countFn) {
  // extraClass (e.g. nsfw-group) controls a separate show/hide concern (the
  // 18+ toggle) that must not compete with the collapsed/expanded state on
  // the same element — both would otherwise fight over `display` via CSS
  // specificity. Put extraClass on an outer wrapper instead.
  const group = document.createElement('div');
  group.className = 'filter-group collapsed';
  const labelEl = document.createElement('div');
  labelEl.className = 'filter-group-label';
  labelEl.textContent = label;
  const chips = document.createElement('div');
  chips.className = 'filter-chips';
  group.appendChild(labelEl);
  group.appendChild(chips);

  const outer = extraClass ? document.createElement('div') : group;
  if (extraClass) {
    outer.className = `${extraClass} nsfw-group-wrapper`;
    outer.appendChild(group);
  }

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'category-toggle';
  const text = document.createElement('span');
  text.className = 'label-text';
  text.textContent = label;
  const badge = document.createElement('span');
  badge.className = 'group-badge hidden';
  const chevron = document.createElement('span');
  chevron.className = 'collapse-chevron';
  chevron.textContent = '▾';
  toggleBtn.appendChild(text);
  toggleBtn.appendChild(badge);
  toggleBtn.appendChild(chevron);
  if (extraClass) toggleBtn.classList.add(extraClass);
  toggleBtn.addEventListener('click', () => {
    const collapsed = group.classList.toggle('collapsed');
    toggleBtn.classList.toggle('expanded', !collapsed);
    chevron.textContent = collapsed ? '▾' : '▴';
  });
  categoryNav.appendChild(toggleBtn);

  collapsibleGroups.push({ chips, badge, countFn });
  return { group: outer, chips };
}

function updateGroupBadges() {
  collapsibleGroups.forEach(({ chips, badge, countFn }) => {
    const count = countFn ? countFn() : chips.querySelectorAll('.filter-chip.active, .filter-chip.excluded').length;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  });
}

function buildFilterUI() {
  const panel = document.getElementById('filter-panel');

  // Mature Content tag qualification is computed first (before Genres/Studio
  // below use isMatureAnime) — only tags appearing in ≥5 non-prerequisite
  // anime, same qualification bar as Genres/Studio.
  const matureTagCounts = new Map();
  animeData
    .filter(a => !a.requiresPrereq)
    .forEach(a => {
      const tagMap = new Map(a.tags.map(t => [t.name.toLowerCase(), t.rank]));
      NSFW_GROUP.items.forEach(item => {
        const rank = tagMap.get(item.toLowerCase());
        if (rank !== undefined && rank >= 75) {
          matureTagCounts.set(item, (matureTagCounts.get(item) || 0) + 1);
        }
      });
    });
  qualifiedMatureTags = NSFW_GROUP.items.filter(item => (matureTagCounts.get(item) || 0) >= 5);

  // Length (total watch time = episodes × episode duration)
  const { group: lengthGroup, chips: lengthChips } = makeGroup('Length');
  [['short', 'Short (< 5 hrs)'], ['medium', 'Medium (5–10 hrs)'], ['long', 'Long (> 10 hrs)']].forEach(([val, label]) => {
    lengthChips.appendChild(makeFilterChip(label, 'length', null, val));
  });
  panel.appendChild(lengthGroup);

  // Year range slider
  const years = [...new Set(animeData.map(a => a.year).filter(Boolean))].sort((a, b) => a - b);
  const dataMinYear = years[0];
  const dataMaxYear = years[years.length - 1];

  const { group: yearGroup, chips: yearChips } = makeGroup('Year Range');
  yearChips.classList.add('year-range-chips');

  const sliderWrapper = document.createElement('div');
  sliderWrapper.className = 'year-slider-wrapper';

  const yearDisplay = document.createElement('div');
  yearDisplay.className = 'year-display';
  const minLabel = document.createElement('span');
  minLabel.className = 'year-display-val';
  minLabel.id = 'year-min-display';
  minLabel.textContent = dataMinYear;
  const yearDash = document.createElement('span');
  yearDash.className = 'year-display-dash';
  yearDash.textContent = '—';
  const maxLabel = document.createElement('span');
  maxLabel.className = 'year-display-val';
  maxLabel.id = 'year-max-display';
  maxLabel.textContent = dataMaxYear;
  yearDisplay.appendChild(minLabel);
  yearDisplay.appendChild(yearDash);
  yearDisplay.appendChild(maxLabel);

  const trackContainer = document.createElement('div');
  trackContainer.className = 'year-track-container';
  const trackBg = document.createElement('div');
  trackBg.className = 'year-track-bg';
  const trackFill = document.createElement('div');
  trackFill.className = 'year-track-fill';
  trackFill.id = 'year-track-fill';
  trackBg.appendChild(trackFill);

  const minInput = document.createElement('input');
  minInput.type = 'range';
  minInput.className = 'year-slider';
  minInput.id = 'year-slider-min';
  minInput.min = dataMinYear;
  minInput.max = dataMaxYear;
  minInput.value = dataMinYear;
  minInput.style.zIndex = '4';

  const maxInput = document.createElement('input');
  maxInput.type = 'range';
  maxInput.className = 'year-slider';
  maxInput.id = 'year-slider-max';
  maxInput.min = dataMinYear;
  maxInput.max = dataMaxYear;
  maxInput.value = dataMaxYear;
  maxInput.style.zIndex = '3';

  const updateFill = () => {
    const range = dataMaxYear - dataMinYear;
    const lo = parseInt(minInput.value);
    const hi = parseInt(maxInput.value);
    trackFill.style.left  = ((lo - dataMinYear) / range * 100) + '%';
    trackFill.style.right = ((dataMaxYear - hi)  / range * 100) + '%';
    minLabel.textContent = lo;
    maxLabel.textContent = hi;
    minInput.style.zIndex = (hi > dataMinYear && (lo <= dataMinYear || lo >= hi)) ? '4' : '2';
  };

  minInput.addEventListener('input', () => {
    if (parseInt(minInput.value) > parseInt(maxInput.value)) minInput.value = maxInput.value;
    state.yearMin = parseInt(minInput.value) <= dataMinYear ? null : parseInt(minInput.value);
    state.yearMax = parseInt(maxInput.value) >= dataMaxYear ? null : parseInt(maxInput.value);
    updateFill();
    recommend();
  });

  maxInput.addEventListener('input', () => {
    if (parseInt(maxInput.value) < parseInt(minInput.value)) maxInput.value = minInput.value;
    state.yearMin = parseInt(minInput.value) <= dataMinYear ? null : parseInt(minInput.value);
    state.yearMax = parseInt(maxInput.value) >= dataMaxYear ? null : parseInt(maxInput.value);
    updateFill();
    recommend();
  });

  trackContainer.appendChild(trackBg);
  trackContainer.appendChild(minInput);
  trackContainer.appendChild(maxInput);
  sliderWrapper.appendChild(yearDisplay);
  sliderWrapper.appendChild(trackContainer);
  yearChips.appendChild(sliderWrapper);
  panel.appendChild(yearGroup);

  // Scoring Metrics: My Score plus the three MAL-derived stats, all sharing
  // the same dual-handle slider widget. Lives where the standalone "My
  // Score" group used to be — always expanded, not folded into the
  // alphabetized "Additional Filters" pills below.
  const SCORING_METRICS = [
    {
      label: 'My Score', idPrefix: 'score', min: 1, max: 10,
      minKey: 'scoreMin', maxKey: 'scoreMax', hover: 'This is the score you gave this anime',
    },
    {
      label: MAL_STAT_META.malScore.name, idPrefix: 'mal-score', min: 1, max: 10, step: 0.01,
      minKey: 'malScoreMin', maxKey: 'malScoreMax', hover: MAL_STAT_META.malScore.hover, formatValue: (v) => v.toFixed(2),
    },
    {
      label: MAL_STAT_META.adjustedScore.name, idPrefix: 'weighted-score', min: 1, max: 10, step: 0.01,
      minKey: 'adjustedScoreMin', maxKey: 'adjustedScoreMax', hover: MAL_STAT_META.adjustedScore.hover, formatValue: (v) => v.toFixed(2),
    },
    {
      label: MAL_STAT_META.malTomatometer.name, idPrefix: 'tomatometer', min: 0, max: 100, step: 0.1,
      minKey: 'malTomatometerMin', maxKey: 'malTomatometerMax', hover: MAL_STAT_META.malTomatometer.hover, formatValue: (v) => `${v.toFixed(1)}%`,
    },
  ];

  function renderScoringMetrics(chips) {
    SCORING_METRICS.forEach(metric => {
      const row = document.createElement('div');
      row.className = 'scoring-metric-row';
      const label = document.createElement('div');
      label.className = 'scoring-metric-label';
      label.textContent = metric.label;
      attachHoverTooltip(label, metric.hover);
      const slider = makeRangeSlider({
        idPrefix: metric.idPrefix,
        min: metric.min,
        max: metric.max,
        step: metric.step,
        formatValue: metric.formatValue,
        onChange: (lo, hi) => {
          state[metric.minKey] = lo;
          state[metric.maxKey] = hi;
        },
      });
      row.appendChild(label);
      row.appendChild(slider);
      chips.appendChild(row);
    });
  }

  const { group: scoringGroup, chips: scoringChips } = makeGroup('Scoring Metrics');
  scoringChips.classList.add('year-range-chips');
  renderScoringMetrics(scoringChips);
  panel.appendChild(scoringGroup);

  // Special Titles (Certified Fresh/Rotten, Award Winning — derived from specialAwards)
  const { group: specialGroup, chips: specialChips } = makeGroup('Special Titles');
  Object.entries(SPECIAL_TITLES_META).forEach(([key, meta]) => {
    specialChips.appendChild(makeFilterChip(meta.label, 'specialTitle', null, key, meta.hover));
  });
  panel.appendChild(specialGroup);

  // Genres (only ones appearing in ≥5 anime that are visible with Mature
  // Content off — otherwise a genre could "qualify" purely off mature
  // anime and then show fewer than 5 results whenever the toggle is off)
  const genreCounts = new Map();
  animeData
    .filter(a => !a.requiresPrereq && !isMatureAnime(a))
    .forEach(a => [...new Set(a.genres || [])].forEach(g => genreCounts.set(g, (genreCounts.get(g) || 0) + 1)));
  const qualifiedGenres = ALL_GENRES.filter(g => (genreCounts.get(g) || 0) >= 5);
  const { group: genreGroup, chips: genreChips } = makeGroup('Genres');
  qualifiedGenres.forEach(g => genreChips.appendChild(makeFilterChip(g, 'genre')));
  genreChips.appendChild(makeFilterChip('Ecchi', 'genre', 'nsfw-chip'));
  panel.appendChild(genreGroup);

  // Shared compact nav row for every collapsible group's toggle pill —
  // expanded content renders below this, in group order, only for open ones.
  // Wrapped in a filter-group so its label/pills line up with Genres above.
  const { group: additionalGroup, chips: categoryNav } = makeGroup('Additional Filters');
  categoryNav.classList.remove('filter-chips');
  categoryNav.classList.add('category-toggles');
  panel.appendChild(additionalGroup);

  // Studio (dynamic — only studios with ≥5 anime visible with Mature
  // Content off, same reasoning as Genres above)
  const studioCounts = new Map();
  animeData
    .filter(a => !a.requiresPrereq && !isMatureAnime(a))
    .forEach(a => [...new Set(a.studios || [])].forEach(s => studioCounts.set(s, (studioCounts.get(s) || 0) + 1)));
  const qualifiedStudios = [...studioCounts.entries()]
    .filter(([, n]) => n >= 5)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name]) => name);

  // Every collapsible pill in "Additional Filters", rendered alphabetically
  // by label rather than in source-definition order.
  const additionalGroups = [
    { label: 'Demographic', items: DEMOGRAPHICS, type: 'tag' },
    ...FILTER_GROUPS.map(({ label, items }) => ({ label, items, type: 'tag' })),
    ...(qualifiedStudios.length ? [{ label: 'Studio', items: qualifiedStudios, type: 'studio' }] : []),
    { label: NSFW_GROUP.label, items: qualifiedMatureTags, type: 'tag', extraClass: 'nsfw-group' },
  ].sort((a, b) => a.label.localeCompare(b.label));

  additionalGroups.forEach(({ label, items, type, extraClass }) => {
    const { group, chips } = makeCollapsibleGroup(label, categoryNav, extraClass);
    items.forEach(item => chips.appendChild(makeFilterChip(item, type)));
    panel.appendChild(group);
  });
}

function toggle18plus(enabled) {
  matureEnabled = enabled;
  document.body.classList.toggle('show-18plus', enabled);
  if (!enabled) {
    document.querySelectorAll('.nsfw-chip, .nsfw-group .filter-chip').forEach(btn => {
      const val = btn.dataset.value;
      if (btn.classList.contains('active')) {
        if (btn.dataset.type === 'genre') state.genres.delete(val);
        else state.tags.delete(val);
      } else if (btn.classList.contains('excluded')) {
        if (btn.dataset.type === 'genre') state.excludedGenres.delete(val);
        else state.excludedTags.delete(val);
      }
      btn.classList.remove('active', 'excluded');
    });
  }
  recommend();
}

function resetRangeSlider(idPrefix, formatValue = (v) => v) {
  const minSlider = document.getElementById(`${idPrefix}-slider-min`);
  const maxSlider = document.getElementById(`${idPrefix}-slider-max`);
  if (!minSlider || !maxSlider) return;
  minSlider.value = minSlider.min;
  maxSlider.value = maxSlider.max;
  const fill = document.getElementById(`${idPrefix}-track-fill`);
  if (fill) { fill.style.left = '0%'; fill.style.right = '0%'; }
  const minDisp = document.getElementById(`${idPrefix}-min-display`);
  const maxDisp = document.getElementById(`${idPrefix}-max-display`);
  if (minDisp) minDisp.textContent = formatValue(parseFloat(minSlider.min));
  if (maxDisp) maxDisp.textContent = formatValue(parseFloat(maxSlider.max));
}

function clearAllFilters() {
  state.genres.clear();
  state.tags.clear();
  state.studios.clear();
  state.specialTitles.clear();
  state.excludedGenres.clear();
  state.excludedTags.clear();
  state.excludedStudios.clear();
  state.excludedSpecialTitles.clear();
  state.lengths.clear();
  state.excludedLengths.clear();
  state.yearMin = null;
  state.yearMax = null;
  state.scoreMin = null;
  state.scoreMax = null;
  state.malScoreMin = null;
  state.malScoreMax = null;
  state.adjustedScoreMin = null;
  state.adjustedScoreMax = null;
  state.malTomatometerMin = null;
  state.malTomatometerMax = null;
  document.querySelectorAll('.filter-chip.active, .filter-chip.excluded')
    .forEach(btn => btn.classList.remove('active', 'excluded'));
  resetRangeSlider('year');
  resetRangeSlider('score');
  resetRangeSlider('mal-score', (v) => v.toFixed(2));
  resetRangeSlider('weighted-score', (v) => v.toFixed(2));
  resetRangeSlider('tomatometer', (v) => `${v.toFixed(1)}%`);
  recommend();
}

// ── Init ───────────────────────────────────────────────────────────────────

async function init() {
  const grid = document.getElementById('results');
  grid.innerHTML = '<div class="loading">Loading…</div>';

  document.body.insertAdjacentHTML('beforeend', `
    <div id="modal-overlay" class="modal-overlay hidden" role="dialog" aria-modal="true">
      <div class="modal">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-inner">
          <div class="modal-cover">
            <img src="" alt="" loading="lazy">
            <div class="modal-score"></div>
          </div>
          <div class="modal-content">
            <h2 class="modal-title"><span class="modal-title-text"></span><span class="modal-studio"></span></h2>
            <div class="modal-meta">
              <span class="modal-season-chip"></span>
            </div>
            <div class="modal-stats-section hidden">
              <div class="modal-stats-label">Stats</div>
              <div class="modal-stats"></div>
            </div>
            <div class="modal-genres-section">
              <div class="modal-stats-label">Genres</div>
              <div class="modal-genres"></div>
            </div>
            <p class="modal-description"></p>
            <a class="modal-review-link hidden" href="#" target="_blank" rel="noopener">Read Jeric's Review →</a>
            <a class="modal-anilist-link" href="#" target="_blank" rel="noopener">View on Anilist →</a>
          </div>
        </div>
      </div>
    </div>
  `);

  const overlay = document.getElementById('modal-overlay');
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.addEventListener('click', e => {
    if (tooltipOwner && e.target !== tooltipOwner) hideTooltip();
  });
  document.addEventListener('touchstart', e => {
    if (tooltipOwner && e.target !== tooltipOwner) hideTooltip();
  }, { passive: true });
  window.addEventListener('scroll', hideTooltip, { passive: true });
  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (card && card.dataset.id) openModal(parseInt(card.dataset.id));
  });

  try {
    await loadData();
  } catch (err) {
    const errEl = document.createElement('div');
    errEl.className = 'error-state';
    errEl.innerHTML = '<p></p>';
    errEl.querySelector('p').textContent = `⚠ ${err.message}`;
    grid.replaceChildren(errEl);
    return;
  }

  buildFilterUI();
  renderHeroCollage();

  document.getElementById('toggle-18plus').addEventListener('change', e => toggle18plus(e.target.checked));
  document.getElementById('toggle-or-mode').addEventListener('change', e => { orMode = e.target.checked; recommend(); });
  document.getElementById('toggle-show-all').addEventListener('change', e => { showAllAnime = e.target.checked; recommend(); });
  document.getElementById('clear-filters').addEventListener('click', clearAllFilters);

  const filtersToggleBtn = document.getElementById('filters-toggle');
  const filterPanel = document.getElementById('filter-panel');
  const orModeLabel = document.getElementById('or-mode-label');
  filtersToggleBtn.addEventListener('click', () => {
    const collapsed = filterPanel.classList.toggle('collapsed');
    filtersToggleBtn.setAttribute('aria-expanded', String(!collapsed));
    filtersToggleBtn.querySelector('.filters-chevron').textContent = collapsed ? '▾' : '▴';
    orModeLabel.classList.toggle('hidden', collapsed);
  });

  renderDefault();
}

init();
