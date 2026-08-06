import argparse
import csv
import getpass
import hashlib
import mimetypes
import os
import smtplib
import ssl
import subprocess
import sys
import time
from datetime import date, datetime, timedelta
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "outputs" / "creator_leads_india"
DATA_DIR = ROOT / "tools" / "creator_leads" / "data"
LEADS_CSV = DATA_DIR / "creator_leads_master.csv"
SEND_LOG_CSV = DATA_DIR / "send_log.csv"
DAILY_LIMIT = 30
TARGET_LEADS = 1000

SMTP_HOST = "smtp.hostinger.com"
SMTP_PORT = 465
SENDER = "hellow@tathyaforge.in"
FROM_NAME = "TathyaForge"
SITE_URL = "https://tathyaforge.in"
INQUIRY_PHONE = "+919614041877"
SUBJECT = "Your own branded app on App Store and Play Store"
FOLLOWUP_SUBJECT = "Quick follow-up on your branded creator app"
ATTACHMENT = DATA_DIR / "TathyaForge_Creator_App_Deck.pdf"

LEAD_FIELDS = [
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
    "created_at",
    "updated_at",
]

LOG_FIELDS = [
    "sent_at",
    "email",
    "creator",
    "subject",
    "result",
    "error",
]

SEED_LEADS = [
    {"category": "Fitness trainers", "creator": "Wanitha Ashok", "handle": "@wanithaashok", "followers": "32.1K", "location": "Bengaluru", "email": "wanithaashok@gmail.com", "source_url": "https://www.indiatoday.in/magazine/supplement/story/20110110-calendar-of-events-745372-2010-12-29", "source_type": "Public article", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Fitness trainers", "creator": "Mansi Nautiyal Mehta", "handle": "@mansinautiyalmehta", "followers": "44.1K", "location": "Mumbai", "email": "mansinautiyalmehta@gmail.com", "source_url": "https://qoruz.com/mansinautiyalmehta/instagram", "source_type": "Public creator profile", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Educators", "creator": "Build Fast with AI", "handle": "@buildfastwithai", "followers": "109K", "location": "Bengaluru", "email": "hello@buildfastwithai.com", "source_url": "https://www.buildfastwithai.com/", "source_type": "Official website", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Educators", "creator": "Satvik Paramkusham / Build Fast with AI", "handle": "@buildfastwithai", "followers": "109K", "location": "Bengaluru", "email": "satvik@buildfastwithai.com", "source_url": "https://consulting.buildfastwithai.com/", "source_type": "Official consulting page", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Educators", "creator": "Tech Community", "handle": "@techcommunity", "followers": "117K", "location": "India", "email": "technicalvivek3853@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-tech-influencers-in-india", "source_type": "Public creator directory", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Educators", "creator": "Defog Tech", "handle": "", "followers": "87.5K", "location": "India", "email": "support@defogtech.com", "source_url": "https://creatorfinderhub.com/top/top-tech-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Educators", "creator": "Tech With Yeshwanth", "handle": "@techwithyeshwanth", "followers": "29.2K", "location": "India", "email": "techwithyeshwanth@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-tech-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Crypto Shyam", "handle": "@cryptoshyam", "followers": "20K", "location": "Sakti, Chhattisgarh", "email": "cryptoshyamcs@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-crypto-influencers-in-india", "source_type": "Public creator directory", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Real Estate Tv", "handle": "", "followers": "149K", "location": "India", "email": "anrmedia2020@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-tech-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "6", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Financial pandit", "handle": "", "followers": "85.9K", "location": "India", "email": "financialpandit4@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-tech-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Financial Trader", "handle": "", "followers": "109K", "location": "India", "email": "surajslamoutloud@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-tech-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Crypto Universe", "handle": "", "followers": "117K", "location": "India", "email": "Techflexiworks@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-crypto-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Grow Crypto", "handle": "", "followers": "35.4K", "location": "India", "email": "mail2digitaldrishti@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-crypto-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Crypto Miners India", "handle": "", "followers": "52.1K", "location": "India", "email": "Support@cryptominersind.in", "source_url": "https://creatorfinderhub.com/top/top-crypto-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Dubey Loan Credit Card Finance Help", "handle": "", "followers": "108K", "location": "India", "email": "Pradeepdubey963816@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-finance-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Grow Business Finance Hub", "handle": "", "followers": "38.4K", "location": "India", "email": "vikashmishra.business@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-finance-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Finance With Sunil", "handle": "", "followers": "91.7K", "location": "India", "email": "deals.sunilgurjar@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-finance-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Finance/business creators", "creator": "Art Of Finance", "handle": "", "followers": "27K", "location": "India", "email": "thesuccessgate@gmail.com", "source_url": "https://creatorfinderhub.com/top/top-finance-influencers-in-india", "source_type": "Directory JSON-LD / public YouTube bio", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Spiritual/wellness creators", "creator": "Dr Trupti Jayin", "handle": "@drtruptijayin", "followers": "58.6K", "location": "Mumbai", "email": "drtruptijayin@gmail.com", "source_url": "https://truptijayin.com/contactus.html", "source_type": "Official website", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Spiritual/wellness creators", "creator": "Dr Trupti Jayin / SETU", "handle": "@drtruptijayin", "followers": "58.6K", "location": "Mumbai", "email": "setuweb@gmail.com", "source_url": "https://truptijayin.com/contactus.html", "source_type": "Official website", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Spiritual/wellness creators", "creator": "AiR - Atman in Ravi", "handle": "@airatmaninravi", "followers": "56.9K", "location": "Bengaluru", "email": "air@air.ind.in", "source_url": "https://air.ind.in/contact-us/", "source_type": "Official website", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Spiritual/wellness creators", "creator": "AiR - Atman in Ravi", "handle": "@airatmaninravi", "followers": "56.9K", "location": "Bengaluru", "email": "airatmaninravi@gmail.com", "source_url": "https://catalog.in/companies/air-institute-of-realization", "source_type": "Public business listing", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Spiritual/wellness creators", "creator": "Richa Jindal", "handle": "@coachrichajindal", "followers": "57.7K", "location": "New Delhi", "email": "contact@richajindal.in", "source_url": "https://podcasts.apple.com/ca/podcast/inside-the-womb-stories-womb-cast/id1495288362", "source_type": "Public podcast listing", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Spiritual/wellness creators", "creator": "Richa Jindal / The Womb Stories", "handle": "@coachrichajindal", "followers": "57.7K", "location": "New Delhi", "email": "thewombstories@gmail.com", "source_url": "https://www.ivoox.com/podcast-power-of-soul-with-richa-jindal_sq_f1944256_1.html", "source_type": "Public podcast listing", "fit_score": "7", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Spiritual/wellness creators", "creator": "Himani Joshi | Yoga & Wellness", "handle": "@fit_with_himani", "followers": "45.7K", "location": "India", "email": "fitwithhimani.co@gmail.com", "source_url": "https://www.modash.io/find-influencers/india/yoga", "source_type": "Modash public page", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
    {"category": "Educators", "creator": "Sneha Tushi", "handle": "@tushi_studies", "followers": "83.3K", "location": "India", "email": "Snehatushi6@gmail.com", "source_url": "https://www.modash.io/find-influencers/india/yoga", "source_type": "Modash public page", "fit_score": "7", "status": "sent", "notes": "UPSC/study + yoga creator. Sent 2026-07-21"},
    {"category": "Dance/music/art creators", "creator": "Hansvi Tonk", "handle": "@hansvitonk", "followers": "72.5K", "location": "India", "email": "hansvitonk6@gmail.com", "source_url": "https://www.modash.io/find-influencers/india/haridwar", "source_type": "Public creator profile", "fit_score": "8", "status": "sent", "notes": "Sent 2026-07-21"},
]


def now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def smtp_password() -> str:
    password = os.environ.get("HOSTINGER_SMTP_PASSWORD", "")
    if password:
        return password
    if not sys.stdin.isatty():
        raise RuntimeError("HOSTINGER_SMTP_PASSWORD is required for unattended sending")
    return getpass.getpass(f"Password for {SENDER}: ")


def ensure_files() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not LEADS_CSV.exists():
        write_csv(LEADS_CSV, LEAD_FIELDS, [])
    if not SEND_LOG_CSV.exists():
        write_csv(SEND_LOG_CSV, LOG_FIELDS, [])


def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})


