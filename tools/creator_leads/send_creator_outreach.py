import getpass
import smtplib
import ssl
import time
from email.message import EmailMessage
from email.utils import formataddr

SMTP_HOST = "smtp.hostinger.com"
SMTP_PORT = 465
SENDER = "hellow@tathyaforge.in"
FROM_NAME = "TathyaForge"
SUBJECT = "Your own branded app for premium content"

CONTACTS = [
    ("Wanitha Ashok", "wanithaashok@gmail.com"),
    ("Mansi Nautiyal Mehta", "mansinautiyalmehta@gmail.com"),
    ("Build Fast with AI", "hello@buildfastwithai.com"),
    ("Tech Community", "technicalvivek3853@gmail.com"),
    ("Crypto Shyam", "cryptoshyamcs@gmail.com"),
    ("Dr Trupti Jayin", "drtruptijayin@gmail.com"),
    ("AiR - Atman in Ravi", "air@air.ind.in"),
    ("Richa Jindal", "contact@richajindal.in"),
    ("Hansvi Tonk", "hansvitonk6@gmail.com"),
]


def body_for(name: str) -> str:
    return f"""Hi {name},

Your audience is your biggest asset. Instead of depending only on Instagram, YouTube, or other social media platforms, you can have your own branded mobile app to connect with your followers and earn directly.

We will build the app under your name and brand, so your community and payments stay with you.

Inside the app, you can earn through:

Paid memberships
Premium videos, posts, and exclusive content
One-to-one video or chat sessions

Many Indian creators already use similar apps to turn their audience into a direct income channel, without depending only on algorithms or brand deals.

If this feels useful for your community, would you be open to a 20-minute demo call this week? Happy to show how it can be customised for your niche.

Best regards,
TathyaForge
For inquiries: +919614041877
tathyaforge.in

If this is not relevant, just reply no and we will not follow up.
"""


def build_message(name: str, recipient: str) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = formataddr((FROM_NAME, SENDER))
    msg["To"] = recipient
    msg["Subject"] = SUBJECT
    msg["Reply-To"] = SENDER
    msg.set_content(body_for(name))
    return msg


def main() -> None:
    password = getpass.getpass(f"Password for {SENDER}: ")
    context = ssl.create_default_context()
    sent = []
    failed = []
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=30) as smtp:
        smtp.login(SENDER, password)
        for name, recipient in CONTACTS:
            try:
                smtp.send_message(build_message(name, recipient))
                sent.append((name, recipient))
                print(f"SENT {recipient}")
                time.sleep(3)
            except Exception as exc:
                failed.append((name, recipient, str(exc)))
                print(f"FAILED {recipient}: {exc}")
    print(f"SUMMARY sent={len(sent)} failed={len(failed)}")
    if failed:
        for _, recipient, error in failed:
            print(f"FAILED_DETAIL {recipient}: {error}")


if __name__ == "__main__":
    main()
