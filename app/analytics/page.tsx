"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";

type DailyRow = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  assistantOpens: number;
  meetingRequests: number;
  emailOpens: number;
  emailClicks: number;
};

type DashboardData = {
  available: { from: string | null; to: string | null };
  range: { from: string | null; to: string | null };
  totals: Record<string, number>;
  pages: { label: string; count: number }[];
  sources: { label: string; count: number }[];
  campaigns: { label: string; count: number }[];
  timezones: { label: string; count: number }[];
  daily: DailyRow[];
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

type Period = "7" | "30" | "90" | "all" | "custom";

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function fetchDashboard(nextPeriod: Period) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (nextPeriod !== "all" && nextPeriod !== "custom") params.set("days", nextPeriod);
      if (nextPeriod === "custom") {
        if (from) params.set("from", from);
        if (to) params.set("to", to);
      }
      const response = await fetch(`/api/analytics?${params}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (response.status === 401) {
        router.replace("/login?next=/analytics");
        return;
      }
      if (!response.ok) throw new Error("Unable to load analytics.");
      setData(await response.json());
      setPeriod(nextPeriod);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login?next=/analytics");
    router.refresh();
  }

  useEffect(() => {
    void fetchDashboard(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxViews = useMemo(
    () => Math.max(1, ...(data?.daily.slice(-31).map((day) => day.pageViews) || [])),
    [data],
  );

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Private reporting</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              TathyaForge conversion analytics
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Visits, campaign attribution, outreach engagement, assistant activity, and meeting requests in one first-party view.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/opportunities" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Opportunities
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>

        {loading && !data && <p className="mt-8 text-sm text-slate-500">Loading analytics…</p>}
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        {data && (
          <div className="mt-10 space-y-8">
            <section className="surface rounded-xl p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recorded history</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    Tracking available since {data.available.from ? new Date(data.available.from).toLocaleDateString() : "no events yet"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Earlier visits were not recorded and cannot be reconstructed retroactively.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["7", "30", "90", "all"] as Period[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => void fetchDashboard(value)}
                      className={`rounded-md border px-3 py-2 text-xs font-semibold ${period === value ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white text-slate-700"}`}
                    >
                      {value === "all" ? "All time" : `${value} days`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-slate-200 pt-5">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  From
                  <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  To
                  <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
                </label>
                <button type="button" onClick={() => void fetchDashboard("custom")} className="rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white">
                  Apply dates
                </button>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(data.totals).map(([keyName, value]) => (
                <article key={keyName} className="surface rounded-xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{metricLabels[keyName] || keyName}</p>
                  <strong className="mt-3 block text-4xl text-slate-950">{value}</strong>
                </article>
              ))}
            </div>

            <section className="surface rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-950">Daily traffic</h2>
                  <p className="mt-1 text-xs text-slate-500">Last 31 recorded days in the selected range</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">{data.daily.length} active days</span>
              </div>
              <div className="mt-6 flex h-44 items-end gap-1 overflow-x-auto border-b border-slate-200 pb-1">
                {data.daily.slice(-31).map((day) => (
                  <div key={day.date} className="group flex h-full min-w-5 flex-1 items-end" title={`${day.date}: ${day.pageViews} views`}>
                    <div className="w-full rounded-t bg-amber-400 transition hover:bg-amber-500" style={{ height: `${Math.max(4, (day.pageViews / maxViews) * 100)}%` }} />
                  </div>
                ))}
                {!data.daily.length && <p className="self-center text-sm text-slate-500">No activity in this date range.</p>}
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <Breakdown title="Top pages" rows={data.pages} />
              <Breakdown title="Traffic sources" rows={data.sources} />
              <Breakdown title="Campaigns" rows={data.campaigns} />
              <Breakdown title="Visitor timezones" rows={data.timezones} />
            </div>

            <DataTable title="Daily history">
              {data.daily.slice().reverse().map((day) => (
                <tr key={day.date} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">{new Date(`${day.date}T00:00:00`).toLocaleDateString()}</td>
                  <td className="px-5 py-3">{day.pageViews}</td>
                  <td className="px-5 py-3">{day.uniqueVisitors}</td>
                  <td className="px-5 py-3">{day.assistantOpens}</td>
                  <td className="px-5 py-3">{day.meetingRequests}</td>
                  <td className="px-5 py-3">{day.emailOpens} / {day.emailClicks}</td>
                </tr>
              ))}
            </DataTable>

            <section className="surface overflow-hidden rounded-xl">
              <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-950">Recent activity</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr><th className="px-5 py-3">Time</th><th className="px-5 py-3">Event</th><th className="px-5 py-3">Page / content</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Campaign</th></tr>
                  </thead>
                  <tbody>
                    {data.recent.map((event) => (
                      <tr key={event.id} className="border-t border-slate-100">
                        <td className="px-5 py-3 text-slate-500">{new Date(event.at).toLocaleString()}</td>
                        <td className="px-5 py-3 font-medium text-slate-900">{event.type}</td>
                        <td className="px-5 py-3 text-slate-600">{event.path || event.content || "—"}</td>
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

function DataTable({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface overflow-hidden rounded-xl">
      <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-950">{title}</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Visitors</th><th className="px-5 py-3">Assistant</th><th className="px-5 py-3">Meetings</th><th className="px-5 py-3">Email open / click</th></tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </section>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  return (
    <section className="surface rounded-xl p-5">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length ? rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="truncate text-slate-600">{row.label}</span><strong className="text-slate-950">{row.count}</strong>
          </div>
        )) : <p className="text-sm text-slate-500">No data yet.</p>}
      </div>
    </section>
  );
}