def normalize_email(email: str) -> str:
    return email.strip().lower()


def valid_email(email: str) -> bool:
    if not email or "*" in email or " " in email:
        return False
    return "@" in email and "." in email.split("@")[-1]


def upsert_leads(new_rows: list[dict[str, str]]) -> int:
    ensure_files()
    existing = read_csv(LEADS_CSV)
    by_email = {normalize_email(row["email"]): row for row in existing if valid_email(row.get("email", ""))}
    added = 0
    for row in new_rows:
        email = normalize_email(row.get("email", ""))
        if not valid_email(email):
            continue
        row = {**{field: "" for field in LEAD_FIELDS}, **row}
        row["email"] = row.get("email", "").strip()
        row["updated_at"] = now()
        if email in by_email:
            old = by_email[email]
            for key, value in row.items():
                if value and not old.get(key):
                    old[key] = value
            old["updated_at"] = now()
        else:
            row["created_at"] = row.get("created_at") or now()
            row["status"] = row.get("status") or "ready"
            by_email[email] = row
            added += 1
    write_csv(LEADS_CSV, LEAD_FIELDS, list(by_email.values()))
    return added


def init_db() -> None:
    ensure_files()
    added = upsert_leads(SEED_LEADS)
    seed_send_log()
    print(f"Initialized database. Added {added} seed rows.")


