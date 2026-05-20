const DESCRIPTOR_MAP = {
  // Mood
  dark:           ['dark', 'psychological', 'tragedy', 'horror', 'violence', 'seinen', 'nihilism'],
  funny:          ['comedy', 'parody', 'slapstick humor', 'satire', 'gag humor', 'dark comedy'],
  cute:           ['moe', 'iyashikei', 'healing', 'cute girls doing cute things'],
  wholesome:      ['slice of life', 'iyashikei', 'healing', 'feel-good'],
  cozy:           ['slice of life', 'iyashikei', 'daily life', 'healing'],
  sad:            ['tragedy', 'drama', 'tearjerker', 'grief', 'loss'],
  emotional:      ['tragedy', 'drama', 'tearjerker', 'coming of age', 'grief'],
  depressing:     ['tragedy', 'drama', 'psychological', 'nihilism'],
  heartwarming:   ['slice of life', 'iyashikei', 'healing', 'feel-good', 'romance'],
  intense:        ['thriller', 'psychological', 'action', 'military', 'suspense'],
  scary:          ['horror', 'supernatural horror', 'gore', 'psychological', 'survival horror'],
  creepy:         ['horror', 'psychological', 'supernatural horror', 'mystery', 'suspense'],
  spooky:         ['horror', 'supernatural', 'ghosts', 'supernatural horror'],
  gory:           ['gore', 'violence', 'horror', 'action'],
  violent:        ['violence', 'gore', 'action', 'military', 'martial arts'],
  mindblowing:    ['psychological', 'mystery', 'sci-fi', 'mind games', 'plot twist'],
  epic:           ['action', 'adventure', 'fantasy', 'military', 'war'],
  chill:          ['slice of life', 'iyashikei', 'healing', 'daily life'],
  mature:         ['seinen', 'violence', 'gore', 'mature themes', 'adult cast'],
  lighthearted:   ['slice of life', 'comedy', 'iyashikei', 'healing', 'feel-good'],
  bittersweet:    ['drama', 'romance', 'tragedy', 'grief'],
  mindfuck:       ['psychological', 'mind games', 'unreliable narrator', 'thriller'],

  // Cast / setting descriptors
  adult:          ['adult cast', 'workplace', 'mature themes'],
  adults:         ['adult cast', 'workplace'],
  older:          ['adult cast'],
  grown:          ['adult cast'],
  grownup:        ['adult cast'],
  work:           ['workplace', 'adult cast', 'salaryman', 'seinen'],
  working:        ['workplace', 'adult cast', 'seinen'],
  office:         ['workplace', 'adult cast', 'salaryman'],
  job:            ['workplace', 'adult cast', 'salaryman'],
  career:         ['workplace', 'adult cast', 'salaryman'],
  realistic:      ['seinen', 'josei', 'slice of life', 'adult cast', 'real world setting'],
  grounded:       ['seinen', 'josei', 'slice of life', 'drama'],
  serious:        ['seinen', 'drama', 'psychological', 'military'],

  // Tropes / themes
  revenge:        ['revenge', 'betrayal'],
  betrayal:       ['betrayal', 'revenge'],
  redemption:     ['drama', 'action', 'seinen', 'character development'],
  overpowered:    ['overpowered main characters', 'isekai', 'action', 'super power'],
  reincarnation:  ['reincarnation', 'isekai', 'parallel world'],
  friendship:     ['friendship'],
  family:         ['family', 'found family'],
  underdog:       ['sports', 'drama', 'competition', 'coming of age'],
  war:            ['war', 'military', 'historical', 'action'],
  death:          ['tragedy', 'drama', 'horror', 'grief'],
  grief:          ['grief', 'tragedy', 'drama'],
  loss:           ['grief', 'tragedy', 'drama', 'loss'],
  philosophy:     ['philosophical', 'seinen', 'psychological'],
  tournament:     ['competition', 'sports', 'action', 'martial arts'],
  detective:      ['detective', 'mystery', 'thriller', 'crime'],
  crime:          ['crime', 'mystery', 'thriller', 'detective'],
  pirates:        ['pirates', 'adventure', 'action'],
  ninja:          ['ninja', 'historical', 'action', 'martial arts'],
  ninjas:         ['ninja', 'historical', 'action', 'martial arts'],
  robot:          ['mecha', 'sci-fi', 'android', 'artificial intelligence'],
  robots:         ['mecha', 'sci-fi', 'android', 'artificial intelligence'],
  aliens:         ['alien', 'sci-fi', 'space'],
  dystopia:       ['dystopian', 'sci-fi', 'post-apocalyptic', 'survival'],
  dystopian:      ['dystopian', 'sci-fi', 'post-apocalyptic', 'survival'],
  idol:           ['idol', 'music', 'performing arts'],
  band:           ['band', 'music', 'performing arts'],
  gods:           ['gods', 'supernatural', 'mythology', 'mythological'],
  god:            ['gods', 'supernatural', 'mythology'],
  witches:        ['magic', 'fantasy', 'witch'],
  unrequited:     ['unrequited love'],
  tsundere:       ['tsundere'],
  yandere:        ['yandere', 'psychological'],

  // Genres / themes
  romance:           ['romance', 'love triangle', 'childhood romance', 'unrequited love'],
  fantasy:           ['fantasy', 'magic', 'sword and sorcery', 'mythological', 'isekai'],
  isekai:            ['isekai', 'reincarnation', 'parallel world', 'transported to another world'],
  scifi:             ['sci-fi', 'space', 'mecha', 'cyberpunk', 'dystopian', 'futuristic'],
  action:            ['action', 'martial arts', 'super power', 'military', 'fighting'],
  mystery:           ['mystery', 'thriller', 'detective', 'suspense', 'whodunnit', 'crime'],
  school:            ['school', 'high school', 'coming of age', 'student council', 'clubs'],
  historical:        ['historical', 'samurai', 'war', 'feudal japan', 'period piece'],
  sports:            ['sports', 'baseball', 'basketball', 'swimming', 'cycling', 'volleyball', 'soccer', 'tennis'],
  music:             ['music', 'band', 'idol', 'singing', 'musical'],
  supernatural:      ['supernatural', 'demons', 'ghosts', 'exorcism', 'spirits', 'gods'],
  mecha:             ['mecha', 'super robot', 'space', 'sci-fi'],
  adventure:         ['adventure', 'exploration', 'journey', 'quest', 'travel'],
  psychological:     ['psychological', 'mind games', 'unreliable narrator', 'dark', 'thriller'],
  thriller:          ['thriller', 'suspense', 'mystery', 'psychological', 'crime'],
  horror:            ['horror', 'gore', 'supernatural horror', 'psychological', 'survival horror'],
  comedy:            ['comedy', 'parody', 'slapstick humor', 'gag humor', 'dark comedy'],
  drama:             ['drama', 'tragedy', 'coming of age', 'grief', 'family'],
  political:         ['politics', 'military', 'war', 'dystopian', 'power struggle'],
  magic:             ['magic', 'fantasy', 'witches', 'wizards', 'sorcery'],
  demons:            ['demons', 'supernatural', 'exorcism', 'devil'],
  samurai:           ['samurai', 'historical', 'katana', 'feudal japan'],
  cyberpunk:         ['cyberpunk', 'sci-fi', 'dystopian', 'futuristic', 'hacking'],
  space:             ['space', 'sci-fi', 'mecha', 'alien', 'galaxy'],
  harem:             ['harem', 'reverse harem', 'romance'],
  cooking:           ['food', 'cooking', 'culinary'],
  survival:          ['survival', 'post-apocalyptic', 'dystopian', 'battle royale'],
  military:          ['military', 'war', 'historical', 'political', 'action'],
  competition:       ['competition', 'sports', 'strategy game', 'card game'],
  mythology:         ['mythology', 'gods', 'historical', 'fantasy', 'mythological'],
  vampire:           ['vampire', 'supernatural', 'horror'],
  zombie:            ['zombie', 'post-apocalyptic', 'horror', 'survival'],
  'time travel':     ['time travel', 'sci-fi', 'time manipulation'],
  'slice of life':   ['slice of life', 'daily life', 'iyashikei', 'healing'],
  'coming of age':   ['coming of age', 'school', 'drama', 'youth'],
  'post-apocalyptic':['post-apocalyptic', 'dystopian', 'survival'],
};

