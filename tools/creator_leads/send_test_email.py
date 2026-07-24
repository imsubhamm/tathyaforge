import getpass
import mimetypes
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

SMTP_HOST = "smtp.hostinger.com"
SMTP_PORT = 465
SENDER = "hellow@tathyaforge.in"
FROM_NAME = "TathyaForge"
RECIPIENT = "subhammondal551@gmail.com"
SUBJECT = "Test: Your own branded app on App Store and Play Store"
ATTACHMENT = Path("/Users/imsub/Downloads/TathyaForge_Creator_App_Deck.pdf")


def text_body() -> str:
    return """Hi Subham,

This is a test email for the TathyaForge creator app outreach template.

YOUR APP WILL BE AVAILABLE ON BOTH THE APP STORE AND PLAY STORE, under your own name and brand.

Inside the app, creators can earn through:

Paid memberships
Premium videos, posts, and exclusive content
One-to-one video or chat sessions

The deck is attached.

Best regards,
TathyaForge
For inquiries: +919614041877
tathyaforge.in
"""


def html_body() -> str:
    return """<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #e6ebf2;border-radius:14px;overflow:hidden;">
        <div style="background:#101828;color:#ffffff;padding:22px 24px;">
          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#a5b4fc;">TathyaForge Creator Apps</div>
          <div style="font-size:24px;font-weight:700;line-height:1.2;margin-top:8px;">Your own branded mobile app for your community</div>
        </div>
        <div style="padding:24px;">
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Hi Subham,</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">This is a test email for the TathyaForge creator app outreach template.</p>
          <div style="border:2px solid #2563eb;background:#eff6ff;border-radius:12px;padding:16px;margin:18px 0;text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#1d4ed8;">YOUR APP WILL BE AVAILABLE ON</div>
            <div style="margin-top:12px;">
              <span style="display:inline-block;background:#111827;color:#ffffff;border-radius:9px;padding:10px 14px;margin:4px;font-weight:700;">App Store</span>
              <span style="display:inline-block;background:#111827;color:#ffffff;border-radius:9px;padding:10px 14px;margin:4px;font-weight:700;">Play Store</span>
            </div>
            <div style="font-size:13px;color:#344054;margin-top:10px;">under your own name and brand</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:18px 0;">
            <div style="font-weight:700;margin-bottom:10px;">Inside the app, creators can earn through:</div>
            <div style="font-size:15px;line-height:1.8;">
              <div>• Paid memberships</div>
              <div>• Premium videos, posts, and exclusive content</div>
              <div>• One-to-one video or chat sessions</div>
            </div>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">The deck is attached.</p>
          <p style="font-size:15px;line-height:1.6;margin:0;">Best regards,<br><strong>TathyaForge</strong><br>For inquiries: <a href="tel:+919614041877" style="color:#1d4ed8;text-decoration:none;">+919614041877</a><br>tathyaforge.in</p>
        </div>
      </div>
    </div>
  </body>
</html>
"""


def main() -> None:
    password = getpass.getpass(f"Password for {SENDER}: ")
    msg = EmailMessage()
    msg["From"] = formataddr((FROM_NAME, SENDER))
    msg["To"] = RECIPIENT
    msg["Bcc"] = SENDER
    msg["Subject"] = SUBJECT
    msg["Reply-To"] = SENDER
    msg.set_content(text_body())
    msg.add_alternative(html_body(), subtype="html")

    if ATTACHMENT.exists():
        data = ATTACHMENT.read_bytes()
        ctype, encoding = mimetypes.guess_type(str(ATTACHMENT))
        if ctype is None or encoding is not None:
            ctype = "application/octet-stream"
        maintype, subtype = ctype.split("/", 1)
        msg.add_attachment(data, maintype=maintype, subtype=subtype, filename=ATTACHMENT.name)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=30) as smtp:
        smtp.login(SENDER, password)
        smtp.send_message(msg)
    print(f"SENT {RECIPIENT}")


if __name__ == "__main__":
    main()