def seed_send_log() -> None:
    rows = read_csv(SEND_LOG_CSV)
    existing = {normalize_email(row.get("email", "")) for row in rows if row.get("result") == "sent"}
    changed = False
    for lead in SEED_LEADS:
        email = normalize_email(lead["email"])
        if lead.get("status") != "sent" or email in existing:
            continue
        rows.append({
            "sent_at": f"{date.today().isoformat()}T00:00:00",
            "email": lead["email"],
            "creator": lead.get("creator", ""),
            "subject": SUBJECT,
            "result": "sent",
            "error": "Backfilled from pre-pipeline sent batch",
        })
        changed = True
    if changed:
        write_csv(SEND_LOG_CSV, LOG_FIELDS, rows)


def run_discovery() -> None:
    scripts = [
        ROOT / "tools" / "creator_leads" / "scrape_public_creator_sources.py",
        ROOT / "tools" / "creator_leads" / "scrape_modash_public.py",
        ROOT / "tools" / "creator_leads" / "harvest_creatorfinder_global.py",
        ROOT / "tools" / "creator_leads" / "scrape_influencers_club.py",
    ]
    for script in scripts:
        print(f"Running {script.name}...")
        subprocess.run([sys.executable, str(script)], check=False)


def import_discovery_outputs() -> None:
    imports = [
        OUT_DIR / "public_source_scrape.csv",
        OUT_DIR / "modash_public_scrape.csv",
        OUT_DIR / "global_quick_leads.csv",
        OUT_DIR / "creatorfinder_global_harvest.csv",
        OUT_DIR / "influencers_club_scrape.csv",
    ]
    rows: list[dict[str, str]] = []
    for path in imports:
        for row in read_csv(path):
            rows.append({
                "email": row.get("email", ""),
                "creator": row.get("creator", ""),
                "category": row.get("category", ""),
                "handle": row.get("handle", ""),
                "followers": row.get("followers", ""),
                "location": "India" if "india" in row.get("source_url", "").lower() else "",
                "source_url": row.get("source_url", ""),
                "source_type": row.get("source_type", ""),
                "fit_score": "7",
                "status": "ready",
                "notes": row.get("snippet", "")[:250],
            })
    added = upsert_leads(rows)
    print(f"Imported discovery output. Added {added} new unique leads.")