// Exact multi-word phrases → Anilist tag/genre targets (checked before tokenizing)
const PHRASES = {
  'adult cast':        ['adult cast'],
  'high school':       ['school', 'high school'],
  'middle school':     ['school', 'middle school'],
  'slice of life':     ['slice of life', 'iyashikei', 'daily life'],
  'coming of age':     ['coming of age', 'youth'],
  'time travel':       ['time travel', 'time manipulation'],
  'martial arts':      ['martial arts', 'fighting'],
  'magical girl':      ['magical girl', 'mahou shoujo'],
  'love triangle':     ['love triangle'],
  'found family':      ['found family', 'drama'],
  'power fantasy':     ['isekai', 'super power', 'reincarnation', 'overpowered main characters'],
  'sci fi':            ['sci-fi', 'futuristic'],
  'science fiction':   ['sci-fi', 'space', 'futuristic'],
  'dark fantasy':      ['dark', 'fantasy', 'violence'],
  'feel good':         ['iyashikei', 'healing', 'slice of life'],
  'feel-good':         ['iyashikei', 'healing', 'slice of life'],
  'post apocalyptic':  ['post-apocalyptic', 'dystopian', 'survival'],
  'childhood friends': ['childhood friends', 'romance', 'school'],
  'unrequited love':   ['unrequited love', 'romance', 'drama'],
  'reverse harem':     ['reverse harem', 'romance'],
  'super power':       ['super power', 'action'],
  'mind games':        ['mind games', 'psychological', 'thriller'],
};

