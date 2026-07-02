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
    label: 'Hobbies & Activities',
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
    emoji: '🥇',
    className: 'award-gold',
    label: () => "Jeric's AOTY Winner",
    hover: () => 'This anime is my favorite from this year!',
  },
  fivechAOTY: {
    emoji: '🥇',
    className: 'award-gold',
    label: () => '5ch AOTY Winner',
    hover: () => 'This anime was crowned Anime of the Year by members of 5ch!',
  },
  jury: {
    emoji: '🥇',
    className: 'award-gold',
    label: () => 'r/anime AOTY Jury Winner',
    hover: () => 'This anime won the r/anime Anime of the Year award among the jury!',
  },
  public: {
    emoji: '🥇',
    className: 'award-gold',
    label: () => 'r/anime AOTY Public Winner',
    hover: () => 'This anime won the r/anime Anime of the Year award among the public!',
  },
  motyJury: {
    emoji: '🥇',
    className: 'award-gold',
    label: () => 'r/anime MOTY Jury Winner',
    hover: () => 'This anime won the r/anime Movie of the Year award among the jury!',
  },
  motyPublic: {
    emoji: '🥇',
    className: 'award-gold',
    label: () => 'r/anime MOTY Public Winner',
    hover: () => 'This anime won the r/anime Movie of the Year award among the public!',
  },
  fresh: {
    emoji: '🍅',
    className: 'award-fresh',
    label: () => 'Certified Fresh',
    hover: () => 'Anime that are highly-acclaimed and good starters, regardless of what genres you usually watch.',
  },
  rotten: {
    emoji: '🗑️',
    className: 'award-rotten',
    label: () => 'Certified Rotten',
    hover: () => 'Anime that score poorly across most metrics. Watch at your own risk.',
  },
};

// Filter chips for anime.specialAwards — "medalist" covers any AOTY/MOTY win
const SPECIAL_TITLES_META = {
  fresh: { label: `${AWARD_META.fresh.emoji} Certified Fresh`, hover: AWARD_META.fresh.hover() },
  rotten: { label: `${AWARD_META.rotten.emoji} Certified Rotten`, hover: AWARD_META.rotten.hover() },
  medalist: {
    label: '🥇 Medalists',
    hover: 'Anime recognized for outstanding achievement in their year of release.',
  },
};

const MEDALIST_AWARDS = ['gold', 'fivechAOTY', 'jury', 'public', 'motyJury', 'motyPublic'];

function animeHasSpecialTitle(anime, key) {
  const awards = anime.specialAwards || [];
  if (key === 'medalist') return MEDALIST_AWARDS.some(a => awards.includes(a));
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
  lengths: new Set(),
  yearMin: null,
  yearMax: null,
  scoreMin: null,
  scoreMax: null,
};

let andMode = false;
let matureEnabled = false;
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
}

// ── Engine ─────────────────────────────────────────────────────────────────

