// ── Filter definitions ─────────────────────────────────────────────────────

const DEMOGRAPHICS = ['Josei', 'Kids', 'Seinen', 'Shoujo', 'Shounen'];

const ALL_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
];

// Only tags appearing in ≥10 anime in the list
const FILTER_GROUPS = [
  {
    label: 'Setting',
    items: ['College', 'Historical', 'Isekai', 'Medieval', 'Urban Fantasy'],
  },
  {
    label: 'Themes',
    items: [
      'Class Struggle', 'Coming of Age', 'Crime', 'Food', 'Found Family',
      'Mythology', 'Philosophy', 'Politics', 'Revenge', 'Travel', 'War',
    ],
  },
  {
    label: 'Tone',
    items: ['Episodic', 'Iyashikei', 'Parody', 'Satire', 'Slapstick', 'Surreal Comedy'],
  },
  {
    label: 'Characters',
    items: [
      'Anti-Hero', 'Ensemble Cast', 'Kuudere', 'Ojou-sama',
      'Primarily Adult Cast', 'Tsundere',
    ],
  },
  // Conditional: only shown when Romance genre is selected
  {
    label: 'Romance & Relationships',
    items: [
      'Arranged Marriage', 'Cohabitation', 'Fake Relationship', 'Female Harem',
      'LGBTQ+ Themes', 'Love Triangle', 'Marriage', 'Unrequited Love', 'Yuri',
    ],
    showWhenGenres: ['Romance'],
  },
  // Conditional: only shown when Fantasy or Supernatural genre is selected
  {
    label: 'Supernatural & Fantasy',
    items: ['Demons', 'Dragons', 'Elf', 'Gods', 'Magic', 'Shapeshifting', 'Vampire', 'Witch', 'Youkai'],
    showWhenGenres: ['Fantasy', 'Supernatural'],
  },
];

const NSFW_GROUP = {
  label: '18+ Content',
  items: [
    'Bondage', 'Drugs', 'Gore', 'Large Breasts', 'Masochism',
    'Nudity', 'Psychosexual', 'Rape', 'Sadism', 'Suicide', 'Torture',
  ],
};

// AniList IDs that are sequels by metadata but should be treated as standalones
const SEQUEL_OVERRIDES = new Set([3972]); // Yu-Gi-Oh! 5D's

// ── State ──────────────────────────────────────────────────────────────────

const state = {
  genres: new Set(),
  tags: new Set(),
  studios: new Set(),
  excludedGenres: new Set(),
  excludedTags: new Set(),
  excludedStudios: new Set(),
  episodes: new Set(),
  yearMin: null,
  yearMax: null,
};

let andMode = false;

// Refs to conditional groups
const conditionalGroupEls = new Map();

// ── Data ───────────────────────────────────────────────────────────────────

let animeData = [];
let animeMap = new Map();

async function loadData() {
  const res = await fetch('data/anime.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Could not load anime.json — run fetch_anime.py first.');
  animeData = await res.json();
  animeMap = new Map(animeData.map(a => [a.id, a]));
}

// ── Engine ─────────────────────────────────────────────────────────────────

function matchesEpisodeFilter(anime) {
  if (state.episodes.size === 0) return true;
  const eps = anime.episodes;
  if (!eps) return true;
  if (state.episodes.has('short') && eps <= 13) return true;
  if (state.episodes.has('medium') && eps >= 14 && eps <= 26) return true;
  if (state.episodes.has('long') && eps > 26) return true;
  return false;
}

function matchesYearFilter(anime) {
  if (state.yearMin === null && state.yearMax === null) return true;
  const y = anime.year;
  if (!y) return true;
  if (state.yearMin !== null && y < state.yearMin) return false;
  if (state.yearMax !== null && y > state.yearMax) return false;
  return true;
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
    if (rank !== undefined && rank >= 80) {
      score += (rank / 100) * 5;
      matched.push(tag);
    }
  }

  const animeStudios = new Set((anime.studios || []).map(s => s.toLowerCase()));
  for (const studio of state.studios) {
    if (animeStudios.has(studio.toLowerCase())) {
      score += 10;
      matched.push(studio);
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
    if (rank === undefined || rank < 80) return false;
  }
  for (const s of state.studios) {
    if (!animeStudios.has(s.toLowerCase())) return false;
  }
  return true;
}