// When one of these words appears in the raw query, the anime MUST match
// the listed genre or at least one of the listed tags — otherwise filtered out
const GENRE_REQUIREMENTS = [
  { word: 'romance',       genre: 'romance',       tags: ['romance', 'love triangle', 'childhood romance', 'unrequited love', 'romantic'] },
  { word: 'horror',        genre: 'horror',        tags: ['horror', 'supernatural horror', 'survival horror', 'gore'] },
  { word: 'action',        genre: 'action',        tags: ['action', 'martial arts', 'fighting', 'super power'] },
  { word: 'comedy',        genre: 'comedy',        tags: ['comedy', 'parody', 'slapstick humor', 'gag humor', 'dark comedy'] },
  { word: 'sports',        genre: 'sports',        tags: ['sports'] },
  { word: 'music',         genre: 'music',         tags: ['music', 'band', 'idol', 'singing'] },
  { word: 'mystery',       genre: 'mystery',       tags: ['mystery', 'detective', 'thriller', 'whodunnit'] },
  { word: 'fantasy',       genre: 'fantasy',       tags: ['fantasy', 'magic', 'isekai', 'mythological', 'sword and sorcery'] },
  { word: 'historical',    genre: 'historical',    tags: ['historical', 'samurai', 'feudal japan', 'period piece'] },
  { word: 'supernatural',  genre: 'supernatural',  tags: ['supernatural', 'demons', 'ghosts', 'spirits', 'exorcism'] },
  { word: 'mecha',         genre: 'mecha',         tags: ['mecha', 'super robot'] },
  { word: 'psychological', genre: 'psychological', tags: ['psychological', 'mind games', 'unreliable narrator'] },
  { word: 'adventure',     genre: 'adventure',     tags: ['adventure', 'exploration', 'journey'] },
  { word: 'thriller',      genre: 'thriller',      tags: ['thriller', 'suspense', 'psychological'] },
  { word: 'drama',         genre: 'drama',         tags: ['drama', 'tragedy', 'tearjerker'] },
  { word: 'slice of life', genre: 'slice of life', tags: ['slice of life', 'iyashikei', 'daily life'] },
  { word: 'sci-fi',        genre: 'sci-fi',        tags: ['sci-fi', 'space', 'cyberpunk', 'futuristic', 'mecha'] },
  { word: 'scifi',         genre: 'sci-fi',        tags: ['sci-fi', 'space', 'cyberpunk', 'futuristic', 'mecha'] },
  { word: 'cooking',       genre: 'slice of life', tags: ['food', 'cooking', 'culinary'] },
];

// When a term is in the search, penalize anime that have these conflicting tags
const CONFLICT_MAP = {
  'adult cast': ['primarily teen cast', 'school', 'middle school', 'high school', 'elementary school'],
  'child':      ['adult cast', 'violence', 'gore'],
  'kids':       ['adult cast', 'violence', 'gore'],
};

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'is', 'it', 'me', 'something', 'some', 'want', 'looking', 'find',
  'give', 'like', 'really', 'very', 'quite', 'bit', 'kind', 'sort', 'show',
  'anime', 'watch', 'watching', 'recommend', 'good', 'great', 'best', 'top',
  'please', 'any', 'have', 'about', 'more', 'nice', 'cool', 'awesome',
  'i', 'my', 'we', 'us', 'you', 'that', 'this', 'cast',
]);

let animeData = [];
let animeMap = new Map();