function matchesLengthFilter(anime) {
  if (state.lengths.size === 0) return true;
  const minutes = anime.lengthMinutes;
  if (!minutes) return true;
  const hours = minutes / 60;
  const bucketMatch = {
    short: hours < 5,
    medium: hours >= 5 && hours <= 10,
    long: hours > 10,
  };
  const selected = [...state.lengths];
  return andMode ? selected.every(k => bucketMatch[k]) : selected.some(k => bucketMatch[k]);
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

function matchesSpecialTitleFilter(anime) {
  if (state.specialTitles.size === 0) return true;
  const selected = [...state.specialTitles];
  return andMode ? selected.every(key => animeHasSpecialTitle(anime, key)) : selected.some(key => animeHasSpecialTitle(anime, key));
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

function matchesAllFilters(anime) {
  const animeGenres = new Set(anime.genres.map(g => g.toLowerCase()));
  const animeTagsMap = new Map(anime.tags.map(t => [t.name.toLowerCase(), t.rank]));
  const animeStudios = new Set((anime.studios || []).map(s => s.toLowerCase()));
  for (const g of state.genres) {
    if (!animeGenres.has(g.toLowerCase())) return false;
  }
  for (const t of state.tags) {
    const rank = animeTagsMap.get(t.toLowerCase());
    if (rank === undefined || rank < 75) return false;
  }
  for (const s of state.studios) {
    if (!animeStudios.has(s.toLowerCase())) return false;
  }
  return true;
}

function recommend() {
  updateFilterCount();
  const hasFilters =
    state.genres.size > 0 || state.tags.size > 0 || state.studios.size > 0 || state.specialTitles.size > 0 ||
    state.excludedGenres.size > 0 || state.excludedTags.size > 0 || state.excludedStudios.size > 0 ||
    state.lengths.size > 0 || state.yearMin !== null || state.yearMax !== null ||
    state.scoreMin !== null || state.scoreMax !== null;

  if (!hasFilters) {
    renderDefault();
    return;
  }

  const noScoringFilters = state.genres.size === 0 && state.tags.size === 0 && state.studios.size === 0;

  const results = animeData
    .filter(a => !a.requiresPrereq)
    .filter(a => matureEnabled || !isMatureAnime(a))
    .filter(matchesLengthFilter)
    .filter(matchesYearFilter)
    .filter(matchesScoreFilter)
    .filter(matchesSpecialTitleFilter)
    .filter(a => !isExcluded(a))
    .map(a => {
      const { score, matched } = scoreAnime(a);
      return { ...a, _score: score, matched };
    })
    .filter(a => noScoringFilters || (andMode ? matchesAllFilters(a) : a._score > 0))
    .sort((a, b) => {
      if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
      if (b._score !== a._score) return b._score - a._score;
      if ((b.averageScore || 0) !== (a.averageScore || 0)) return (b.averageScore || 0) - (a.averageScore || 0);
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
  (anime.specialAwards || []).forEach(awardId => {
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

function renderDefault() {
  const grid = document.getElementById('results');
  const status = document.getElementById('status-bar');
  const top = animeData
    .filter(a => !a.requiresPrereq && a.score >= 9)
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
    state.lengths.size +
    (state.yearMin !== null || state.yearMax !== null ? 1 : 0) +
    (state.scoreMin !== null || state.scoreMax !== null ? 1 : 0);
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

function makeFilterChip(label, type, extraClass, value) {
  value = value !== undefined ? value : label;

  const btn = document.createElement('button');
  btn.className = 'filter-chip' + (extraClass ? ` ${extraClass}` : '');
  btn.textContent = label;
  btn.dataset.type = type;
  btn.dataset.value = value;

  if (type === 'tag' && tagDescriptions[label]) {
    attachHoverTooltip(btn, tagDescriptions[label], { suppressClick: true });
  }

  btn.addEventListener('click', () => {
    if (btn._suppressClick) {
      btn._suppressClick = false;
      return;
    }
    hideTooltip();
    const includeSet = type === 'genre' ? state.genres : type === 'studio' ? state.studios : state.tags;
    const excludeSet = type === 'genre' ? state.excludedGenres : type === 'studio' ? state.excludedStudios : state.excludedTags;

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

// Collapsible groups render their name as a small pill in a shared, wrapping
// nav row instead of a full-width label — clicking a pill reveals the group's
// content (label + chips) below the nav, keeping the panel compact when
// nothing is expanded instead of stacking empty full-width rows.
function makeCollapsibleGroup(label, categoryNav, extraClass) {
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

  collapsibleGroups.push({ chips, badge });
  return { group: outer, chips };
}

function updateGroupBadges() {
  collapsibleGroups.forEach(({ chips, badge }) => {
    const count = chips.querySelectorAll('.filter-chip.active, .filter-chip.excluded').length;
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
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (state.lengths.has(val)) {
        state.lengths.delete(val);
        btn.classList.remove('active');
      } else {
        state.lengths.add(val);
        btn.classList.add('active');
      }
      recommend();
    });
    lengthChips.appendChild(btn);
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

  // My Score range slider
  const dataMinScore = 1;
  const dataMaxScore = 10;

  const { group: scoreGroup, chips: scoreChips } = makeGroup('My Score');
  scoreChips.classList.add('year-range-chips');

  const scoreSliderWrapper = document.createElement('div');
  scoreSliderWrapper.className = 'year-slider-wrapper';

  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'year-display';
  const scoreMinLabel = document.createElement('span');
  scoreMinLabel.className = 'year-display-val';
  scoreMinLabel.id = 'score-min-display';
  scoreMinLabel.textContent = dataMinScore;
  const scoreDash = document.createElement('span');
  scoreDash.className = 'year-display-dash';
  scoreDash.textContent = '—';
  const scoreMaxLabel = document.createElement('span');
  scoreMaxLabel.className = 'year-display-val';
  scoreMaxLabel.id = 'score-max-display';
  scoreMaxLabel.textContent = dataMaxScore;
  scoreDisplay.appendChild(scoreMinLabel);
  scoreDisplay.appendChild(scoreDash);
  scoreDisplay.appendChild(scoreMaxLabel);

  const scoreTrackContainer = document.createElement('div');
  scoreTrackContainer.className = 'year-track-container';
  const scoreTrackBg = document.createElement('div');
  scoreTrackBg.className = 'year-track-bg';
  const scoreTrackFill = document.createElement('div');
  scoreTrackFill.className = 'year-track-fill';
  scoreTrackFill.id = 'score-track-fill';
  scoreTrackBg.appendChild(scoreTrackFill);

  const scoreMinInput = document.createElement('input');
  scoreMinInput.type = 'range';
  scoreMinInput.className = 'year-slider';
  scoreMinInput.id = 'score-slider-min';
  scoreMinInput.min = dataMinScore;
  scoreMinInput.max = dataMaxScore;
  scoreMinInput.value = dataMinScore;
  scoreMinInput.style.zIndex = '4';

  const scoreMaxInput = document.createElement('input');
  scoreMaxInput.type = 'range';
  scoreMaxInput.className = 'year-slider';
  scoreMaxInput.id = 'score-slider-max';
  scoreMaxInput.min = dataMinScore;
  scoreMaxInput.max = dataMaxScore;
  scoreMaxInput.value = dataMaxScore;
  scoreMaxInput.style.zIndex = '3';

  const updateScoreFill = () => {
    const range = dataMaxScore - dataMinScore;
    const lo = parseInt(scoreMinInput.value);
    const hi = parseInt(scoreMaxInput.value);
    scoreTrackFill.style.left  = ((lo - dataMinScore) / range * 100) + '%';
    scoreTrackFill.style.right = ((dataMaxScore - hi)  / range * 100) + '%';
    scoreMinLabel.textContent = lo;
    scoreMaxLabel.textContent = hi;
    scoreMinInput.style.zIndex = (hi > dataMinScore && (lo <= dataMinScore || lo >= hi)) ? '4' : '2';
  };

  scoreMinInput.addEventListener('input', () => {
    if (parseInt(scoreMinInput.value) > parseInt(scoreMaxInput.value)) scoreMinInput.value = scoreMaxInput.value;
    state.scoreMin = parseInt(scoreMinInput.value) <= dataMinScore ? null : parseInt(scoreMinInput.value);
    state.scoreMax = parseInt(scoreMaxInput.value) >= dataMaxScore ? null : parseInt(scoreMaxInput.value);
    updateScoreFill();
    recommend();
  });

  scoreMaxInput.addEventListener('input', () => {
    if (parseInt(scoreMaxInput.value) < parseInt(scoreMinInput.value)) scoreMaxInput.value = scoreMinInput.value;
    state.scoreMin = parseInt(scoreMinInput.value) <= dataMinScore ? null : parseInt(scoreMinInput.value);
    state.scoreMax = parseInt(scoreMaxInput.value) >= dataMaxScore ? null : parseInt(scoreMaxInput.value);
    updateScoreFill();
    recommend();
  });

  scoreTrackContainer.appendChild(scoreTrackBg);
  scoreTrackContainer.appendChild(scoreMinInput);
  scoreTrackContainer.appendChild(scoreMaxInput);
  scoreSliderWrapper.appendChild(scoreDisplay);
  scoreSliderWrapper.appendChild(scoreTrackContainer);
  scoreChips.appendChild(scoreSliderWrapper);
  panel.appendChild(scoreGroup);

  // Special Titles (Certified Fresh/Rotten, Medalists — derived from specialAwards)
  // Include-only toggle, same as Length — no exclude state.
  const { group: specialGroup, chips: specialChips } = makeGroup('Special Titles');
  Object.entries(SPECIAL_TITLES_META).forEach(([key, meta]) => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.textContent = meta.label;
    attachHoverTooltip(btn, meta.hover, { suppressClick: true });
    btn.addEventListener('click', () => {
      if (btn._suppressClick) {
        btn._suppressClick = false;
        return;
      }
      hideTooltip();
      if (state.specialTitles.has(key)) {
        state.specialTitles.delete(key);
        btn.classList.remove('active');
      } else {
        state.specialTitles.add(key);
        btn.classList.add('active');
      }
      recommend();
    });
    specialChips.appendChild(btn);
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

  // Demographic
  const { group: demoGroup, chips: demoChips } = makeCollapsibleGroup('Demographic', categoryNav);
  DEMOGRAPHICS.forEach(d => demoChips.appendChild(makeFilterChip(d, 'tag')));
  panel.appendChild(demoGroup);

  // Tag groups
  FILTER_GROUPS.forEach(({ label, items }) => {
    const { group, chips } = makeCollapsibleGroup(label, categoryNav);
    items.forEach(item => chips.appendChild(makeFilterChip(item, 'tag')));
    panel.appendChild(group);
  });

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
  if (qualifiedStudios.length) {
    const { group: studioGroup, chips: studioChips } = makeCollapsibleGroup('Studio', categoryNav);
    qualifiedStudios.forEach(s => studioChips.appendChild(makeFilterChip(s, 'studio')));
    panel.appendChild(studioGroup);
  }

  // Mature Content group
  const { group: nsfwGroup, chips: nsfwChips } = makeCollapsibleGroup(NSFW_GROUP.label, categoryNav, 'nsfw-group');
  qualifiedMatureTags.forEach(item => nsfwChips.appendChild(makeFilterChip(item, 'tag')));
  panel.appendChild(nsfwGroup);
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

function clearAllFilters() {
  state.genres.clear();
  state.tags.clear();
  state.studios.clear();
  state.specialTitles.clear();
  state.excludedGenres.clear();
  state.excludedTags.clear();
  state.excludedStudios.clear();
  state.lengths.clear();
  state.yearMin = null;
  state.yearMax = null;
  state.scoreMin = null;
  state.scoreMax = null;
  document.querySelectorAll('.filter-chip.active, .filter-chip.excluded')
    .forEach(btn => btn.classList.remove('active', 'excluded'));
  const minSlider = document.getElementById('year-slider-min');
  const maxSlider = document.getElementById('year-slider-max');
  if (minSlider && maxSlider) {
    minSlider.value = minSlider.min;
    maxSlider.value = maxSlider.max;
    const fill = document.getElementById('year-track-fill');
    if (fill) { fill.style.left = '0%'; fill.style.right = '0%'; }
    const minDisp = document.getElementById('year-min-display');
    const maxDisp = document.getElementById('year-max-display');
    if (minDisp) minDisp.textContent = minSlider.min;
    if (maxDisp) maxDisp.textContent = maxSlider.max;
  }
  const scoreMinSlider = document.getElementById('score-slider-min');
  const scoreMaxSlider = document.getElementById('score-slider-max');
  if (scoreMinSlider && scoreMaxSlider) {
    scoreMinSlider.value = scoreMinSlider.min;
    scoreMaxSlider.value = scoreMaxSlider.max;
    const scoreFill = document.getElementById('score-track-fill');
    if (scoreFill) { scoreFill.style.left = '0%'; scoreFill.style.right = '0%'; }
    const scoreMinDisp = document.getElementById('score-min-display');
    const scoreMaxDisp = document.getElementById('score-max-display');
    if (scoreMinDisp) scoreMinDisp.textContent = scoreMinSlider.min;
    if (scoreMaxDisp) scoreMaxDisp.textContent = scoreMaxSlider.max;
  }
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
            <div class="modal-genres"></div>
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

  document.getElementById('toggle-18plus').addEventListener('change', e => toggle18plus(e.target.checked));
  document.getElementById('toggle-and-mode').addEventListener('change', e => { andMode = e.target.checked; recommend(); });
  document.getElementById('clear-filters').addEventListener('click', clearAllFilters);

  renderDefault();
}

init();
