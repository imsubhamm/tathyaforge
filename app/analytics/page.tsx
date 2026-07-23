"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/Container";

type DashboardData = {
  totals: Record<string, number>;
  pages: { label: string; count: number }[];
  sources: { label: string; count: number }[];
  campaigns: { label: string; count: number }[];
  timezones: { label: string; count: number }[];
  recent: {
    id: string;
    at: string;
    type: string;
    path?: string;
    source?: string;
    campaign?: string;
    content?: string;
  }[];
};

const metricLabels: Record<string, string> = {
  pageViews: "Page views",
  uniqueVisitors: "Unique visitors",
  uniqueSessions: "Sessions",
  repeatedVisitors: "Repeat visitors",
  emailOpens: "Email opens",
  emailClicks: "Email clicks",
  assistantOpens: "Assistant opens",
  meetingRequests: "Meeting requests",
};

export default function AnalyticsPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analytics", {
        headers: { "x-analytics-key": key },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("The analytics key is not valid.");
      setData(await response.json());
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load analytics.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Private reporting
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          TathyaForge conversion analytics
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Visits, campaign attribution, outreach engagement, assistant activity,
          and meeting requests in one first-party view.
        </p>

        <form onSubmit={load} className="surface mt-8 flex max-w-xl gap-3 rounded-xl p-4">
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="Analytics access key"
            className="min-h-11 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 text-sm outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-slate-950 px-5 text-sm font-semibold text-white"
          >
            {loading ? "Loading…" : "Open dashboard"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        {data && (
          <div className="mt-10 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(data.totals).map(([keyName, value]) => (
                <article key={keyName} className="surface rounded-xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {metricLabels[keyName] || keyName}
                  </p>
                  <strong className="mt-3 block text-4xl text-slate-950">{value}</strong>
                </article>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Breakdown title="Top pages" rows={data.pages} />
              <Breakdown title="Traffic sources" rows={data.sources} />
              <Breakdown title="Campaigns" rows={data.campaigns} />
              <Breakdown title="Visitor timezones" rows={data.timezones} />
            </div>

            <section className="surface overflow-hidden rounded-xl">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold text-slate-950">Recent activity</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Time</th>
                      <th className="px-5 py-3">Event</th>
                      <th className="px-5 py-3">Page / content</th>
                      <th className="px-5 py-3">Source</th>
                      <th className="px-5 py-3">Campaign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((event) => (
                      <tr key={event.id} className="border-t border-slate-100">
                        <td className="px-5 py-3 text-slate-500">
                          {new Date(event.at).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 font-medium text-slate-900">{event.type}</td>
                        <td className="px-5 py-3 text-slate-600">
                          {event.path || event.content || "—"}
                        </td>
                        <td className="px-5 py-3 text-slate-600">{event.source || "—"}</td>
                        <td className="px-5 py-3 text-slate-600">{event.campaign || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </Container>
    </section>
  );
}

function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number }[];
}) {
  return (
    <section className="surface rounded-xl p-5">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate text-slate-600">{row.label}</span>
              <strong className="text-slate-950">{row.count}</strong>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No data yet.</p>
        )}
      </div>
    </section>
  );
}