def sent_today_count() -> int:
    today = date.today().isoformat()
    return sum(1 for row in read_csv(SEND_LOG_CSV) if row.get("sent_at", "").startswith(today) and row.get("result") == "sent")


def queue(limit: int) -> list[dict[str, str]]:
    rows = read_csv(LEADS_CSV)
    return [row for row in rows if row.get("status", "").lower() == "ready" and valid_email(row.get("email", ""))][:limit]


def tracking_id(lead: dict[str, str], message_type: str) -> str:
    raw = f"{normalize_email(lead.get('email', ''))}:{message_type}:{date.today().isoformat()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:20]


def tracked_url(lead: dict[str, str], target: str, message_type: str) -> str:
    identifier = tracking_id(lead, message_type)
    return f"{SITE_URL}/api/email-click?id={identifier}&to={target}"


def tracking_pixel(lead: dict[str, str], message_type: str) -> str:
    identifier = tracking_id(lead, message_type)
    return f"{SITE_URL}/api/email-open?id={identifier}"


def body_for(name: str, website_url: str) -> str:
    return f"""Hi {name},

Your audience is your biggest asset. Instead of depending only on Instagram, YouTube, or other social media platforms, you can have your own branded mobile app to connect with your followers and earn directly.

YOUR APP WILL BE AVAILABLE ON BOTH THE APP STORE AND PLAY STORE, under your own name and brand.

We will build the app under your name and brand, so your community and payments stay with you.

Inside the app, you can earn through:

Paid memberships
Premium videos, posts, and exclusive content
One-to-one video or chat sessions

Many creators already use similar apps to turn their audience into a direct income channel, without depending only on algorithms or brand deals.

I have attached a short deck with the concept.

If this feels useful for your community, would you be open to a 20-minute demo call this week? Happy to show how it can be customised for your niche.

Best regards,
TathyaForge (tathyaforge.in)
For inquiries: {INQUIRY_PHONE}
{website_url}

If this is not relevant, just reply no and we will not follow up.
"""


def html_body_for(name: str, website_url: str, pixel_url: str) -> str:
    return f"""\
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #e6ebf2;border-radius:14px;overflow:hidden;">
        <div style="background:#101828;color:#ffffff;padding:22px 24px;">
          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#a5b4fc;">TathyaForge Creator Apps</div>
          <div style="font-size:24px;font-weight:700;line-height:1.2;margin-top:8px;">Your own branded mobile app for your community</div>
        </div>
        <div style="padding:24px;">
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Hi {name},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Your audience is your biggest asset. Instead of depending only on Instagram, YouTube, or other social media platforms, you can have your own branded mobile app to connect with your followers and earn directly.</p>
          <div style="border:2px solid #2563eb;background:#eff6ff;border-radius:12px;padding:16px;margin:18px 0;text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#1d4ed8;">YOUR APP WILL BE AVAILABLE ON</div>
            <div style="margin-top:12px;">
              <span style="display:inline-block;background:#111827;color:#ffffff;border-radius:9px;padding:10px 14px;margin:4px;font-weight:700;">App Store</span>
              <span style="display:inline-block;background:#111827;color:#ffffff;border-radius:9px;padding:10px 14px;margin:4px;font-weight:700;">Play Store</span>
            </div>
            <div style="font-size:13px;color:#344054;margin-top:10px;">under your own name and brand</div>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 12px;">We will build the app under your name and brand, so your community and payments stay with you.</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:18px 0;">
            <div style="font-weight:700;margin-bottom:10px;">Inside the app, you can earn through:</div>
            <div style="font-size:15px;line-height:1.8;">
              <div>• Paid memberships</div>
              <div>• Premium videos, posts, and exclusive content</div>
              <div>• One-to-one video or chat sessions</div>
            </div>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Many creators already use similar apps to turn their audience into a direct income channel, without depending only on algorithms or brand deals.</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">I have attached a short deck with the concept.</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">If this feels useful for your community, would you be open to a 20-minute demo call this week? Happy to show how it can be customised for your niche.</p>
          <p style="margin:0 0 22px;"><a href="{website_url}" style="display:inline-block;background:#f59e0b;color:#ffffff;text-decoration:none;border-radius:9px;padding:12px 18px;font-weight:700;">See how we build →</a></p>
          <p style="font-size:15px;line-height:1.6;margin:0;">Best regards,<br><strong>TathyaForge</strong><br>For inquiries: <a href="tel:{INQUIRY_PHONE}" style="color:#1d4ed8;text-decoration:none;">{INQUIRY_PHONE}</a><br><a href="{website_url}" style="color:#1d4ed8;">tathyaforge.in</a></p>
          <p style="font-size:12px;color:#667085;margin-top:22px;">If this is not relevant, just reply no and we will not follow up.</p>
          <img src="{pixel_url}" width="1" height="1" alt="" style="display:block;border:0;width:1px;height:1px;">
        </div>
      </div>
    </div>
  </body>
</html>
"""


