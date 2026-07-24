import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type OpportunityStatus =
  | "new"
  | "researching"
  | "ready"
  | "contacted"
  | "meeting"
  | "proposal"
  | "won"
  | "lost";

export type OpportunityLead = {
  business: string;
  city?: string;
  state?: string;
  industry?: string;
  problem?: string;
  currentSolution?: string;
  solution?: string;
  contact?: string;
  email?: string;
  phone?: string;
  budgetLow?: number;
  budgetHigh?: number;
  budgetReason?: string;
  confidence?: number;
  score?: number;
  priority?: "P1" | "P2" | "P3";
  conversionReason?: string;
  demoType?: string;
  demo?: string;
  demoPath?: string;
  sourceUrl?: string;
  sourceClaim?: string;
  distanceKmEstimate?: number;
  pipeline?: {
    status?: OpportunityStatus;
    owner?: string;
    nextAction?: string;
    nextActionAt?: string;
    notes?: string;
    notionPageId?: string;
    notionUrl?: string;
    linearIssueId?: string;
    linearIssueUrl?: string;
    demoSlug?: string;
    updatedAt?: string;
  };
};

export type OutreachDraft = {
  emailSubject: string;
  emailBody: string;
  whatsapp: string;
  meetingHint: string;
};

export type SyncQueueItem = {
  id: string;
  createdAt: string;
  action: "notion_push" | "linear_demo";
  business: string;
  payload: Record<string, unknown>;
  status: "queued" | "sent" | "failed";
  result?: string;
};

const dataDirectory = path.join(process.cwd(), "research-agent", "data");
const queuePath = path.join(dataDirectory, "outbound-queue.json");
const metaPath = path.join(dataDirectory, "crm-meta.json");

