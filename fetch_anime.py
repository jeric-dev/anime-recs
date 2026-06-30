import requests
import json
import os
import re

ANILIST_API = "https://graphql.anilist.co"
USERNAME = "JBrual"

QUERY = """
query ($username: String) {
  MediaListCollection(userName: $username, type: ANIME, status: COMPLETED) {
    lists {
      entries {
        score(format: POINT_10)
        notes
        media {
          id
          title {
            romaji
            english
          }
          genres
          tags {
            name
            rank
            isGeneralSpoiler
            isMediaSpoiler
          }
          description(asHtml: false)
          coverImage {
            extraLarge
          }
          episodes
          averageScore
          seasonYear
          siteUrl
          studios {
            nodes {
              name
              isAnimationStudio
            }
          }
          relations {
            edges {
              relationType
              node {
                type
              }
            }
          }
        }
      }
    }
  }
}
"""

def clean_description(desc):
    if not desc:
        return ""
    desc = re.sub(r'<[^>]+>', '', desc)
    desc = re.sub(r'&[a-zA-Z]+;', ' ', desc)
    desc = re.sub(r'\s*\(Source:[^)]*\)', '', desc, flags=re.IGNORECASE)
    desc = re.sub(r'\s*Notes?:.*$', '', desc, flags=re.IGNORECASE | re.DOTALL)
    desc = desc.replace('\r\n', '\n').replace('\r', '\n')
    desc = '\n'.join(re.sub(r' +', ' ', line).strip() for line in desc.split('\n'))
    desc = re.sub(r'\n{3,}', '\n\n', desc)
    return desc.strip()

def fetch_anime_list():
    response = requests.post(
        ANILIST_API,
        json={"query": QUERY, "variables": {"username": USERNAME}},
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    response.raise_for_status()
    data = response.json()

    if "errors" in data:
        raise Exception(f"Anilist API error: {data['errors']}")

    seen_ids = set()
    entries = []
    for lst in data["data"]["MediaListCollection"]["lists"]:
        for entry in lst["entries"]:
            media = entry["media"]
            if media["id"] in seen_ids:
                continue
            seen_ids.add(media["id"])
            score = entry["score"] or 0
            if score == 0:
                continue  # drop unrated entries entirely
            tags = [
                {"name": t["name"], "rank": t["rank"]}
                for t in media["tags"]
                if not t["isGeneralSpoiler"] and not t["isMediaSpoiler"]
            ]
            relation_edges = media.get("relations", {}).get("edges", [])
            is_sequel = any(
                e["relationType"] == "PREQUEL" and e["node"]["type"] == "ANIME"
                for e in relation_edges
            )
            entries.append({
                "id": media["id"],
                "title": media["title"]["english"] or media["title"]["romaji"],
                "titleRomaji": media["title"]["romaji"],
                "score": score,
                "genres": media["genres"],
                "tags": tags,
                "description": clean_description(media["description"]),
                "cover": media["coverImage"]["extraLarge"],
                "episodes": media["episodes"],
                "averageScore": media["averageScore"],
                "year": media.get("seasonYear"),
                "url": media["siteUrl"],
                "notes": entry["notes"] or "",
                "studios": list(dict.fromkeys(s["name"] for s in media.get("studios", {}).get("nodes", []) if s.get("isAnimationStudio"))),
                "isSequel": is_sequel,
            })

    entries.sort(key=lambda x: (x["score"] or 0, x["averageScore"] or 0), reverse=True)
    return entries

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    print(f"Fetching completed anime for {USERNAME}...")
    anime = fetch_anime_list()
    out = os.path.join("data", "anime.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(anime, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(anime)} anime to {out}")