def build_message(lead: dict[str, str], attachment_bytes: bytes | None) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = formataddr((FROM_NAME, SENDER))
    msg["To"] = lead["email"]
    msg["Bcc"] = SENDER
    msg["Subject"] = SUBJECT
    msg["Reply-To"] = SENDER
    name = lead.get("creator") or "there"
    website_url = tracked_url(lead, "work", "initial")
    msg.set_content(body_for(name, website_url))
    msg.add_alternative(
        html_body_for(name, website_url, tracking_pixel(lead, "initial")),
        subtype="html",
    )
    if attachment_bytes:
        ctype, encoding = mimetypes.guess_type(str(ATTACHMENT))
        if ctype is None or encoding is not None:
            ctype = "application/octet-stream"
        maintype, subtype = ctype.split("/", 1)
        msg.add_attachment(attachment_bytes, maintype=maintype, subtype=subtype, filename=ATTACHMENT.name)
    return msg


def followup_body_for(name: str, website_url: str) -> str:
    return f"""Hi {name},

Just following up on my earlier email about building your own branded creator app.

The key idea is simple: your app can be available on both the App Store and Play Store, under your own name and brand, so your audience can buy memberships, premium content, videos, posts, and one-to-one sessions directly from you.

Would a quick 20-minute demo this week be useful?

Best regards,
TathyaForge (tathyaforge.in)
For inquiries: {INQUIRY_PHONE}
{website_url}

If this is not relevant, just reply no and we will not follow up.
"""


def followup_html_body_for(name: str, website_url: str, pixel_url: str) -> str:
    return f"""\
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="max-width:620px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #e6ebf2;border-radius:14px;overflow:hidden;">
        <div style="padding:22px 24px;">
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Hi {name},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Just following up on my earlier email about building your own branded creator app.</p>
          <div style="border:2px solid #2563eb;background:#eff6ff;border-radius:12px;padding:16px;margin:18px 0;text-align:center;">
            <div style="font-size:17px;font-weight:800;color:#1d4ed8;">YOUR APP CAN BE AVAILABLE ON</div>
            <div style="margin-top:12px;">
              <span style="display:inline-block;background:#111827;color:#ffffff;border-radius:9px;padding:10px 14px;margin:4px;font-weight:700;">App Store</span>
              <span style="display:inline-block;background:#111827;color:#ffffff;border-radius:9px;padding:10px 14px;margin:4px;font-weight:700;">Play Store</span>
            </div>
            <div style="font-size:13px;color:#344054;margin-top:10px;">under your own name and brand</div>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Your audience can buy memberships, premium content, videos, posts, and one-to-one sessions directly from you.</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">Would a quick 20-minute demo this week be useful?</p>
          <p style="margin:0 0 22px;"><a href="{website_url}" style="display:inline-block;background:#f59e0b;color:#ffffff;text-decoration:none;border-radius:9px;padding:12px 18px;font-weight:700;">Review the concept →</a></p>
          <p style="font-size:15px;line-height:1.6;margin:0;">Best regards,<br><strong>TathyaForge</strong><br>For inquiries: <a href="tel:{INQUIRY_PHONE}" style="color:#1d4ed8;text-decoration:none;">{INQUIRY_PHONE}</a><br><a href="{website_url}" style="color:#1d4ed8;">tathyaforge.in</a></p>
          <p style="font-size:12px;color:#667085;margin-top:22px;">If this is not relevant, just reply no and we will not follow up.</p>
          <img src="{pixel_url}" width="1" height="1" alt="" style="display:block;border:0;width:1px;height:1px;">
        </div>
      </div>
    </div>
  </body>
</html>
"""


