# TathyaForge Creator Outreach Pipeline

Daily cap: 30 emails/day.
Lead target: 1000 qualified creator leads.

## Morning Command

Run this when you want to start the daily workflow:

```bash
python3 /Volumes/Flash/ReelCreator/tathya/tools/creator_leads/morning_pipeline.py morning
```

What it does:

1. Initializes the lead database if needed.
2. Runs public lead discovery scripts.
3. Imports new real-email leads.
4. Shows the database status.
5. Sends only up to the remaining daily quota.

The script prompts for the Hostinger mailbox password and does not save it.

## Safe Preview

Use this first if you want to see who would be emailed without sending:

```bash
python3 /Volumes/Flash/ReelCreator/tathya/tools/creator_leads/morning_pipeline.py morning --dry-run
```

## Check Status

```bash
python3 /Volumes/Flash/ReelCreator/tathya/tools/creator_leads/morning_pipeline.py status
```

## See Today's Queue

```bash
python3 /Volumes/Flash/ReelCreator/tathya/tools/creator_leads/morning_pipeline.py queue --limit 30
```

## Send Only

Use this if leads were already imported and you only want to send:

```bash
python3 /Volumes/Flash/ReelCreator/tathya/tools/creator_leads/morning_pipeline.py send --limit 30
```

## Files

- Master lead database: `/Volumes/Flash/ReelCreator/tathya/tools/creator_leads/data/creator_leads_master.csv`
- Send log: `/Volumes/Flash/ReelCreator/tathya/tools/creator_leads/data/send_log.csv`
- Deck attachment: `/Users/imsub/Downloads/TathyaForge_Creator_App_Deck.pdf`

## Email Positioning

The email includes this highlighted line:

`YOUR APP WILL BE AVAILABLE ON BOTH THE APP STORE AND PLAY STORE, under your own name and brand.`

Signature includes the inquiry number:

`For inquiries: +919614041877`

It also BCCs `hellow@tathyaforge.in` so sent copies can be checked even when Hostinger webmail does not show SMTP-sent messages in the Sent folder.

## Scheduled GitHub Action

Workflow: `.github/workflows/creator-outreach.yml`

- Runs daily at 08:00 IST (`30 2 * * *` UTC)
- Calls the same command: `python3 tools/creator_leads/morning_pipeline.py morning`
- Uses the same template from `morning_pipeline.py` (including the inquiry number)
- Needs repository secret `HOSTINGER_SMTP_PASSWORD`
- Persists `tools/creator_leads/data/` (lead CSV, send log, deck) via Actions cache

Manual run: GitHub → Actions → **Creator outreach morning pipeline** → Run workflow

