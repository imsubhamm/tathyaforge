"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "new" | "researching" | "ready" | "contacted" | "meeting" | "proposal" | "won" | "lost";
type Lead = {
  business: string;
  city: string;
  state: string;
  distanceKmEstimate: number;
  industry: string;
  problem: string;
  currentSolution: string;
  solution: string;
  contact: string;
  email: string;
  phone: string;
  budgetLow: number;
  budgetHigh: number;
  budgetReason: string;
  confidence: number;
  score: number;
  priority: "P1" | "P2" | "P3";
  conversionReason: string;
  demoType: string;
  demo: string;
  sourceUrl: string;
  sourceClaim: string;
  pipeline: {
    status?: Status;
    owner?: string;
    nextAction?: string;
    nextActionAt?: string;
    notes?: string;
    updatedAt?: string;
  };
};
type Dashboard = {
  run: {
    date: string;
    center: string;
    radiusKm: number;
    target: number;
    actual: number;
    demos: number;
    notification: string;
    placesCoverage: boolean;
  };
  leads: Lead[];
};

const statuses: { value: Status; label: string }[] = [
  { value: "new", label: "New" },
  { value: "researching", label: "Researching" },
  { value: "ready", label: "Ready to approach" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting", label: "Meeting" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function OpportunityCommandCenter() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<Dashboard | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("score");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "board">("list");

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/opportunities", {
        headers: { "x-research-key": key },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("The command-center key is not valid.");
      setData(await response.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load the command center.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const leads = [...(data?.leads || [])].filter((lead) => {
      const haystack = `${lead.business} ${lead.city} ${lead.industry} ${lead.problem} ${lead.solution}`.toLowerCase();
      return (
        haystack.includes(query.toLowerCase()) &&
        (priority === "all" || lead.priority === priority) &&
        (status === "all" || (lead.pipeline.status || "new") === status)
      );
    });
    leads.sort((a, b) =>
      sort === "budget"
        ? b.budgetHigh - a.budgetHigh
        : sort === "distance"
          ? a.distanceKmEstimate - b.distanceKmEstimate
          : b.score - a.score,
    );
    return leads;
  }, [data, priority, query, sort, status]);

  const metrics = useMemo(() => {
    const leads = data?.leads || [];
    return {
      pipeline: leads.reduce((sum, lead) => sum + (lead.budgetLow + lead.budgetHigh) / 2, 0),
      p1: leads.filter((lead) => lead.priority === "P1").length,
      ready: leads.filter((lead) => ["ready", "contacted", "meeting", "proposal"].includes(lead.pipeline.status || "")).length,
      won: leads.filter((lead) => lead.pipeline.status === "won").length,
    };
  }, [data]);

  async function updatePipeline(lead: Lead, update: Lead["pipeline"]) {
    const response = await fetch("/api/opportunities", {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-research-key": key },
      body: JSON.stringify({ business: lead.business, update }),
    });
    if (!response.ok) throw new Error("Could not save the pipeline update.");
    const result = await response.json();
    setData((current) =>
      current
        ? {
            ...current,
            leads: current.leads.map((item) =>
              item.business === lead.business ? { ...item, pipeline: result.pipeline } : item,
            ),
          }
        : current,
    );
    setSelected((current) => current?.business === lead.business ? { ...current, pipeline: result.pipeline } : current);
  }

  if (!data) {
    return (
      <div className="command-shell grid min-h-screen place-items-center px-5 py-16">
        <section className="command-login w-full max-w-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl sm:p-12">
          <div className="command-pulse mb-8 grid h-14 w-14 place-items-center rounded-2xl text-sm font-black">TF</div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">Private intelligence system</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Opportunity<br />Command Center
          </h1>
          <p className="mt-5 max-w-md leading-7 text-slate-400">
            Every researched business, evidence trail, demo, budget hypothesis and sales action—one place.
          </p>
          <form onSubmit={load} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <input
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="Command-center access key"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
            />
            <button className="min-h-12 rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
              {loading ? "Opening…" : "Enter system"}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        </section>
      </div>
    );
  }

  return (
    <div className="command-shell min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1680px]">
        <header className="command-panel flex flex-col gap-5 rounded-2xl p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="command-live"><i /> LIVE</span>
              <span className="font-mono text-xs text-slate-500">RUN {data.run.date}</span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">Opportunity Command Center</h1>
            <p className="mt-1 text-sm text-slate-400">{data.run.center} · {data.run.radiusKm} km · India-only intelligence perimeter</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setView("list")} className={`command-toggle ${view === "list" ? "active" : ""}`}>Intelligence</button>
            <button onClick={() => setView("board")} className={`command-toggle ${view === "board" ? "active" : ""}`}>Pipeline board</button>
            <button onClick={() => void load()} className="command-toggle">Refresh</button>
          </div>
        </header>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Qualified intelligence" value={`${data.run.actual}/${data.run.target}`} note={`${metrics.p1} priority-one targets`} tone="blue" />
          <Metric label="Estimated pipeline" value={money.format(metrics.pipeline)} note="Midpoint, not known budget" tone="amber" />
          <Metric label="In active pipeline" value={String(metrics.ready)} note="Ready through proposal" tone="violet" />
          <Metric label="Closed won" value={String(metrics.won)} note={`${data.run.demos} concept demos ready`} tone="green" />
        </section>

        <section className="command-panel mt-4 rounded-2xl p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search business, city, industry, problem or solution…" className="command-input" />
            <select value={priority} onChange={(event) => setPriority(event.target.value)} className="command-input">
              <option value="all">All priorities</option><option>P1</option><option>P2</option><option>P3</option>
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="command-input">
              <option value="all">All pipeline stages</option>
              {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="command-input">
              <option value="score">Highest score</option><option value="budget">Highest budget</option><option value="distance">Nearest first</option>
            </select>
          </div>
        </section>

        {view === "list" ? (
          <section className="mt-4 grid gap-3">
            {filtered.map((lead, index) => (
              <button key={lead.business} onClick={() => setSelected(lead)} className="command-lead group grid w-full gap-4 rounded-2xl p-4 text-left lg:grid-cols-[52px_1.2fr_1.4fr_0.7fr_0.5fr_36px] lg:items-center">
                <span className="font-mono text-xs text-slate-600">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="flex items-center gap-2">
                    <strong className="text-base text-white">{lead.business}</strong>
                    <Priority value={lead.priority} />
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">{lead.city} · {lead.distanceKmEstimate} km · {lead.industry}</span>
                </span>
                <span className="line-clamp-2 text-sm leading-6 text-slate-400">{lead.problem}</span>
                <span>
                  <span className="block text-sm font-semibold text-amber-300">{money.format(lead.budgetLow)}–{money.format(lead.budgetHigh)}</span>
                  <span className="mt-1 block text-xs text-slate-600">estimated range</span>
                </span>
                <span>
                  <strong className="text-xl text-white">{lead.score}</strong><span className="text-xs text-slate-600"> /100</span>
                  <span className="mt-1 block text-xs capitalize text-cyan-300">{lead.pipeline.status || "new"}</span>
                </span>
                <span className="text-xl text-slate-600 transition group-hover:translate-x-1 group-hover:text-amber-300">→</span>
              </button>
            ))}
          </section>
        ) : (
          <section className="mt-4 grid gap-4 overflow-x-auto pb-4 xl:grid-cols-4">
            {(["new", "ready", "contacted", "proposal"] as Status[]).map((column) => (
              <div key={column} className="command-panel min-w-[280px] rounded-2xl p-3">
                <div className="mb-3 flex items-center justify-between px-2 py-1">
                  <h2 className="text-sm font-semibold capitalize text-white">{statuses.find((item) => item.value === column)?.label}</h2>
                  <span className="rounded-full bg-white/5 px-2 py-1 font-mono text-xs text-slate-500">{data.leads.filter((lead) => (lead.pipeline.status || "new") === column).length}</span>
                </div>
                <div className="space-y-2">
                  {data.leads.filter((lead) => (lead.pipeline.status || "new") === column).map((lead) => (
                    <button key={lead.business} onClick={() => setSelected(lead)} className="command-board-card w-full rounded-xl p-4 text-left">
                      <div className="flex items-start justify-between gap-2"><strong className="text-sm text-white">{lead.business}</strong><Priority value={lead.priority} /></div>
                      <p className="mt-3 text-xs leading-5 text-slate-500">{lead.city} · score {lead.score}</p>
                      <p className="mt-2 text-sm font-semibold text-amber-300">{money.format((lead.budgetLow + lead.budgetHigh) / 2)}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {selected && <LeadPanel lead={selected} onClose={() => setSelected(null)} onUpdate={updatePipeline} />}
    </div>
  );
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return <article className={`command-metric command-metric-${tone} rounded-2xl p-5`}><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p><strong className="mt-3 block text-3xl tracking-tight text-white">{value}</strong><p className="mt-2 text-xs text-slate-500">{note}</p></article>;
}

function Priority({ value }: { value: Lead["priority"] }) {
  return <span className={`priority priority-${value.toLowerCase()}`}>{value}</span>;
}

function LeadPanel({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: (lead: Lead, update: Lead["pipeline"]) => Promise<void> }) {
  const [pipeline, setPipeline] = useState(lead.pipeline);
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    try { await onUpdate(lead, pipeline); } finally { setSaving(false); }
  }
  return (
    <div className="command-overlay fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true">
      <button aria-label="Close lead details" className="absolute inset-0 cursor-default" onClick={onClose} />
      <aside className="command-drawer relative h-full w-full max-w-3xl overflow-y-auto border-l border-white/10 p-5 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div><div className="flex items-center gap-2"><Priority value={lead.priority} /><span className="font-mono text-xs text-slate-500">SCORE {lead.score}</span></div><h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">{lead.business}</h2><p className="mt-2 text-sm text-slate-500">{lead.city}, {lead.state} · {lead.distanceKmEstimate} km · {lead.industry}</p></div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-xl text-slate-400 hover:text-white">×</button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Mini label="Budget estimate" value={`${money.format(lead.budgetLow)}–${money.format(lead.budgetHigh)}`} />
          <Mini label="Evidence confidence" value={`${lead.confidence}%`} />
          <Mini label="Demo" value={lead.demo ? "Ready" : "Recommended"} />
        </div>

        <Section title="Observed opportunity"><p>{lead.problem}</p></Section>
        <Section title="Current visible solution"><p>{lead.currentSolution}</p></Section>
        <Section title="What TathyaForge should pitch"><p className="text-white">{lead.solution}</p><p className="mt-3 text-amber-200">{lead.budgetReason}</p></Section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Section title="Public contact">
            <p className="text-white">{lead.contact || "Needs enrichment"}</p>
            <p className="mt-2">{lead.email || "No verified public email"}</p><p>{lead.phone || "No verified public phone"}</p>
          </Section>
          <Section title="Why it may convert"><p>{lead.conversionReason}</p></Section>
        </div>

        {lead.demo && <Section title={lead.demoType}><pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">{lead.demo}</pre></Section>}

        <Section title="Evidence">
          <p>{lead.sourceClaim}</p>
          <a href={lead.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">Open public source ↗</a>
        </Section>

        <section className="command-workspace mt-6 rounded-2xl p-5">
          <div className="flex items-center justify-between"><h3 className="font-semibold text-white">Sales workspace</h3><span className="command-live"><i /> PERSISTENT</span></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="command-label">Stage<select value={pipeline.status || "new"} onChange={(event) => setPipeline({ ...pipeline, status: event.target.value as Status })} className="command-input mt-2">{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="command-label">Owner<input value={pipeline.owner || ""} onChange={(event) => setPipeline({ ...pipeline, owner: event.target.value })} placeholder="Who owns this lead?" className="command-input mt-2" /></label>
            <label className="command-label">Next action<input value={pipeline.nextAction || ""} onChange={(event) => setPipeline({ ...pipeline, nextAction: event.target.value })} placeholder="Call, enrich, demo, follow up…" className="command-input mt-2" /></label>
            <label className="command-label">Action date<input type="date" value={pipeline.nextActionAt || ""} onChange={(event) => setPipeline({ ...pipeline, nextActionAt: event.target.value })} className="command-input mt-2" /></label>
          </div>
          <label className="command-label mt-4 block">Private notes<textarea value={pipeline.notes || ""} onChange={(event) => setPipeline({ ...pipeline, notes: event.target.value })} rows={4} placeholder="What did you learn? Objections? Who should be contacted?" className="command-input mt-2 resize-y" /></label>
          <button onClick={() => void save()} disabled={saving} className="mt-4 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300">{saving ? "Saving…" : "Save pipeline update"}</button>
        </section>
      </aside>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="command-workspace rounded-xl p-4"><p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">{label}</p><strong className="mt-2 block text-sm text-white">{value}</strong></div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6"><h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">{title}</h3><div className="mt-3 text-sm leading-7 text-slate-400">{children}</div></section>;
}