def build_followup_message(lead: dict[str, str]) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = formataddr((FROM_NAME, SENDER))
    msg["To"] = lead["email"]
    msg["Bcc"] = SENDER
    msg["Subject"] = FOLLOWUP_SUBJECT
    msg["Reply-To"] = SENDER
    name = lead.get("creator") or "there"
    website_url = tracked_url(lead, "work", "followup")
    msg.set_content(followup_body_for(name, website_url))
    msg.add_alternative(
        followup_html_body_for(name, website_url, tracking_pixel(lead, "followup")),
        subtype="html",
    )
    return msg


def update_lead_status(email: str, status: str, note: str = "") -> None:
    rows = read_csv(LEADS_CSV)
    for row in rows:
        if normalize_email(row.get("email", "")) == normalize_email(email):
            row["status"] = status
            if note:
                row["notes"] = (row.get("notes", "") + " " + note).strip()
            row["updated_at"] = now()
            break
    write_csv(LEADS_CSV, LEAD_FIELDS, rows)


def append_log(lead: dict[str, str], result: str, error: str = "") -> None:
    rows = read_csv(SEND_LOG_CSV)
    rows.append({
        "sent_at": now(),
        "email": lead.get("email", ""),
        "creator": lead.get("creator", ""),
        "subject": SUBJECT,
        "result": result,
        "error": error,
    })
    write_csv(SEND_LOG_CSV, LOG_FIELDS, rows)


def sent_log_for_date(sent_date: str) -> list[dict[str, str]]:
    return [
        row
        for row in read_csv(SEND_LOG_CSV)
        if row.get("sent_at", "").startswith(sent_date) and row.get("result") == "sent"
    ]


def followed_emails_for_date(sent_date: str) -> set[str]:
    marker = f"followup:{sent_date}:"
    return {
        normalize_email(row.get("email", ""))
        for row in read_csv(SEND_LOG_CSV)
        if row.get("result") == "followup_sent" and row.get("error", "").startswith(marker)
    }


def followup_queue(sent_date: str, min_age_days: int, limit: int) -> list[dict[str, str]]:
    target_date = datetime.strptime(sent_date, "%Y-%m-%d").date()
    if date.today() < target_date + timedelta(days=min_age_days):
        return []
    leads_by_email = {normalize_email(row.get("email", "")): row for row in read_csv(LEADS_CSV)}
    already_followed = followed_emails_for_date(sent_date)
    leads = []
    for log in sent_log_for_date(sent_date):
        email = normalize_email(log.get("email", ""))
        if not email or email in already_followed:
            continue
        lead = leads_by_email.get(email, {"email": log.get("email", ""), "creator": log.get("creator", "")})
        leads.append(lead)
        if len(leads) >= limit:
            break
    return leads


def send_followups(sent_date: str, min_age_days: int, limit: int, dry_run: bool) -> None:
    leads = followup_queue(sent_date, min_age_days, limit)
    print(f"Follow-up queue for {sent_date}: {len(leads)}")
    if not leads:
        target_date = datetime.strptime(sent_date, "%Y-%m-%d").date()
        eligible_date = target_date + timedelta(days=min_age_days)
        print(f"No eligible follow-ups. Earliest eligible date with min age {min_age_days}: {eligible_date.isoformat()}")
        return
    if dry_run:
        for lead in leads:
            print(f"DRY_RUN_FOLLOWUP {lead['email']} | {lead.get('creator', '')}")
        return
    password = smtp_password()
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=30) as smtp:
        smtp.login(SENDER, password)
        for lead in leads:
            try:
                smtp.send_message(build_followup_message(lead))
                print(f"FOLLOWUP_SENT {lead['email']}")
                append_log(lead, "followup_sent", f"followup:{sent_date}:{date.today().isoformat()}")
                time.sleep(5)
            except Exception as exc:
                error = str(exc)
                print(f"FOLLOWUP_FAILED {lead['email']}: {error}")
                append_log(lead, "followup_failed", error)


