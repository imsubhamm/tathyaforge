"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Lead = {
  business: string;
  industry: string;
  problem: string;
  currentSolution: string;
  solution: string;
  demo: string;
  demoType?: string;
  pipeline?: {
    demoSlug?: string;
    status?: string;
  };
};

export default function PrivateOpportunityDemoClient() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/opportunities", {
        credentials: "include",
        cache: "no-store",
      });
      if (response.status === 401) {
        router.replace(`/login?next=${encodeURIComponent(`/opportunities/demos/${slug}`)}`);
        return;
      }
      if (!response.ok) throw new Error("Unable to load demo.");
      const data = (await response.json()) as { leads: Lead[] };
      const matched =
        data.leads.find((item) => item.pipeline?.demoSlug === slug) ||
        data.leads.find((item) =>
          item.business
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .startsWith(slug),
        );
      if (!matched) {
        throw new Error("No lead is linked to this private demo slug yet. Create a demo task first.");
      }
      setLead(matched);
    } catch (cause) {
      setLead(null);
      setError(cause instanceof Error ? cause.message : "Unable to load demo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const screens = useMemo(() => {
    if (!lead) return [];
    return [
      {
        title: "1. Capture the request",
        body: `Prospect starts from the public friction: ${lead.problem}`,
      },
      {
        title: "2. Replace the current patchwork",
        body: `Today they rely on: ${lead.currentSolution}`,
      },
      {
        title: "3. Run the TathyaForge flow",
        body: lead.solution,
      },
      {
        title: "4. Close the first call",
        body: "Walk one concrete job end-to-end, agree next milestone, and leave the private prototype as proof—not a public launch.",
      },
    ];
  }, [lead]);

  if (!lead) {
    return (
      <div className="command-shell grid min-h-screen place-items-center px-5 py-16">
        <section className="command-login w-full max-w-xl rounded-[2rem] border border-white/10 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">Private demo</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Prototype gate</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {loading
              ? "Loading your session…"
              : error || "Unable to open this private demo."}{" "}
            Slug: <span className="text-white">{slug}</span>
          </p>
          {!loading && (
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => void load()}
                className="min-h-12 rounded-xl bg-amber-400 px-5 text-sm font-bold text-slate-950"
              >
                Retry
              </button>
              <Link
                href="/opportunities"
                className="grid min-h-12 place-items-center rounded-xl border border-white/10 px-5 text-sm text-slate-300 hover:text-white"
              >
                Back to command center
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="command-shell min-h-screen px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">Private concept prototype</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{lead.business}</h1>
            <p className="mt-2 text-sm text-slate-400">{lead.industry} · not publicly deployed</p>
          </div>
          <Link
            href="/opportunities"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:text-white"
          >
            Back to command center
          </Link>
        </div>

        <div className="command-panel rounded-2xl p-5">
          <div className="flex flex-wrap gap-2">
            {screens.map((screen, index) => (
              <button
                key={screen.title}
                onClick={() => setStep(index)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  step === index ? "bg-amber-400 text-slate-950" : "bg-white/5 text-slate-300"
                }`}
              >
                {screen.title}
              </button>
            ))}
          </div>

          <article className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-semibold text-white">{screens[step]?.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{screens[step]?.body}</p>
          </article>

          {lead.demo && (
            <details className="mt-5 rounded-2xl border border-white/10 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-white">
                {lead.demoType || "Concept brief"}
              </summary>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-slate-400">{lead.demo}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