async function loadData() {
  const res = await fetch('data/anime.json');
  if (!res.ok) throw new Error('Could not load anime.json — run fetch_anime.py first.');
  animeData = await res.json();
  animeMap = new Map(animeData.map(a => [a.id, a]));
}

function normalize(str) {
  return str.toLowerCase().trim();
}

// Whole-word match only: "ice" must not match "slice of life", "man" must not match "romance"
function matchesTerm(term, candidate) {
  if (term === candidate) return true;
  const cWords = candidate.split(/\s+/);
  if (cWords.includes(term)) return true;
  const tWords = term.split(/\s+/);
  if (tWords.includes(candidate)) return true;
  return false;
}

function tokenize(input) {
  return input.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function getSearchTerms(input) {
  const lower = input.toLowerCase();
  const terms = new Set();

  // Check exact multi-word phrases first (before tokenizing splits them up)
  Object.entries(PHRASES).forEach(([phrase, expansions]) => {
    if (lower.includes(phrase)) {
      expansions.forEach(t => terms.add(normalize(t)));
    }
  });

  // Then expand individual tokens via the descriptor map
  tokenize(input).forEach(token => {
    terms.add(token);
    const mapped = DESCRIPTOR_MAP[token] || DESCRIPTOR_MAP[token.replace(/-/g, '')];
    if (mapped) mapped.forEach(t => terms.add(normalize(t)));
  });

  // Multi-word DESCRIPTOR_MAP entries
  Object.entries(DESCRIPTOR_MAP).forEach(([phrase, expansions]) => {
    if (phrase.includes(' ') && lower.includes(phrase)) {
      expansions.forEach(t => terms.add(normalize(t)));
    }
  });

  return Array.from(terms);
}

function scoreAnime(anime, terms) {
  let score = 0;
  const matchedGenres = new Set();
  const matchedTags = new Map(); // tag name → score; each tag counted once

  const genres = anime.genres.map(normalize);
  const tags = anime.tags.map(t => ({ name: normalize(t.name), rank: t.rank }));
  const descWords = new Set((anime.description || '').toLowerCase().split(/[^a-z0-9]+/));

  for (const term of terms) {
    for (const genre of genres) {
      if (!matchedGenres.has(genre) && matchesTerm(term, genre)) {
        score += 10;
        matchedGenres.add(genre);
      }
    }
    for (const tag of tags) {
      if (!matchedTags.has(tag.name) && matchesTerm(term, tag.name)) {
        matchedTags.set(tag.name, 5 * (tag.rank / 100));
      }
    }
    if (descWords.has(term)) {
      score += 1;
    }
  }

  for (const tagScore of matchedTags.values()) score += tagScore;

  // Penalize anime whose tags directly conflict with what was searched for
  let penalty = 1.0;
  for (const term of terms) {
    const conflicts = CONFLICT_MAP[term];
    if (!conflicts) continue;
    for (const tag of tags) {
      for (const conflict of conflicts) {
        if (tag.name.includes(conflict) || conflict.includes(tag.name)) {
          penalty = Math.min(penalty, 0.1);
        }
      }
    }
  }

  const userScore = anime.score || 0;
  const weight = userScore > 0 ? userScore / 10 : 0.5;

  return {
    weightedScore: score * weight * penalty,
    rawScore: score,
    matched: [...matchedGenres, ...matchedTags.keys()].slice(0, 5),
  };
}

function meetsGenreRequirements(anime, required) {
  const genres = anime.genres.map(g => g.toLowerCase());
  const tags = anime.tags.map(t => t.name.toLowerCase());
  return required.every(req => {
    if (genres.includes(req.genre)) return true;
    return req.tags.some(tag => genres.some(g => matchesTerm(tag, g)) || tags.some(t => matchesTerm(tag, t)));
  });
}

function search(query) {
  if (!query.trim()) return null;
  const terms = getSearchTerms(query);
  if (!terms.length) return [];

  // Find which genre words were explicitly typed so we can require them
  const queryLower = query.toLowerCase();
  const required = GENRE_REQUIREMENTS.filter(r => queryLower.includes(r.word));

  // Score and rank by relevance first
  let scored = animeData
    .map(anime => {
      const { weightedScore, rawScore, matched } = scoreAnime(anime, terms);
      return { ...anime, weightedScore, rawScore, matched };
    })
    .filter(a => a.rawScore >= 2)
    .filter(a => required.length === 0 || meetsGenreRequirements(a, required))
    .sort((a, b) => b.weightedScore - a.weightedScore);

  let result;
  if (scored.length <= 10) {
    result = scored;
  } else {
    // Prefer non-sequels; fill with sequels only if not enough non-sequels
    const nonSequels = scored.filter(a => !a.isSequel);
    if (nonSequels.length >= 10) {
      result = nonSequels.slice(0, 10);
    } else {
      const seqs = scored.filter(a => a.isSequel);
      result = [...nonSequels, ...seqs.slice(0, 10 - nonSequels.length)];
    }
  }

  // Sort by score descending, then alphabetically
  return result.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.title || a.titleRomaji || '').localeCompare(b.title || b.titleRomaji || '');
  });
}