function recommend() {
  updateFilterCount();
  const hasFilters =
    state.genres.size > 0 || state.tags.size > 0 || state.studios.size > 0 ||
    state.excludedGenres.size > 0 || state.excludedTags.size > 0 || state.excludedStudios.size > 0 ||
    state.episodes.size > 0 || state.yearMin !== null || state.yearMax !== null;

  if (!hasFilters) {
    renderDefault();
    return;
  }

  const noScoringFilters = state.genres.size === 0 && state.tags.size === 0 && state.studios.size === 0;

  const results = animeData
    .filter(a => !a.isSequel || SEQUEL_OVERRIDES.has(a.id))
    .filter(matchesEpisodeFilter)
    .filter(matchesYearFilter)
    .filter(a => !isExcluded(a))
    .map(a => {
      const { score, matched } = scoreAnime(a);
      return { ...a, _score: score, matched };
    })
    .filter(a => noScoringFilters || (andMode ? matchesAllFilters(a) : a._score > 0))
    .sort((a, b) => {
      if (Math.abs(b._score - a._score) > 0.5) return b._score - a._score;
      return (b.score || 0) - (a.score || 0);
    });

  renderResults(results);
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderCard(anime) {
  const title = anime.title || anime.titleRomaji;
  const score = anime.score > 0 ? `★ ${anime.score}` : '—';
  const genres = (anime.genres || []).slice(0, 3);
  const matched = anime.matched || [];

  return `
    <div class="card" data-id="${anime.id}" title="${title}">
      <div class="card-cover">
        <img src="${anime.cover}" alt="" loading="lazy">
        <div class="card-score">${score}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${title}</h3>
        <div class="card-genres">
          ${genres.map(g => `<span class="genre-pill">${g}</span>`).join('')}
        </div>
        ${matched.length ? `<div class="card-matched">↳ ${matched.join(', ')}</div>` : ''}
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
  overlay.querySelector('.modal-title').textContent = title;
  overlay.querySelector('.modal-genres').innerHTML =
    (anime.genres || []).map(g => `<span class="genre-pill">${g}</span>`).join('');
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

  overlay.querySelector('.modal-anilist-link').href = anime.url;
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
    .filter(a => (!a.isSequel || SEQUEL_OVERRIDES.has(a.id)) && a.score === 10)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
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
    state.genres.size + state.tags.size + state.studios.size +
    state.excludedGenres.size + state.excludedTags.size + state.excludedStudios.size +
    state.episodes.size +
    (state.yearMin !== null || state.yearMax !== null ? 1 : 0);
  const el = document.getElementById('filter-count');
  if (el) el.textContent = count > 0 ? `${count} filter${count === 1 ? '' : 's'} active` : '';
}

// ── Conditional group visibility ───────────────────────────────────────────

function updateConditionalGroups() {
  for (const [, { el, showWhenGenres }] of conditionalGroupEls) {
    const shouldShow = showWhenGenres.some(g => state.genres.has(g));
    const wasVisible = !el.classList.contains('group-hidden');
    if (!shouldShow && wasVisible) {
      el.querySelectorAll('.filter-chip.active, .filter-chip.excluded').forEach(btn => {
        const val = btn.dataset.value;
        if (btn.classList.contains('active')) state.tags.delete(val);
        else state.excludedTags.delete(val);
        btn.classList.remove('active', 'excluded');
      });
    }
    el.classList.toggle('group-hidden', !shouldShow);
  }
}

// ── Filter UI ──────────────────────────────────────────────────────────────

function makeFilterChip(label, type, extraClass) {
  const btn = document.createElement('button');
  btn.className = 'filter-chip' + (extraClass ? ` ${extraClass}` : '');
  btn.textContent = label;
  btn.dataset.type = type;
  btn.dataset.value = label;

  btn.addEventListener('click', () => {
    const includeSet = type === 'genre' ? state.genres : type === 'studio' ? state.studios : state.tags;
    const excludeSet = type === 'genre' ? state.excludedGenres : type === 'studio' ? state.excludedStudios : state.excludedTags;

    if (!includeSet.has(label) && !excludeSet.has(label)) {
      // Unselected → Include
      includeSet.add(label);
      btn.classList.add('active');
    } else if (includeSet.has(label)) {
      // Include → Exclude
      includeSet.delete(label);
      excludeSet.add(label);
      btn.classList.remove('active');
      btn.classList.add('excluded');
    } else {
      // Exclude → Unselected
      excludeSet.delete(label);
      btn.classList.remove('excluded');
      btn.blur();
    }

    if (type === 'genre') updateConditionalGroups();
    recommend();
  });

  return btn;
}

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

function buildFilterUI() {
  const panel = document.getElementById('filter-panel');

  // Episode length
  const { group: epsGroup, chips: epsChips } = makeGroup('Episode Count');
  [['short', 'Short (1–13)'], ['medium', 'Medium (14–26)'], ['long', 'Long (27+)']].forEach(([val, label]) => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (state.episodes.has(val)) {
        state.episodes.delete(val);
        btn.classList.remove('active');
      } else {
        state.episodes.add(val);
        btn.classList.add('active');
      }
      recommend();
    });
    epsChips.appendChild(btn);
  });
  panel.appendChild(epsGroup);

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

  // Studio (dynamic — only studios with ≥5 anime)
  const studioCounts = new Map();
  animeData
    .filter(a => !a.isSequel || SEQUEL_OVERRIDES.has(a.id))
    .forEach(a => (a.studios || []).forEach(s => studioCounts.set(s, (studioCounts.get(s) || 0) + 1)));
  const qualifiedStudios = [...studioCounts.entries()]
    .filter(([, n]) => n >= 5)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name]) => name);
  if (qualifiedStudios.length) {
    const { group: studioGroup, chips: studioChips } = makeGroup('Studio');
    qualifiedStudios.forEach(s => studioChips.appendChild(makeFilterChip(s, 'studio')));
    panel.appendChild(studioGroup);
  }

  // Demographic
  const { group: demoGroup, chips: demoChips } = makeGroup('Demographic');
  DEMOGRAPHICS.forEach(d => demoChips.appendChild(makeFilterChip(d, 'tag')));
  panel.appendChild(demoGroup);

  // Genres
  const { group: genreGroup, chips: genreChips } = makeGroup('Genres');
  ALL_GENRES.forEach(g => genreChips.appendChild(makeFilterChip(g, 'genre')));
  genreChips.appendChild(makeFilterChip('Ecchi', 'genre', 'nsfw-chip'));
  panel.appendChild(genreGroup);

  // Tag groups (including conditional ones)
  FILTER_GROUPS.forEach(({ label, items, showWhenGenres }) => {
    const isConditional = !!showWhenGenres;
    const { group, chips } = makeGroup(label, isConditional ? 'group-hidden' : '');
    items.forEach(item => chips.appendChild(makeFilterChip(item, 'tag')));
    if (isConditional) conditionalGroupEls.set(label, { el: group, showWhenGenres });
    panel.appendChild(group);
  });

  // NSFW group
  const { group: nsfwGroup, chips: nsfwChips } = makeGroup(NSFW_GROUP.label, 'nsfw-group');
  NSFW_GROUP.items.forEach(item => nsfwChips.appendChild(makeFilterChip(item, 'tag')));
  panel.appendChild(nsfwGroup);
}

function toggle18plus(enabled) {
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
    recommend();
  }
}

function clearAllFilters() {
  state.genres.clear();
  state.tags.clear();
  state.studios.clear();
  state.excludedGenres.clear();
  state.excludedTags.clear();
  state.excludedStudios.clear();
  state.episodes.clear();
  state.yearMin = null;
  state.yearMax = null;
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
  updateConditionalGroups();
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
            <h2 class="modal-title"></h2>
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
  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (card && card.dataset.id) openModal(parseInt(card.dataset.id));
  });

  try {
    await loadData();
  } catch (err) {
    grid.innerHTML = `<div class="error-state"><p>⚠ ${err.message}</p></div>`;
    return;
  }

  buildFilterUI();

  document.getElementById('toggle-18plus').addEventListener('change', e => toggle18plus(e.target.checked));
  document.getElementById('toggle-and-mode').addEventListener('change', e => { andMode = e.target.checked; recommend(); });
  document.getElementById('clear-filters').addEventListener('click', clearAllFilters);

  renderDefault();
}

init();