export function slugifyBusiness(business: string) {
  return business
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function buildOutreachDraft(lead: OpportunityLead, siteUrl?: string): OutreachDraft {
  const firstName = (lead.contact || "there").split(/[,(/]/)[0]?.trim() || "there";
  const company = lead.business;
  const solution = lead.solution || "a focused operations improvement";
  const booking = siteUrl ? `${siteUrl.replace(/\/$/, "")}/contact` : "https://tathyaforge.in/contact";

  const emailSubject = `${company}: a private concept for ${lead.industry || "your operations"}`;
  const emailBody = [
    `Hi ${firstName},`,
    "",
    `I reviewed ${company}'s public customer journey and noticed: ${lead.problem || "a clear operational friction point"}.`,
    "",
    `Today that looks like: ${lead.currentSolution || "manual coordination across phone/email"}.`,
    "",
    `I prepared a private concept for ${solution}—not a public site, just a walkthrough of one concrete flow.`,
    "",
    "Would a 15-minute call this week be useful? If yes, reply here or book a slot:",
    booking,
    "",
    "Best,",
    "Subham",
    "TathyaForge",
  ].join("\n");

  const whatsapp = [
    `Hi ${firstName}, quick note from TathyaForge.`,
    `Looked at ${company}'s public flow — ${lead.problem || "there is a clear ops bottleneck"}.`,
    `I have a private concept for: ${solution}.`,
    `Open to a 15-min walkthrough? ${booking}`,
  ].join(" ");

  return {
    emailSubject,
    emailBody,
    whatsapp,
    meetingHint: booking,
  };
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function enqueueSync(item: Omit<SyncQueueItem, "id" | "createdAt" | "status">) {
  const queue = await readJsonFile<SyncQueueItem[]>(queuePath, []);
  const entry: SyncQueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "queued",
    ...item,
  };
  queue.unshift(entry);
  await writeJsonFile(queuePath, queue.slice(0, 500));
  return entry;
}

export async function markQueueItem(id: string, status: SyncQueueItem["status"], result?: string) {
  const queue = await readJsonFile<SyncQueueItem[]>(queuePath, []);
  const next = queue.map((item) => (item.id === id ? { ...item, status, result } : item));
  await writeJsonFile(queuePath, next);
}

export type CrmMeta = {
  notionDatabaseId?: string;
  linearTeamId?: string;
  linearTeamName?: string;
  linearProjectId?: string;
  linearProjectName?: string;
  updatedAt?: string;
};

export async function readCrmMeta() {
  return readJsonFile<CrmMeta>(metaPath, {});
}

export async function writeCrmMeta(update: CrmMeta) {
  const current = await readCrmMeta();
  const next = { ...current, ...update, updatedAt: new Date().toISOString() };
  await writeJsonFile(metaPath, next);
  return next;
}

export function integrationStatus() {
  return {
    notionConfigured: Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID),
    linearConfigured: Boolean(process.env.LINEAR_API_KEY),
    placesCoverage: Boolean(process.env.GOOGLE_MAPS_API_KEY),
  };
}

export async function pushLeadToNotion(lead: OpportunityLead) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    const queued = await enqueueSync({
      action: "notion_push",
      business: lead.business,
      payload: {
        name: lead.business,
        stage: lead.pipeline?.status || "new",
        priority: lead.priority || "P2",
        city: lead.city || "",
        industry: lead.industry || "",
        problem: lead.problem || "",
        solution: lead.solution || "",
        contact: lead.contact || "",
        email: lead.email || "",
        phone: lead.phone || "",
        budgetLow: lead.budgetLow || 0,
        budgetHigh: lead.budgetHigh || 0,
        score: lead.score || 0,
        sourceUrl: lead.sourceUrl || "",
        demoStatus: lead.demo ? "concept_ready" : "needed",
        notes: lead.pipeline?.notes || "",
      },
    });
    return { mode: "queued" as const, queueId: queued.id, message: "Notion token/database not configured. Lead queued locally for sync." };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: lead.business } }] },
        Stage: { select: { name: lead.pipeline?.status || "new" } },
        Priority: { select: { name: lead.priority || "P2" } },
        City: { rich_text: [{ text: { content: lead.city || "" } }] },
        Industry: { rich_text: [{ text: { content: lead.industry || "" } }] },
        Problem: { rich_text: [{ text: { content: (lead.problem || "").slice(0, 1800) } }] },
        Solution: { rich_text: [{ text: { content: (lead.solution || "").slice(0, 1800) } }] },
        Contact: { rich_text: [{ text: { content: lead.contact || "" } }] },
        Email: lead.email ? { email: lead.email } : { email: null },
        Phone: { phone_number: lead.phone || null },
        BudgetLow: { number: lead.budgetLow || null },
        BudgetHigh: { number: lead.budgetHigh || null },
        Score: { number: lead.score || null },
        DemoStatus: { select: { name: lead.demo ? "concept_ready" : "needed" } },
        SourceUrl: lead.sourceUrl ? { url: lead.sourceUrl } : { url: null },
        Notes: { rich_text: [{ text: { content: (lead.pipeline?.notes || "").slice(0, 1800) } }] },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion push failed: ${response.status} ${text.slice(0, 300)}`);
  }

  const page = (await response.json()) as { id: string; url?: string };
  return { mode: "sent" as const, pageId: page.id, url: page.url };
}

export async function createLinearDemoIssue(lead: OpportunityLead) {
  const apiKey = process.env.LINEAR_API_KEY;
  const meta = await readCrmMeta();
  const teamId = process.env.LINEAR_TEAM_ID || meta.linearTeamId;
  const teamName = process.env.LINEAR_TEAM_NAME || meta.linearTeamName;
  const projectId = process.env.LINEAR_PROJECT_ID || meta.linearProjectId;
  const demoSlug = lead.pipeline?.demoSlug || slugifyBusiness(lead.business);

  const description = [
    `## Business`,
    lead.business,
    "",
    `## Problem`,
    lead.problem || "n/a",
    "",
    `## Pitch`,
    lead.solution || "n/a",
    "",
    `## Demo checklist`,
    `- [ ] Private concept brief ready`,
    `- [ ] Interactive prototype at /opportunities/demos/${demoSlug}`,
    `- [ ] Share pack (screens + walkthrough) prepared`,
    `- [ ] Outreach draft approved by owner`,
    "",
    `## Contacts`,
    `- ${lead.contact || "n/a"}`,
    `- ${lead.email || "no email"}`,
    `- ${lead.phone || "no phone"}`,
    "",
    lead.sourceUrl ? `Source: ${lead.sourceUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey || (!teamId && !teamName)) {
    const queued = await enqueueSync({
      action: "linear_demo",
      business: lead.business,
      payload: {
        title: `Build private demo: ${lead.business}`,
        description,
        demoSlug,
        labels: ["demo"],
      },
    });
    return {
      mode: "queued" as const,
      queueId: queued.id,
      demoSlug,
      message: "Linear API key/team not configured. Demo task queued locally.",
    };
  }

  const mutation = `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier url title }
      }
    }
  `;

  const input: Record<string, unknown> = {
    title: `Build private demo: ${lead.business}`,
    description,
    ...(teamId ? { teamId } : {}),
    ...(projectId ? { projectId } : {}),
  };

  // If only team name is set, resolve team id first.
  let resolvedTeamId = teamId;
  if (!resolvedTeamId && teamName) {
    const teamsResponse = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: { Authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query { teams { nodes { id name } } }`,
      }),
    });
    const teamsJson = (await teamsResponse.json()) as {
      data?: { teams?: { nodes?: Array<{ id: string; name: string }> } };
    };
    resolvedTeamId = teamsJson.data?.teams?.nodes?.find(
      (team) => team.name.toLowerCase() === teamName.toLowerCase(),
    )?.id;
    if (!resolvedTeamId) throw new Error(`Linear team not found: ${teamName}`);
    input.teamId = resolvedTeamId;
  }

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation, variables: { input } }),
  });
  const json = (await response.json()) as {
    data?: { issueCreate?: { success?: boolean; issue?: { id: string; identifier: string; url: string } } };
    errors?: Array<{ message: string }>;
  };
  if (json.errors?.length || !json.data?.issueCreate?.success || !json.data.issueCreate.issue) {
    throw new Error(json.errors?.[0]?.message || "Linear issue create failed");
  }

  return {
    mode: "sent" as const,
    demoSlug,
    issue: json.data.issueCreate.issue,
  };
}

export async function readRunMeta(runDirectory: string) {
  try {
    const raw = await readFile(path.join(runDirectory, "run-meta.json"), "utf8");
    return JSON.parse(raw) as { notification?: string; placesCoverage?: boolean };
  } catch {
    return {};
  }
}
