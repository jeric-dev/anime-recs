# Jeric's Anime Picks

Personalized anime recommendation page. Search by mood, genre, or theme to find shows from my Anilist completed list.

## Setup

**1. Install the dependency**
```
pip install requests
```

**2. Fetch your anime data**
```
cd "C:\Users\Jeric Brual\Documents\anime-recs"
python fetch_anime.py
```
This generates `data/anime.json` from your Anilist profile.

**3. Push to GitHub and enable Pages**
```
git init
git add .
git commit -m "Initial build"
git remote add origin https://github.com/jeric-dev/anime-recs.git
git branch -M main
git push -u origin main
```
Then go to the repo on GitHub → Settings → Pages → Branch: main / root → Save.

Your site will be live at: https://jeric-dev.github.io/anime-recs/

## Updating

When your Anilist list changes, re-run the fetch script and push:
```
python fetch_anime.py
git add data/anime.json
git commit -m "Update anime data"
git push
```
