# Jeric's Anime Recommendations

A personal anime recommendation site built on top of my [Anilist](https://anilist.co) profile. Friends can filter by mood, genre, studio, and more to find something from my completed list that fits.

**Live site:** https://jeric-dev.github.io/anime-recs

## What it does

- Pulls my completed anime list from Anilist (ratings, genres, tags, studios, seasons, and personal review notes)
- Lets visitors filter using structured chips — genres, demographics, studios, themes, tone, cast/characters, and more
- Tag chips show Anilist's own description on hover (desktop) or long-press (mobile)
- Ranks results by my personal rating first, tiebroken by tag relevance, then Anilist's community average
- Result cards show the animation studio(s) under the title (genres were dropped from the card front to save space and avoid repeating what's already filterable via chips)
- Clicking a card opens a detail view with the full description, studio, season, any special award badges, and a link to my review where one exists
- Default view (no filters) shows my ★9 and ★10 rated picks
- Anime that need prior series/season context are excluded from results entirely (hand-curated, not just "has a prequel")
- Mature content (Ecchi genre, or tags like Nudity/Large Breasts at ≥75% rank) is hidden from every view — default and filtered — until the "Mature Content" toggle is switched on
- The header shows a randomized, blurred collage of covers from my list behind the title — a fresh mix every page load

## How filtering works

Filters are multi-select chips grouped by category. Clicking a chip cycles through three states:

- **Unselected** → **Include** (purple) → **Exclude** (red/strikethrough) → Unselected

Every filter chip — including Length and Special Titles — supports all three states.

By default, every selected filter must match — both within a single group and across groups — so selecting Action + Comedy requires *both* genres, and adding Kyoto Animation as a studio narrows further to anime matching all three. Picking two Length buckets (like Short + Medium) correctly returns nothing by default, since a show can't be both at once.

Toggling **Match Any (OR)** switches everything to loose OR logic instead — Action + Comedy now finds anime with at least one of those genres, and adding Kyoto Animation as a studio widens the results further rather than narrowing them.

Length, Year Range, My Score, Special Titles, and Genres are always expanded. Everything after that (Demographic, Fantasy & Supernatural, Setting, Studio, Mature Content, etc.) lives under an "Additional Filters" row — a single line of small category pills, aligned with the Genres row above it, instead of stacking full-width empty sections. Clicking a pill reveals that group's chips below the row. A badge on a pill shows how many chips are active inside it, so selections in a collapsed category aren't invisible.

### Filter groups

Length, Year Range, My Score, Special Titles, and Genres come first as "facts about the entry"; everything under the "Additional Filters" pill row is alphabetized by group name:

| Group | Notes |
|---|---|
| Length | Short (< 5 hrs), Medium (5–10 hrs), Long (> 10 hrs) — based on total runtime (episodes × episode length), not episode count |
| Year Range | Dual-handle slider |
| My Score | Dual-handle slider, 1–10, same mechanics as Year Range |
| Special Titles | Award Winning (any AOTY/MOTY placement or community award), Certified Fresh, Certified Rotten |
| Genres | Anilist genres that clear the same ≥5-anime qualification bar as tags (currently 14 of 17 — Horror, Mahou Shoujo, Mecha, and Thriller are excluded for too few results) |
| Activities & Hobbies | Band, Video Games, Athletics, Card Battle, and more |
| Cast | Female/Male Protagonist, Ensemble Cast, Primarily Teen/Adult/Child Cast |
| Characters | Tsundere, Kuudere, Anti-Hero, and more |
| Demographic | Shounen, Shoujo, Seinen, Josei |
| Fantasy & Supernatural | Magic, Demons, Youkai, Aliens, and more |
| Mature Content | Hidden behind a toggle — explicit/mature tags. Anime matching Ecchi or a qualifying mature tag are excluded from every view until the toggle is on |
| Relationships & Romance | Heterosexual, Female Harem, Love Triangle, and more |
| Setting | School, Isekai, Urban Fantasy, Historical, Medieval, and more |
| Studio | Only studios with 5+ non-prerequisite anime from my list, per Anilist's own Studios (not Producers) credit |
| Themes | Coming of Age, War, Revenge, Found Family, and more |
| Tone | Iyashikei, Parody, Slapstick, Episodic, and more |

Length, Year Range, My Score, and Special Titles don't contribute to the ranking score the way Genres/Tags/Studios do — they only include/exclude anime from the results — but they still count as active filters under the AND/OR toggle just like every other group.

Every tag shown as a filter appears in at least 5 of my completed anime at ≥75% Anilist rank confidence — this keeps the chip list free of one-off or barely-relevant tags.

### Scoring & sort order

- **Genres & Studios:** +10 pts flat per match
- **Tags & Demographics:** `(rank / 100) × 5` pts if the tag's rank is ≥75% — a tag at 96% confidence scores 4.8 pts, one at 75% scores 3.75 pts

Results are sorted by **my personal rating first**, then by **total match score** (tag/genre/studio relevance), then by **Anilist's community average score**, then **alphabetically by title** as the final tiebreaker.

## Special award badges

Shown on the detail view next to the season badge, and filterable via the "Special Titles" group:

- 🏆 **Jeric's AOTY Winner** — my own personal pick for a given year
- 🏆 **5ch AOTY Winner** — crowned Anime of the Year by members of 5ch
- 🏆 **4chan AOTY Winner** — crowned Anime of the Year by members of /a/
- 🏆 **Crunchyroll AOTY Winner** — won the Crunchyroll Anime Award for Anime of the Year
- 🏆 **r/anime AOTY/MOTY Jury/Public Winner** — community award wins
- 🍅 **Certified Fresh** / 🗑️ **Certified Rotten** — my own quality call, independent of score, for shows that are either a great starting point regardless of genre or a rough watch

## Stack

- **Frontend:** Vanilla JS, HTML, CSS — no frameworks, no build step
- **Data:** Static `data/anime.json` and `data/tag_descriptions.json`, both generated by `fetch_anime.py`
- **Hosting:** GitHub Pages

## Updating the anime list

Run the fetch script whenever you want to sync with your Anilist profile:

```bash
pip install requests
python fetch_anime.py
```

This overwrites `data/anime.json` and `data/tag_descriptions.json`. Hand-curated fields (`requiresPrereq`, `specialAwards`) are preserved across re-runs by ID — only genuinely new anime get a best-guess default (flagged in the script's output for manual review). Commit and push to deploy.

If you change any CSS or JS, bump the `?v=` cache-busting query string on `style.css`/`app.js` in `index.html` — GitHub Pages' CDN caches aggressively and won't pick up changes otherwise.