function renderCard(anime, showMatched) {
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
        ${showMatched && matched.length ? `<div class="card-matched">↳ ${matched.join(', ')}</div>` : ''}
      </div>
    </div>
  `;
}

function openModal(id) {
  const anime = animeMap.get(id);
  if (!anime) return;

  const overlay = document.getElementById('modal-overlay');
  const title = anime.title || anime.titleRomaji;
  const topTags = [...anime.tags].sort((a, b) => b.rank - a.rank).slice(0, 5);

  overlay.querySelector('.modal-cover img').src = anime.cover;
  overlay.querySelector('.modal-cover img').alt = title;
  overlay.querySelector('.modal-score').textContent = anime.score > 0 ? `★ ${anime.score}` : '—';
  overlay.querySelector('.modal-title').textContent = title;
  overlay.querySelector('.modal-genres').innerHTML =
    (anime.genres || []).map(g => `<span class="genre-pill">${g}</span>`).join('');
  overlay.querySelector('.modal-description').textContent =
    anime.description || 'No description available.';
  overlay.querySelector('.modal-themes-list').innerHTML = topTags.map(tag => `
    <div class="modal-theme-row">
      <span class="modal-theme-name">${tag.name}</span>
      <div class="modal-theme-bar"><div class="modal-theme-fill" style="width:${tag.rank}%"></div></div>
      <span class="modal-theme-pct">${tag.rank}%</span>
    </div>
  `).join('');

  const notesSection = overlay.querySelector('.modal-notes-section');
  if (anime.notes) {
    overlay.querySelector('.modal-notes-text').textContent = anime.notes;
    notesSection.classList.remove('hidden');
  } else {
    notesSection.classList.add('hidden');
  }

  overlay.querySelector('.modal-anilist-link').href = anime.url;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderResults(results, query) {
  const grid = document.getElementById('results');
  const status = document.getElementById('status-bar');

  if (!results.length) {
    status.textContent = '';
    status.classList.add('hidden');
    grid.innerHTML = `
      <div class="empty-state">
        <div class="emoji">¯\\_(ツ)_/¯</div>
        <p>Nothing matched "<strong>${query}</strong>". Try genre names like "horror", "romance", or moods like "dark" or "wholesome".</p>
      </div>`;
    return;
  }

  status.textContent = `${results.length} match${results.length === 1 ? '' : 'es'} from my completed list`;
  status.classList.remove('hidden');
  grid.innerHTML = results.map(a => renderCard(a, true)).join('');
}

function renderDefault() {
  const grid = document.getElementById('results');
  const status = document.getElementById('status-bar');
  const top = animeData
    .filter(a => a.score >= 9)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.title || a.titleRomaji || '').localeCompare(b.title || b.titleRomaji || '');
    })
    .slice(0, 24);

  if (!top.length) {
    grid.innerHTML = '';
    status.classList.add('hidden');
    return;
  }

  status.textContent = 'My highest-rated picks — or search above to find something specific';
  status.classList.remove('hidden');
  grid.innerHTML = top.map(a => renderCard(a, false)).join('');
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

async function init() {
  const grid = document.getElementById('results');
  grid.innerHTML = '<div class="loading">Loading…</div>';

  // Inject modal into DOM
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
            <div class="modal-themes-section">
              <div class="modal-section-label">Top Themes</div>
              <div class="modal-themes-list"></div>
            </div>
            <div class="modal-notes-section hidden">
              <div class="modal-section-label">My Notes</div>
              <p class="modal-notes-text"></p>
            </div>
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

  // Card click delegation — survives innerHTML replacements on the grid
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

  renderDefault();

  const input = document.getElementById('search');

  const handleSearch = debounce(query => {
    if (!query.trim()) { renderDefault(); return; }
    renderResults(search(query), query);
  }, 280);

  input.addEventListener('input', e => handleSearch(e.target.value));

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.query;
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  });
}

init();
