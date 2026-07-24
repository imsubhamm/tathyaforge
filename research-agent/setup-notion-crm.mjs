import { readFileSync, writeFileSync } from "node:fs";

const token = process.env.NOTION_TOKEN;
const rawParent = (process.argv[2] || process.env.NOTION_PARENT_PAGE_ID || "").trim();

if (!token) {
  console.log(JSON.stringify({ ok: false, need: "NOTION_TOKEN in .env" }, null, 2));
  process.exit(2);
}

if (!rawParent) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        need: "Share any Notion page with the tathya integration, then run with that page URL or ID",
        example: "node --env-file=.env research-agent/setup-notion-crm.mjs https://www.notion.so/Your-Page-....",
        integrationName: "tathya",
      },
      null,
      2,
    ),
  );
  process.exit(2);
}

function extractPageId(input) {
  const fromUrl = input.match(/([a-f0-9]{32})/i)?.[1];
  const compact = (fromUrl || input.replace(/-/g, "")).toLowerCase();
  if (!/^[a-f0-9]{32}$/.test(compact)) {
    throw new Error("Could not parse a Notion page ID from the input");
  }
  return compact.replace(/^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/, "$1-$2-$3-$4-$5");
}

const parentPageId = extractPageId(rawParent);
const headers = {
  Authorization: `Bearer ${token}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

const props = {
  Name: { title: {} },
  Stage: {
    select: {
      options: ["new", "researching", "ready", "contacted", "meeting", "proposal", "won", "lost"].map(
        (name) => ({ name }),
      ),
    },
  },
  Priority: { select: { options: [{ name: "P1" }, { name: "P2" }, { name: "P3" }] } },
  City: { rich_text: {} },
  Industry: { rich_text: {} },
  Problem: { rich_text: {} },
  Solution: { rich_text: {} },
  Contact: { rich_text: {} },
  Email: { email: {} },
  Phone: { phone_number: {} },
  BudgetLow: { number: { format: "number" } },
  BudgetHigh: { number: { format: "number" } },
  Score: { number: { format: "number" } },
  DemoStatus: {
    select: {
      options: ["needed", "concept_ready", "prototype_ready", "shared"].map((name) => ({ name })),
    },
  },
  SourceUrl: { url: {} },
  Notes: { rich_text: {} },
  NextAction: { rich_text: {} },
  NextActionAt: { date: {} },
  TathyaRunDate: { rich_text: {} },
};

const res = await fetch("https://api.notion.com/v1/databases", {
  method: "POST",
  headers,
  body: JSON.stringify({
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: "TathyaForge Opportunities" } }],
    properties: props,
  }),
});
const json = await res.json();
if (!res.ok) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        status: res.status,
        code: json.code,
        message: json.message,
        hint: "Open the page in Notion → ••• → Connections → connect tathya, then retry",
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const databaseId = json.id;
let envText = readFileSync(".env", "utf8");
const line = `NOTION_DATABASE_ID=${databaseId}`;
envText = /^NOTION_DATABASE_ID=.*$/m.test(envText)
  ? envText.replace(/^NOTION_DATABASE_ID=.*$/m, line)
  : `${envText.trimEnd()}\n${line}\n`;
writeFileSync(".env", envText.endsWith("\n") ? envText : `${envText}\n`);

const metaPath = "research-agent/data/crm-meta.json";
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
meta.notionDatabaseId = databaseId;
meta.notionParentPageId = parentPageId;
meta.updatedAt = new Date().toISOString();
writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      ok: true,
      databaseIdSuffix: databaseId.slice(-8),
      url: json.url || null,
    },
    null,
    2,
  ),
);
