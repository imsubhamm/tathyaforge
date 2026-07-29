import csv
import json
import re
import time
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "outputs" / "creator_leads_india" / "creatorfinder_global_harvest.csv"
SITEMAP = "https://creatorfinderhub.com/sitemap.xml"

CATEGORY_MAP = {
    "health-fitness": "Fitness trainers",
    "education": "Educators",
    "tech": "Educators",
    "finance": "Finance/business creators",
    "business": "Finance/business creators",
    "crypto": "Finance/business creators",
    "food-cooking": "Cooking creators",
    "sports": "Fitness trainers",
    "music": "Dance/music/art creators",
    "fashion-beauty": "Dance/music/art creators",
    "lifestyle": "Spiritual/wellness creators",
}

PRIORITY_COUNTRIES = [
    "global",
    "india",
    "united-states-of-america",
    "united-kingdom",
    "canada",
    "australia",
    "united-arab-emirates",
    "singapore",
    "germany",
    "netherlands",
    "south-africa",
    "philippines",
]

EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")


def fetch(url: str) -> str:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urlopen(req, timeout=25).read().decode("utf-8", errors="ignore")


def clean_email(email: str) -> str | None:
    email = email.strip().strip(".,;:)'\"<>")
    lower = email.lower()
    if "*" in email or lower.endswith((".png", ".jpg", ".jpeg", ".webp", ".svg", ".js", ".css")):
        return None
    if lower in {"example@example.com", "support@example.com"}:
        return None
    return email


def sitemap_urls() -> list[str]:
    text = fetch(SITEMAP)
    urls = re.findall(r"<loc>(https://creatorfinderhub\.com/top/[^<]+)</loc>", text)
    selected = []
    for url in urls:
        slug = url.rsplit("/", 1)[-1]
        if not any(f"top-{key}-influencers-in-" in slug for key in CATEGORY_MAP):
            continue
        selected.append(url)
    priority = []
    rest = []
    for url in selected:
        slug = url.rsplit("/", 1)[-1]
        if any(slug.endswith(f"-in-{country}") for country in PRIORITY_COUNTRIES):
            priority.append(url)
        else:
            rest.append(url)
    return priority + rest


def category_for(url: str) -> str:
    slug = url.rsplit("/", 1)[-1]
    for key, category in CATEGORY_MAP.items():
        if f"top-{key}-influencers-in-" in slug:
            return category
    return "Creators"


def location_for(url: str) -> str:
    slug = url.rsplit("-in-", 1)[-1]
    return slug.replace("-", " ").title()


def parse_page(url: str) -> list[dict[str, str]]:
    html = fetch(url)
    category = category_for(url)
    location = location_for(url)
    rows = []
    for script in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S | re.I):
        try:
            data = json.loads(script)
        except json.JSONDecodeError:
            continue
        for element in data.get("itemListElement") or []:
            item = element.get("item", {}) if isinstance(element, dict) else {}
            name = item.get("name") or ""
            desc = item.get("description") or ""
            count = (item.get("interactionStatistic") or {}).get("userInteractionCount")
            if not isinstance(count, int) or not (10_000 <= count <= 200_000):
                continue
            emails = sorted({e for e in (clean_email(x) for x in EMAIL_RE.findall(desc)) if e})
            if not emails:
                continue
            for email in emails:
                rows.append({
                    "email": email,
                    "creator": name,
                    "category": category,
                    "handle": "",
                    "followers": str(count),
                    "location": location,
                    "source_url": url,
                    "source_type": "CreatorFinderHub JSON-LD / public YouTube bio",
                    "fit_score": "7",
                    "status": "ready",
                    "notes": " ".join(desc.split())[:240],
                })
    return rows


def main() -> None:
    seen = set()
    rows = []
    urls = sitemap_urls()
    print(f"Scanning {len(urls)} category pages")
    for url in urls:
        try:
            parsed = parse_page(url)
        except Exception as exc:
            print(f"FETCH_FAILED {url}: {exc}")
            continue
        for row in parsed:
            key = row["email"].lower()
            if key in seen:
                continue
            seen.add(key)
            rows.append(row)
        print(f"{len(rows):03d} leads after {url}")
        if len(rows) >= 120:
            break
        time.sleep(0.5)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "email",
                "creator",
                "category",
                "handle",
                "followers",
                "location",
                "source_url",
                "source_type",
                "fit_score",
                "status",
                "notes",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)
    print(f"WROTE {len(rows)} rows to {OUT}")
    for row in rows[:40]:
        print(row["email"], "|", row["creator"], "|", row["followers"], "|", row["category"], "|", row["location"])


if __name__ == "__main__":
    main()
