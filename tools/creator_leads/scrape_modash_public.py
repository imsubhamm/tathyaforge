import csv
import re
from html import unescape
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "outputs" / "creator_leads_india" / "modash_public_scrape.csv"

URLS = {
    "Fitness trainers": [
        "https://www.modash.io/find-influencers/india/fitness",
        "https://www.modash.io/find-influencers/india/hyderabad/fitness",
        "https://www.modash.io/find-influencers/india/mumbai/fitness",
        "https://www.modash.io/find-influencers/india/delhi/fitness",
        "https://www.modash.io/find-influencers/india/bangalore/fitness",
    ],
    "Spiritual/wellness creators": [
        "https://www.modash.io/find-influencers/india/yoga",
        "https://www.modash.io/find-influencers/india/mumbai/yoga",
        "https://www.modash.io/find-influencers/india/delhi/yoga",
        "https://www.modash.io/find-influencers/india/bangalore/yoga",
    ],
    "Dance/music/art creators": [
        "https://www.modash.io/find-influencers/india/dance",
        "https://www.modash.io/find-influencers/india/music",
        "https://www.modash.io/find-influencers/india/art",
    ],
    "Finance/business creators": [
        "https://www.modash.io/find-influencers/india/finance",
        "https://www.modash.io/find-influencers/india/business",
        "https://www.modash.io/find-influencers/india/crypto",
    ],
    "Educators": [
        "https://www.modash.io/find-influencers/india/education",
        "https://www.modash.io/find-influencers/india/tech",
    ],
}

EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")


def fetch(url: str) -> str:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    raw = urlopen(req, timeout=25).read()
    return unescape(raw.decode("utf-8", errors="ignore"))


def parse_followers(text: str):
    m = re.search(r"Followers\s+([0-9.]+)\s*([kKmM]?)", text)
    if not m:
        return "", None
    val = float(m.group(1))
    suffix = m.group(2).lower()
    count = val * (1_000_000 if suffix == "m" else 1_000 if suffix == "k" else 1)
    return f"{m.group(1)}{m.group(2).lower()}", int(count)


def strip_tags(html: str) -> str:
    html = re.sub(r"<script.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style.*?</style>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", "\n", html)
    return re.sub(r"\n{2,}", "\n", text)


def parse_page(category: str, url: str, html: str):
    text = strip_tags(html)
    blocks = re.split(r"\n##\s+\d+\.\s+", text)
    rows = []
    for block in blocks[1:]:
        lines = [x.strip() for x in block.splitlines() if x.strip()]
        if not lines:
            continue
        name = lines[0]
        block_text = " ".join(lines)
        emails = sorted(set(EMAIL_RE.findall(block_text)))
        if not emails:
            continue
        followers, count = parse_followers(block_text)
        if count is None or not (20_000 <= count <= 200_000):
            continue
        handles = re.findall(r"@[A-Za-z0-9._]+", block_text)
        handle = handles[-1] if handles else ""
        for email in emails:
            if "*" in email or email.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                continue
            rows.append({
                "category": category,
                "creator": name,
                "handle": handle,
                "followers": followers,
                "email": email,
                "source_url": url,
                "source_type": "Modash public page",
                "status": "counted_real_email",
                "snippet": block_text[:500],
            })
    return rows


def main():
    seen = set()
    out = []
    for category, urls in URLS.items():
        for url in urls:
            try:
                html = fetch(url)
            except (HTTPError, URLError, TimeoutError) as exc:
                print(f"FETCH_FAILED {url}: {exc}")
                continue
            for row in parse_page(category, url, html):
                key = row["email"].lower()
                if key in seen:
                    continue
                seen.add(key)
                out.append(row)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["category", "creator", "handle", "followers", "email", "source_url", "source_type", "status", "snippet"])
        writer.writeheader()
        writer.writerows(out)
    print(f"WROTE {len(out)} rows to {OUT}")
    for row in out:
        print(row["category"], row["creator"], row["followers"], row["email"])


if __name__ == "__main__":
    main()
