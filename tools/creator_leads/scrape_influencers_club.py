import csv
import re
from html import unescape
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "outputs" / "creator_leads_india" / "influencers_club_scrape.csv"

URLS = {
    "Fitness trainers": [
        "https://influencers.club/fitness-creators-email-list/",
        "https://influencers.club/strength-trainers-email-list/",
        "https://influencers.club/sports-trainers-email-list/",
        "https://influencers.club/boxing-trainers-email-list/",
        "https://influencers.club/yoga-coaches-email-list/",
        "https://influencers.club/personal-trainers-email-list/",
        "https://influencers.club/yoga-instructors-email-list/",
        "https://influencers.club/fitness-instructors-email-list/",
        "https://influencers.club/pilates-instructors-email-list/",
        "https://influencers.club/fitness-models-email-list/",
        "https://influencers.club/strength-coaches-email-list/",
        "https://influencers.club/dance-instructors-email-list/",
        "https://influencers.club/sports-coaches-email-list/",
        "https://influencers.club/weight-loss-coaches-email-list/",
        "https://influencers.club/bodybuilding-coaches-email-list/",
        "https://influencers.club/running-coaches-email-list/",
        "https://influencers.club/athletic-trainers-email-list/",
        "https://influencers.club/crossfit-coaches-email-list/",
        "https://influencers.club/gym-trainers-email-list/",
    ],
    "Dance/music/art creators": [
        "https://influencers.club/content-creators-email-list/",
        "https://influencers.club/ugc-content-creators-email-list/",
        "https://influencers.club/youtuber-creators-email-list/",
        "https://influencers.club/podcast-creators-email-list/",
        "https://influencers.club/beauty-content-creators-email-list/",
        "https://influencers.club/video-creators-email-list/",
        "https://influencers.club/short-video-creators-email-list/",
        "https://influencers.club/musician-creators-email-list/",
        "https://influencers.club/book-creators-email-list/",
        "https://influencers.club/designer-creators-email-list/",
        "https://influencers.club/music-artists-email-list/",
        "https://influencers.club/music-creators-email-list/",
        "https://influencers.club/art-creators-email-list/",
        "https://influencers.club/digital-artists-email-list/",
        "https://influencers.club/visual-artists-email-list/",
        "https://influencers.club/youtube-creators-email-list/",
        "https://influencers.club/youtube-content-creators-email-list/",
        "https://influencers.club/performance-artists-email-list/",
        "https://influencers.club/graffiti-artists-email-list/",
    ],
    "Educators": [
        "https://influencers.club/ai-content-creators-email-list/",
        "https://influencers.club/website-creators-email-list/",
        "https://influencers.club/tech-educators-email-list/",
        "https://influencers.club/online-educators-email-list/",
        "https://influencers.club/student-mentors-email-list/",
        "https://influencers.club/freelance-educators-email-list/",
        "https://influencers.club/science-educators-email-list/",
        "https://influencers.club/art-educators-email-list/",
        "https://influencers.club/music-educators-email-list/",
        "https://influencers.club/health-educators-email-list/",
        "https://influencers.club/financial-educators-email-list/",
        "https://influencers.club/software-developers-email-list/",
        "https://influencers.club/web-developers-email-list/",
        "https://influencers.club/data-scientists-email-list/",
        "https://influencers.club/educational-consultants-email-list/",
        "https://influencers.club/computer-scientists-email-list/",
    ],
    "Cooking creators": [
        "https://influencers.club/recipe-creators-email-list/",
        "https://influencers.club/chef-creators-email-list/",
        "https://influencers.club/catering-chefs-email-list/",
        "https://influencers.club/culinary-instructors-email-list/",
        "https://influencers.club/food-bloggers-email-list/",
        "https://influencers.club/private-chefs-email-list/",
        "https://influencers.club/recipe-developers-email-list/",
        "https://influencers.club/cookbook-authors-email-list/",
        "https://influencers.club/food-writers-email-list/",
    ],
    "Spiritual/wellness creators": [
        "https://influencers.club/latina-creators-email-list/",
        "https://influencers.club/wellness-bloggers-email-list/",
        "https://influencers.club/wellness-advisors-email-list/",
        "https://influencers.club/meditation-coaches-email-list/",
        "https://influencers.club/self-care-coaches-email-list/",
        "https://influencers.club/life-purpose-coaches-email-list/",
        "https://influencers.club/life-coaches-email-list/",
        "https://influencers.club/health-coaches-email-list/",
        "https://influencers.club/wellness-coaches-email-list/",
        "https://influencers.club/mental-health-coaches-email-list/",
        "https://influencers.club/mindset-coaches-email-list/",
        "https://influencers.club/spiritual-advisors-email-list/",
        "https://influencers.club/holistic-health-coaches-email-list/",
        "https://influencers.club/empowerment-coaches-email-list/",
    ],
    "Finance/business creators": [
        "https://influencers.club/business-podcasts-email-list/",
        "https://influencers.club/business-mentors-email-list/",
        "https://influencers.club/online-business-mentors-email-list/",
        "https://influencers.club/value-investors-email-list/",
        "https://influencers.club/wealth-advisors-email-list/",
        "https://influencers.club/business-coaches-email-list/",
        "https://influencers.club/forex-traders-email-list/",
        "https://influencers.club/real-estate-investors-email-list/",
        "https://influencers.club/financial-advisors-email-list/",
        "https://influencers.club/day-traders-email-list/",
        "https://influencers.club/financial-coaches-email-list/",
        "https://influencers.club/crypto-investors-email-list/",
        "https://influencers.club/investment-advisors-email-list/",
        "https://influencers.club/online-entrepreneurs-email-list/",
        "https://influencers.club/tech-entrepreneurs-email-list/",
    ],
}

EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")


def fetch(url: str) -> str:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return unescape(urlopen(req, timeout=25).read().decode("utf-8", errors="ignore"))


def strip_tags(html: str) -> str:
    html = re.sub(r"<script.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style.*?</style>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", "\n", html)
    return re.sub(r"\n{2,}", "\n", text)


def followers_to_int(raw: str) -> int:
    raw = raw.strip().replace(",", "")
    m = re.match(r"([0-9.]+)\s*([KkMm]?)", raw)
    if not m:
        return 0
    n = float(m.group(1))
    if m.group(2).lower() == "k":
        n *= 1000
    elif m.group(2).lower() == "m":
        n *= 1_000_000
    return int(n)


def parse(category: str, url: str, html: str) -> list[dict[str, str]]:
    blocks = re.split(r'<div class="profile-card">', html)
    rows = []
    for block in blocks[1:]:
        block_text = strip_tags(block)
        emails = sorted(set(EMAIL_RE.findall(block_text)))
        if not emails:
            continue
        nm = re.search(r'<h4 class="profile-name">\s*(.*?)\s*</h4>', block, re.S)
        creator = re.sub(r"\s+", " ", nm.group(1)).strip() if nm else "Creator"
        hm = re.search(r">(@[A-Za-z0-9._]+)\s*</a>", block)
        fm = re.search(r'<span class="stat-number">([0-9.,]+[KkMm]?)</span>\s*<span class="stat-label">Followers</span>', block, re.S)
        if not fm:
            continue
        followers_raw = fm.group(1)
        followers = followers_to_int(followers_raw)
        if not (10_000 <= followers <= 200_000):
            continue
        loc = ""
        lm = re.search(r'<span class="stat-number">([^<]+)</span>\s*<span class="stat-label">Location</span>', block, re.S)
        if lm:
            loc = re.sub(r"\s+", " ", lm.group(1)).strip()
        for email in emails:
            rows.append({
                "email": email,
                "creator": creator,
                "category": category,
                "handle": hm.group(1) if hm else "",
                "followers": str(followers),
                "location": loc or "Global",
                "source_url": url,
                "source_type": "Influencers Club public list",
                "fit_score": "8",
                "status": "ready",
                "notes": block_text[:240],
            })
    return rows


def main() -> None:
    seen = set()
    rows = []
    for category, urls in URLS.items():
        for url in urls:
            try:
                html = fetch(url)
            except Exception as exc:
                print(f"FETCH_FAILED {url}: {exc}")
                continue
            for row in parse(category, url, html):
                key = row["email"].lower()
                if key in seen:
                    continue
                seen.add(key)
                rows.append(row)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["email", "creator", "category", "handle", "followers", "location", "source_url", "source_type", "fit_score", "status", "notes"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"WROTE {len(rows)} rows to {OUT}")
    for row in rows[:40]:
        print(row["email"], "|", row["creator"], "|", row["followers"], "|", row["location"])


if __name__ == "__main__":
    main()
