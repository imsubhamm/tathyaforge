# TathyaForge Opportunity CRM — Notion database setup

## Status

- Integration name: **tathya**
- Token goes in `.env` as `NOTION_TOKEN`
- Notion internal integrations cannot create a workspace-root page/database
  until at least one page is shared with them

## One remaining step

1. In Notion, open or create any page (example: `TathyaForge Sales HQ`).
2. Click **••• → Connections → Connect to → tathya**.
3. Paste that page URL in chat, or run:

```bash
node --env-file=.env research-agent/setup-notion-crm.mjs 'https://www.notion.so/your-page-....'
```

That script creates **TathyaForge Opportunities** with the properties below and
writes `NOTION_DATABASE_ID` into `.env`.

## Database properties

| Property | Type | Notes |
|---|---|---|
| Name | Title | Business name |
| Stage | Select | new, researching, ready, contacted, meeting, proposal, won, lost |
| Priority | Select | P1, P2, P3 |
| City | Rich text | |
| Industry | Rich text | |
| Problem | Rich text | |
| Solution | Rich text | |
| Contact | Rich text | |
| Email | Email | |
| Phone | Phone | |
| BudgetLow | Number | INR |
| BudgetHigh | Number | INR |
| Score | Number | 0–100 |
| DemoStatus | Select | needed, concept_ready, prototype_ready, shared |
| SourceUrl | URL | |
| Notes | Rich text | |
| NextAction | Rich text | optional |
| NextActionAt | Date | optional |
| TathyaRunDate | Rich text | optional |

Until `NOTION_DATABASE_ID` is set, **Push to Notion** queues payloads in
`research-agent/data/outbound-queue.json`.
