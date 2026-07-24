import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { hasValidAdminSessionFromRequest } from "@/lib/admin-auth";
import { integrationStatus, readRunMeta } from "@/lib/opportunity-crm";

export const dynamic = "force-dynamic";

type PipelineState = {
  status?: "new" | "researching" | "ready" | "contacted" | "meeting" | "proposal" | "won" | "lost";
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

async function latestRun() {
  const entries = await readdir(runsDirectory, { withFileTypes: true });
  const dates = entries
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .reverse();
  for (const date of dates) {
    const directory = path.join(runsDirectory, date);
    try {
      await readFile(path.join(directory, "leads.json"), "utf8");
      return { date, directory };
    } catch {
      // Continue to the next complete run.
    }
  }
  throw new Error("No completed research run is available.");
}

export async function GET(request: NextRequest) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ date, directory }, state] = await Promise.all([
    latestRun(),
    readState(),
  ]);
  const leads = await readFile(path.join(directory, "leads.json"), "utf8").then(JSON.parse);

  const enriched = await Promise.all(
    leads.map(async (lead: Record<string, unknown>) => {
      const demoPath = typeof lead.demoPath === "string" ? lead.demoPath : "";
      let demo = "";
      if (demoPath) {
        try {
          demo = await readFile(path.join(directory, demoPath), "utf8");
        } catch {
          demo = "";
        }
      }
      return {
        ...lead,
        score:
          Number(lead.maturity) +
          Number(lead.severity) +
          Number(lead.fit) +
          Number(lead.access) +
          Number(lead.urgency) +
          Number(lead.evidence) +
          Number(lead.demoValue),
        pipeline: state[String(lead.business)] || { status: "new" },
        demo,
      };
    }),
  );

  const runMeta = await readRunMeta(directory);
  const integrations = integrationStatus();

  return NextResponse.json(
    {
      run: {
        date,
        center: "713359",
        radiusKm: 400,
        target: 20,
        actual: enriched.length,
        demos: enriched.filter((lead) => lead.demo).length,
        notification: runMeta.notification || "unknown",
        placesCoverage: Boolean(runMeta.placesCoverage ?? integrations.placesCoverage),
      },
      integrations,
      leads: enriched,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PATCH(request: NextRequest) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { business?: string; update?: PipelineState };
  if (!body.business || !body.update) {
    return NextResponse.json({ error: "Business and update are required" }, { status: 400 });
  }

  const allowedStatuses = new Set([
    "new", "researching", "ready", "contacted", "meeting", "proposal", "won", "lost",
  ]);
  if (body.update.status && !allowedStatuses.has(body.update.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const state = await readState();
  state[body.business] = {
    ...state[body.business],
    ...body.update,
    owner: body.update.owner?.slice(0, 80),
    nextAction: body.update.nextAction?.slice(0, 300),
    nextActionAt: body.update.nextActionAt?.slice(0, 30),
    notes: body.update.notes?.slice(0, 3000),
    updatedAt: new Date().toISOString(),
  };

  await mkdir(path.dirname(statePath), { recursive: true });
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  return NextResponse.json({ pipeline: state[body.business] });
}
