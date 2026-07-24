import { readdir, readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { hasValidAdminSessionFromRequest } from "@/lib/admin-auth";
import {
  OpportunityLead,
  buildOutreachDraft,
  createLinearDemoIssue,
  integrationStatus,
  pushLeadToNotion,
  slugifyBusiness,
} from "@/lib/opportunity-crm";

export const dynamic = "force-dynamic";

type PipelineState = NonNullable<OpportunityLead["pipeline"]>;

const runsDirectory = path.join(process.cwd(), "research-agent", "runs");
const statePath = path.join(process.cwd(), "research-agent", "data", "pipeline-state.json");

async function authorized(request: NextRequest) {
  return hasValidAdminSessionFromRequest(request);
}

async function readState(): Promise<Record<string, PipelineState>> {
  try {
    return JSON.parse(await readFile(statePath, "utf8"));
  } catch {
    return {};
  }
}

async function writeState(state: Record<string, PipelineState>) {
  const { mkdir, writeFile } = await import("fs/promises");
  await mkdir(path.dirname(statePath), { recursive: true });
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function scoreLead(lead: Record<string, unknown>) {
  return (
    Number(lead.maturity || 0) +
    Number(lead.severity || 0) +
    Number(lead.fit || 0) +
    Number(lead.access || 0) +
    Number(lead.urgency || 0) +
    Number(lead.evidence || 0) +
    Number(lead.demoValue || 0)
  );
}

async function findLead(business: string): Promise<OpportunityLead | null> {
  const entries = await readdir(runsDirectory, { withFileTypes: true });
  const dates = entries
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .reverse();

  for (const date of dates) {
    const directory = path.join(runsDirectory, date);
    try {
      const leads = JSON.parse(await readFile(path.join(directory, "leads.json"), "utf8")) as Array<
        OpportunityLead & Record<string, unknown>
      >;
      const lead = leads.find((item) => item.business === business);
      if (!lead) continue;

      const demoPath = typeof lead.demoPath === "string" ? lead.demoPath : "";
      let demo = "";
      if (demoPath) {
        try {
          demo = await readFile(path.join(directory, demoPath), "utf8");
        } catch {
          demo = "";
        }
      }

      const state = await readState();
      return {
        ...lead,
        demo,
        score: scoreLead(lead),
        pipeline: state[business] || { status: "new" },
      };
    } catch {
      // try next run
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: "draft" | "push_notion" | "create_demo_task";
    business?: string;
  };

  if (!body.business || !body.action) {
    return NextResponse.json({ error: "business and action are required" }, { status: 400 });
  }

  const lead = await findLead(body.business);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found in the latest research runs" }, { status: 404 });
  }

  const state = await readState();
  const current = state[body.business] || { status: "new" as const };
  const integrations = integrationStatus();

  if (body.action === "draft") {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tathyaforge.in";
    const draft = buildOutreachDraft(lead, siteUrl);
    return NextResponse.json({ draft, integrations });
  }

  if (body.action === "push_notion") {
    const result = await pushLeadToNotion(lead);
    if (result.mode === "sent") {
      state[body.business] = {
        ...current,
        notionPageId: result.pageId,
        notionUrl: result.url,
        status: current.status || "ready",
        nextAction: current.nextAction || "Draft outreach and approve send",
        updatedAt: new Date().toISOString(),
      };
      await writeState(state);
    }
    return NextResponse.json({ result, pipeline: state[body.business] || current, integrations });
  }

  if (body.action === "create_demo_task") {
    const demoSlug = current.demoSlug || slugifyBusiness(lead.business);
    const result = await createLinearDemoIssue({
      ...lead,
      pipeline: { ...current, demoSlug },
    });

    state[body.business] = {
      ...current,
      demoSlug,
      linearIssueId: result.mode === "sent" ? result.issue.id : current.linearIssueId,
      linearIssueUrl: result.mode === "sent" ? result.issue.url : current.linearIssueUrl,
      nextAction: current.nextAction || "Build private demo prototype",
      status: current.status === "new" || !current.status ? "researching" : current.status,
      updatedAt: new Date().toISOString(),
    };
    await writeState(state);

    return NextResponse.json({
      result,
      pipeline: state[body.business],
      demoPath: `/opportunities/demos/${demoSlug}`,
      integrations,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