def send_daily(limit: int, dry_run: bool, daily_cap: int = DAILY_LIMIT) -> None:
    ensure_files()
    already = sent_today_count()
    remaining = max(0, daily_cap - already)
    limit = min(limit, remaining)
    if limit <= 0:
        print(f"Daily cap reached: {already}/{daily_cap} sent today.")
        return
    leads = queue(limit)
    print(f"Ready queue: {len(queue(10000))}. Sending now: {len(leads)}. Daily used: {already}/{daily_cap}.")
    if dry_run:
        for lead in leads:
            print(f"DRY_RUN {lead['email']} | {lead.get('creator', '')}")
        return
    if not leads:
        print("No ready leads. Run discovery/import or add leads to creator_leads_master.csv.")
        return
    if not ATTACHMENT.exists():
        raise FileNotFoundError(f"Required deck attachment not found: {ATTACHMENT}")
    attachment_bytes = ATTACHMENT.read_bytes()
    password = smtp_password()
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=30) as smtp:
        smtp.login(SENDER, password)
        for lead in leads:
            try:
                smtp.send_message(build_message(lead, attachment_bytes))
                print(f"SENT {lead['email']}")
                update_lead_status(lead["email"], "sent", f"Sent {date.today().isoformat()}.")
                append_log(lead, "sent")
                time.sleep(5)
            except Exception as exc:
                error = str(exc)
                print(f"FAILED {lead['email']}: {error}")
                update_lead_status(lead["email"], "failed", error[:200])
                append_log(lead, "failed", error)


def status(daily_cap: int = DAILY_LIMIT) -> None:
    ensure_files()
    leads = read_csv(LEADS_CSV)
    total = len(leads)
    ready = sum(1 for row in leads if row.get("status") == "ready")
    sent = sum(1 for row in leads if row.get("status") == "sent")
    failed = sum(1 for row in leads if row.get("status") == "failed")
    today_sent = sent_today_count()
    print(f"Lead database: {total}/{TARGET_LEADS}")
    print(f"Ready: {ready} | Sent: {sent} | Failed: {failed}")
    print(f"Today sent: {today_sent}/{daily_cap}")
    print(f"Master CSV: {LEADS_CSV}")
    print(f"Send log: {SEND_LOG_CSV}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Morning creator outreach pipeline")
    parser.add_argument("command", choices=["init", "discover", "import", "morning", "send", "queue", "status", "followup"])
    parser.add_argument("--limit", type=int, default=DAILY_LIMIT)
    parser.add_argument("--daily-cap", type=int, default=DAILY_LIMIT)
    parser.add_argument("--sent-date", default=date.today().isoformat())
    parser.add_argument("--min-age-days", type=int, default=2)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.command == "init":
        init_db()
    elif args.command == "discover":
        run_discovery()
    elif args.command == "import":
        import_discovery_outputs()
    elif args.command == "morning":
        init_db()
        run_discovery()
        import_discovery_outputs()
        status(args.daily_cap)
        send_daily(args.limit, args.dry_run, args.daily_cap)
    elif args.command == "send":
        send_daily(args.limit, args.dry_run, args.daily_cap)
    elif args.command == "queue":
        for lead in queue(args.limit):
            print(f"{lead['email']} | {lead.get('creator', '')} | {lead.get('category', '')}")
    elif args.command == "status":
        status(args.daily_cap)
    elif args.command == "followup":
        send_followups(args.sent_date, args.min_age_days, args.limit, args.dry_run)


if __name__ == "__main__":
    main()
