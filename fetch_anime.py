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
          duration
          averageScore
          season
          seasonYear
          siteUrl
          studios {
            edges {
              isMain
              node {
                name
              }
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

def get_studios(media):
    # AniList's "Studios" section on the site is the isMain edges; the rest
    # (isMain: false) are "Producers" and shouldn't show up as a studio.
    edges = media.get("studios", {}).get("edges", [])
    return list(dict.fromkeys(e["node"]["name"] for e in edges if e.get("isMain")))

def fetch_tag_descriptions():
    query = "query { MediaTagCollection { name description } }"
    response = requests.post(
        ANILIST_API,
        json={"query": query},
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    response.raise_for_status()
    data = response.json()
    if "errors" in data:
        raise Exception(f"Anilist API error: {data['errors']}")
    return {t["name"]: t["description"] for t in data["data"]["MediaTagCollection"]}

def load_existing_prereq_map(path):
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        existing = json.load(f)
    return {a["id"]: a["requiresPrereq"] for a in existing if "requiresPrereq" in a}

def load_existing_awards_map(path):
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        existing = json.load(f)
    return {a["id"]: a["specialAwards"] for a in existing if "specialAwards" in a}

def fetch_anime_list(existing_prereq_map, existing_awards_map):
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
    new_ids = []
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
            if media["id"] in existing_prereq_map:
                requires_prereq = existing_prereq_map[media["id"]]
            else:
                relation_edges = media.get("relations", {}).get("edges", [])
                requires_prereq = any(
                    e["relationType"] == "PREQUEL" and e["node"]["type"] == "ANIME"
                    for e in relation_edges
                )
                new_ids.append(media["id"])
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
                "lengthMinutes": (media["episodes"] or 0) * (media["duration"] or 0) or None,
                "averageScore": media["averageScore"],
                "year": media.get("seasonYear"),
                "season": media.get("season"),
                "url": media["siteUrl"],
                "notes": entry["notes"] or "",
                "studios": get_studios(media),
                "requiresPrereq": requires_prereq,
                "specialAwards": existing_awards_map.get(media["id"], []),
            })

    entries.sort(key=lambda x: (x["score"] or 0, x["averageScore"] or 0), reverse=True)
    return entries, new_ids

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    out = os.path.join("data", "anime.json")
    existing_prereq_map = load_existing_prereq_map(out)
    existing_awards_map = load_existing_awards_map(out)
    print(f"Fetching completed anime for {USERNAME}...")
    anime, new_ids = fetch_anime_list(existing_prereq_map, existing_awards_map)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(anime, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(anime)} anime to {out}")

    print("Fetching AniList tag descriptions...")
    tag_descriptions = fetch_tag_descriptions()
    tags_out = os.path.join("data", "tag_descriptions.json")
    with open(tags_out, "w", encoding="utf-8") as f:
        json.dump(tag_descriptions, f, ensure_ascii=False, indent=2, sort_keys=True)
    print(f"Saved {len(tag_descriptions)} tag descriptions to {tags_out}")

    if new_ids:
        print(f"\n{len(new_ids)} new anime not in prior data — requiresPrereq was guessed from AniList's PREQUEL relation. Review these manually:")
        for a in anime:
            if a["id"] in new_ids:
                print(f"  [{a['requiresPrereq']}] {a['title']} (id={a['id']})")
