# TathyaForge Daily Opportunity Research

This folder contains the persistent configuration and deduplication database for
the daily business-opportunity research workflow.

## Daily outcome

- Find 20 qualified businesses within 400 km of postal code 713359, India.
- Use only public business information and public professional contact details.
- Record evidence URLs for every important claim.
- Estimate a budget range with reasoning and a confidence score; never present it
  as a known private budget.
- Rank leads P1–P3 and reject weak or sub-threshold opportunities.
- Create a suitable demo for the best five leads.
- Save a verified Excel/CSV report and demos under `runs/YYYY-MM-DD/`.
- Send the internal report from `hellow@tathyaforge.in` to
  `imsubhamrk@outlook.com`.
- Never contact prospects automatically.

## Hybrid sales loop

1. Research lands in `/opportunities`.
2. Select a lead → **Push to Notion** (CRM) and/or **Create demo task** (Linear).
3. Build/open the private prototype at `/opportunities/demos/[slug]` (key-gated).
4. **Draft outreach** (email + WhatsApp). You copy and send — no auto-blast.
5. Track stage/owner/next action in the command center; Notion is the CRM board.

Linear project: **Opportunity Demos** (team `Tathyaforge`), labels `demo`,
`outreach`, `follow-up`.

Notion setup: see `NOTION_CRM.md`. Without Notion/Linear API tokens, push
actions queue into `data/outbound-queue.json`.

## Runtime secrets

The mail account is hosted on Hostinger SMTP. The scheduled environment needs:

```text
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hellow@tathyaforge.in
SMTP_PASSWORD=<mailbox password or app password>
```

If Google Places is used, also configure:

```text
GOOGLE_MAPS_API_KEY=<restricted API key>
```

Secrets must not be committed to Git.

## Local setup

```bash
node research-agent/init-db.mjs
```

The database is created at `research-agent/data/research.sqlite`. Generated run
artifacts and the database are local operating data and should remain untracked.
