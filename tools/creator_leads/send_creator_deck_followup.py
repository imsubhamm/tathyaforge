import getpass
import mimetypes
import smtplib
import ssl
import time
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

SMTP_HOST = "smtp.hostinger.com"
SMTP_PORT = 465
SENDER = "hellow@tathyaforge.in"
FROM_NAME = "TathyaForge"
SUBJECT = "TathyaForge creator app deck"
ATTACHMENT = Path("/Users/imsub/Downloads/TathyaForge_Creator_App_Deck.pdf")

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
    ("Tech With Yeshwanth", "techwithyeshwanth@gmail.com"),
    ("Real Estate Tv", "anrmedia2020@gmail.com"),
    ("Financial pandit", "financialpandit4@gmail.com"),
    ("Financial Trader", "surajslamoutloud@gmail.com"),
    ("Crypto Universe", "Techflexiworks@gmail.com"),
    ("Grow Crypto", "mail2digitaldrishti@gmail.com"),
    ("Crypto Miners India", "Support@cryptominersind.in"),
    ("Dubey Loan Credit Card Finance Help", "Pradeepdubey963816@gmail.com"),
    ("Grow Business Finance Hub", "vikashmishra.business@gmail.com"),
    ("Finance With Sunil", "deals.sunilgurjar@gmail.com"),
    ("Art Of Finance", "thesuccessgate@gmail.com"),
]


def body_for(name: str) -> str:
    return f"""Hi {name},

Sharing a short deck about the branded creator app idea I mentioned.

The concept is simple: your own app under your name and brand, where your audience can access paid memberships, premium content, videos, posts, and one-to-one video or chat sessions.

If this feels useful for your community, would you be open to a 20-minute demo call this week?

Best regards,
TathyaForge
For inquiries: +919614041877
tathyaforge.in

If this is not relevant, just reply no and we will not follow up.
"""


def build_message(name: str, recipient: str, attachment_bytes: bytes) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = formataddr((FROM_NAME, SENDER))
    msg["To"] = recipient
    msg["Bcc"] = SENDER
    msg["Subject"] = SUBJECT
    msg["Reply-To"] = SENDER
    msg.set_content(body_for(name))

    ctype, encoding = mimetypes.guess_type(str(ATTACHMENT))
    if ctype is None or encoding is not None:
        ctype = "application/octet-stream"
    maintype, subtype = ctype.split("/", 1)
    msg.add_attachment(
        attachment_bytes,
        maintype=maintype,
        subtype=subtype,
        filename=ATTACHMENT.name,
    )
    return msg


def main() -> None:
    if not ATTACHMENT.exists():
        raise FileNotFoundError(f"Attachment not found: {ATTACHMENT}")
    attachment_bytes = ATTACHMENT.read_bytes()
    password = getpass.getpass(f"Password for {SENDER}: ")
    context = ssl.create_default_context()
    sent = []
    failed = []
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=30) as smtp:
        smtp.login(SENDER, password)
        for name, recipient in CONTACTS:
            try:
                smtp.send_message(build_message(name, recipient, attachment_bytes))
                sent.append((name, recipient))
                print(f"SENT {recipient}")
                time.sleep(5)
            except Exception as exc:
                failed.append((name, recipient, str(exc)))
                print(f"FAILED {recipient}: {exc}")
    print(f"SUMMARY sent={len(sent)} failed={len(failed)}")
    for _, recipient, error in failed:
        print(f"FAILED_DETAIL {recipient}: {error}")


if __name__ == "__main__":
    main()
