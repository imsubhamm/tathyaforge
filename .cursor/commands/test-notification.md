# Test the internal research notification

1. Confirm `.env` exists without displaying its contents.
2. Run `npm run research:verify`.
3. Select the newest run's summary and report attachments.
4. Run `npm run research:send -- <attachments>`.
5. Confirm the message was sent from `hellow@tathyaforge.in` to
   `imsubhamrk@outlook.com`.

Never display SMTP credentials. This command authorizes only an internal test
message, never prospect outreach.
