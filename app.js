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
  mature:         ['seinen', 'violence', 'gore', 'mature themes'],

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
  cooking:           ['food', 'cooking', 'slice of life', 'culinary'],
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

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'is', 'it', 'me', 'something', 'some', 'want', 'looking', 'find',
  'give', 'like', 'really', 'very', 'quite', 'bit', 'kind', 'sort', 'show',
  'anime', 'watch', 'watching', 'recommend', 'good', 'great', 'best', 'top',
  'please', 'any', 'have', 'about', 'more', 'nice', 'cool', 'awesome',
  'i', 'my', 'we', 'us', 'you', 'that', 'this',
]);

let animeData = [];

async function loadData() {
  const res = await fetch('data/anime.json');
  if (!res.ok) throw new Error('Could not load anime.json — run fetch_anime.py first.');
  animeData = await res.json();
}

function normalize(str) {
  return str.toLowerCase().trim();
}

function tokenize(input) {
  return input.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function getSearchTerms(input) {
  const tokens = tokenize(input);
  const terms = new Set(tokens);
  const lower = input.toLowerCase();

  tokens.forEach(token => {
    const key = token.replace(/-/g, '');
    const mapped = DESCRIPTOR_MAP[token] || DESCRIPTOR_MAP[key];
    if (mapped) mapped.forEach(t => terms.add(normalize(t)));
  });

  // Multi-word phrase detection
  Object.entries(DESCRIPTOR_MAP).forEach(([phrase, expansions]) => {
    if (phrase.includes(' ') && lower.includes(phrase)) {
      expansions.forEach(t => terms.add(normalize(t)));
    }
  });

  return Array.from(terms);
}

function scoreAnime(anime, terms) {
  let score = 0;
  const matched = new Set();

  const genres = anime.genres.map(normalize);
  const tags = anime.tags.map(t => ({ name: normalize(t.name), rank: t.rank }));
  const description = normalize(anime.description || '');

  for (const term of terms) {
    for (const genre of genres) {
      if (genre.includes(term) || term.includes(genre)) {
        score += 10;
        matched.add(genre);
      }
    }
    for (const tag of tags) {
      if (tag.name.includes(term) || term.includes(tag.name)) {
        score += 5 * (tag.rank / 100);
        matched.add(tag.name);
      }
    }
    if (description.includes(term)) {
      score += 1;
    }
  }

  const userScore = anime.score || 0;
  const weight = userScore > 0 ? userScore / 10 : 0.5;

  return {
    weightedScore: score * weight,
    rawScore: score,
    matched: Array.from(matched).slice(0, 5),
  };
}

function search(query) {
  if (!query.trim()) return null;
  const terms = getSearchTerms(query);
  if (!terms.length) return [];

  return animeData
    .map(anime => {
      const { weightedScore, rawScore, matched } = scoreAnime(anime, terms);
      return { ...anime, weightedScore, rawScore, matched };
    })
    .filter(a => a.rawScore > 0)
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, 18);
}

function renderCard(anime, showMatched) {
  const title = anime.title || anime.titleRomaji;
  const score = anime.score > 0 ? `${anime.score}/10` : '—';
  const genres = (anime.genres || []).slice(0, 3);
  const desc = anime.description || '';
  const synopsis = desc.length > 180 ? desc.slice(0, 180) + '…' : desc;
  const matched = anime.matched || [];

  return `
    <div class="card" onclick="window.open('${anime.url}', '_blank')" title="${title}">
      <div class="card-cover">
        <img src="${anime.cover}" alt="" loading="lazy">
        <div class="card-score">★ ${score}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${title}</h3>
        <div class="card-genres">
          ${genres.map(g => `<span class="genre-pill">${g}</span>`).join('')}
        </div>
        ${synopsis ? `<p class="card-synopsis">${synopsis}</p>` : ''}
        ${showMatched && matched.length ? `<div class="card-matched">↳ ${matched.join(', ')}</div>` : ''}
      </div>
    </div>
  `;
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
  const top = animeData.filter(a => a.score >= 9).slice(0, 12);

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
