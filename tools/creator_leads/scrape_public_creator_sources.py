import csv
import json
import re
import sys
import time
from html import unescape
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "outputs" / "creator_leads_india" / "public_source_scrape.csv"

URLS = {
    "Educators": [
        "https://creatorfinderhub.com/top/top-tech-influencers-in-india",
        "https://creatorfinderhub.com/top/top-education-influencers-in-india",
        "https://qoruz.com/find-influencers/top-education-bloggers-influencers-india-youtube",
    ],
    "Finance/business creators": [
        "https://creatorfinderhub.com/top/top-business-influencers-in-india",
        "https://creatorfinderhub.com/top/top-crypto-influencers-in-india",
        "https://creatorfinderhub.com/top/top-finance-influencers-in-india",
        "https://influencers.feedspot.com/indian_finance_instagram_influencers/",
    ],
    "Fitness trainers": [
        "https://creatorfinderhub.com/top/top-health-fitness-influencers-in-global",
        "https://creatorfinderhub.com/top/top-sports-influencers-in-india",
        "https://influencers.feedspot.com/indian_fitness_instagram_influencers/",
    ],
    "Dance/music/art creators": [
        "https://creatorfinderhub.com/top/top-music-influencers-in-india",
        "https://creatorfinderhub.com/top/top-fashion-beauty-influencers-in-india",
        "https://influencers.feedspot.com/indian_dance_instagram_influencers/",
    ],
    "Spiritual/wellness creators": [
        "https://creatorfinderhub.com/top/top-lifestyle-influencers-in-india",
        "https://influencers.feedspot.com/indian_yoga_instagram_influencers/",
    ],
}

EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")
NAME_RE = re.compile(r"###\s+([^\n<]+)")
FOLLOWERS_RE = re.compile(r"(?:IN|Global)\s+([0-9.]+)([KMB]?)\s+Followers", re.I)
HANDLE_RE = re.compile(r"Instagram Handle\s+(@[A-Za-z0-9._]+)|instagram(?: id)?\s+(@[A-Za-z0-9._]+)", re.I)


def fetch(url: str) -> str:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=25) as res:
        raw = res.read()
    return unescape(raw.decode("utf-8", errors="ignore"))


def follower_number(value: str, suffix: str) -> int:
    num = float(value)
    if suffix.upper() == "K":
        num *= 1_000
    elif suffix.upper() == "M":
        num *= 1_000_000
    elif suffix.upper() == "B":
        num *= 1_000_000_000
    return int(num)


def clean_email(email: str) -> str | None:
    e = email.strip().strip(".,;:)'\"<>")
    if "*" in e or e.lower().startswith("email") or "[email" in e.lower():
        return None
    if e.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        return None
    return e


def blocks(html: str):
    html = html.replace("</div><div", "</div>\n<div")
    starts = [m.start() for m in re.finditer(r'<h3[^>]*class="[^"]*font-bold[^"]*"[^>]*>', html)]
    if starts:
        starts.append(len(html))
        for a, b in zip(starts, starts[1:]):
            part = html[a:b]
            if "@" in part or "Followers" in part:
                yield part
        return
    parts = re.split(r"\n(?=\d+\n|### )", html)
    for part in parts:
        if "@" in part or "Followers" in part:
            yield part


def parse_block(category: str, url: str, block: str):
    emails = sorted({e for e in (clean_email(x) for x in EMAIL_RE.findall(block)) if e})
    if not emails:
        return []
    name_match = NAME_RE.search(block)
    if not name_match:
        h3 = re.search(r"<h3[^>]*>(.*?)</h3>", block, re.S | re.I)
        name = re.sub(r"<[^>]+>", "", h3.group(1)).strip() if h3 else ""
    else:
        name = name_match.group(1).strip()
    followers = ""
    follower_count = None
    fm = FOLLOWERS_RE.search(block)
    if fm:
        followers = f"{fm.group(1)}{fm.group(2).upper()}"
        follower_count = follower_number(fm.group(1), fm.group(2))
    else:
        fmh = re.search(r'>([0-9.]+)([KMB]?)\s+Followers<', block, re.I)
        if fmh:
            followers = f"{fmh.group(1)}{fmh.group(2).upper()}"
            follower_count = follower_number(fmh.group(1), fmh.group(2))
    handle = ""
    hm = HANDLE_RE.search(block)
    if hm:
        handle = next((g for g in hm.groups() if g), "")

    rows = []
    for email in emails:
        in_range = follower_count is not None and 20_000 <= follower_count <= 200_000
        if not in_range:
            continue
        if "feedspot" in url and ("*****" in block or not in_range):
            continue
        rows.append({
            "category": category,
            "creator": name,
            "handle": handle,
            "followers": followers,
            "email": email,
            "source_url": url,
            "source_type": "Directory/export-style public page",
            "status": "counted_real_email",
            "snippet": " ".join(block.split())[:500],
        })
    return rows


def parse_json_ld(category: str, url: str, html: str):
    rows = []
    for script in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S | re.I):
        try:
            data = json.loads(script)
        except json.JSONDecodeError:
            continue
        elements = data.get("itemListElement") or []
        for element in elements:
            item = element.get("item", {}) if isinstance(element, dict) else {}
            name = item.get("name") or ""
            description = item.get("description") or ""
            stat = item.get("interactionStatistic") or {}
            follower_count = stat.get("userInteractionCount")
            if not isinstance(follower_count, int):
                continue
            if not (20_000 <= follower_count <= 200_000):
                continue
            emails = sorted({e for e in (clean_email(x) for x in EMAIL_RE.findall(description)) if e})
            for email in emails:
                rows.append({
                    "category": category,
                    "creator": name,
                    "handle": "",
                    "followers": str(follower_count),
                    "email": email,
                    "source_url": url,
                    "source_type": "Directory JSON-LD / public YouTube bio",
                    "status": "counted_real_email",
                    "snippet": " ".join(description.split())[:500],
                })
    return rows


def main():
    found = []
    seen = set()
    debug_saved = False
    for category, urls in URLS.items():
        for url in urls:
            try:
                html = fetch(url)
            except (HTTPError, URLError, TimeoutError) as exc:
                print(f"FETCH_FAILED {url}: {exc}", file=sys.stderr)
                continue
            if not debug_saved:
                (OUT.parent / "debug_page.html").write_text(html, encoding="utf-8")
                debug_saved = True
            parsed = parse_json_ld(category, url, html)
            if not parsed:
                for block in blocks(html):
                    parsed.extend(parse_block(category, url, block))
            for row in parsed:
                    key = row["email"].lower()
                    if key in seen:
                        continue
                    seen.add(key)
                    found.append(row)
            time.sleep(1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["category", "creator", "handle", "followers", "email", "source_url", "source_type", "status", "snippet"])
        writer.writeheader()
        writer.writerows(found)
    print(f"WROTE {len(found)} rows to {OUT}")
    for row in found[:20]:
        print(row["category"], row["creator"], row["followers"], row["email"])


if __name__ == "__main__":
    main()
