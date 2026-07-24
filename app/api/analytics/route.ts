import { NextRequest, NextResponse } from "next/server";
import { hasValidAdminSessionFromRequest } from "@/lib/admin-auth";
import { readEvents } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!(await hasValidAdminSessionFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allEvents = await readEvents(100000);
  const fromParam = request.nextUrl.searchParams.get("from");
  const toParam = request.nextUrl.searchParams.get("to");
  const daysParam = Number(request.nextUrl.searchParams.get("days"));
  const now = new Date();
  const automaticFrom =
    Number.isFinite(daysParam) && daysParam > 0
      ? new Date(now.getTime() - (daysParam - 1) * 86_400_000)
      : null;
  if (automaticFrom) automaticFrom.setUTCHours(0, 0, 0, 0);
  const from = fromParam ? new Date(`${fromParam}T00:00:00.000Z`) : automaticFrom;
  const to = toParam ? new Date(`${toParam}T23:59:59.999Z`) : null;
  const events = allEvents.filter((event) => {
    const date = new Date(event.at);
    return (!from || date >= from) && (!to || date <= to);
  });
  const pageViews = events.filter((event) => event.type === "page_view");
  const uniqueVisitors = new Set(
    pageViews.map((event) => event.visitorId || event.ipHash).filter(Boolean),
  ).size;
  const uniqueSessions = new Set(
    pageViews.map((event) => event.sessionId).filter(Boolean),
  ).size;
  const repeatedVisitors = [...new Set(pageViews.map((event) => event.visitorId))]
    .filter(Boolean)
    .filter(
      (visitor) =>
        new Set(
          pageViews
            .filter((event) => event.visitorId === visitor)
            .map((event) => event.sessionId),
        ).size > 1,
    ).length;

  const countBy = (field: keyof (typeof events)[number], type?: string) => {
    const counts = new Map<string, number>();
    events
      .filter((event) => !type || event.type === type)
      .forEach((event) => {
        const value = String(event[field] || "Direct / unknown");
        counts.set(value, (counts.get(value) || 0) + 1);
      });
    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  };

  const dailyMap = new Map<
    string,
    {
      date: string;
      pageViews: number;
      visitors: Set<string>;
      assistantOpens: number;
      meetingRequests: number;
      emailOpens: number;
      emailClicks: number;
    }
  >();
  events.forEach((event) => {
    const date = event.at.slice(0, 10);
    const day = dailyMap.get(date) || {
      date,
      pageViews: 0,
      visitors: new Set<string>(),
      assistantOpens: 0,
      meetingRequests: 0,
      emailOpens: 0,
      emailClicks: 0,
    };
    if (event.type === "page_view") {
      day.pageViews += 1;
      const visitor = event.visitorId || event.ipHash;
      if (visitor) day.visitors.add(visitor);
    }
    if (event.type === "assistant_open") day.assistantOpens += 1;
    if (event.type === "meeting_request") day.meetingRequests += 1;
    if (event.type === "email_open") day.emailOpens += 1;
    if (event.type === "email_click") day.emailClicks += 1;
    dailyMap.set(date, day);
  });

  const availableDates = allEvents.map((event) => event.at).sort();

  return NextResponse.json({
    available: {
      from: availableDates[0] || null,
      to: availableDates.at(-1) || null,
    },
    range: {
      from: from?.toISOString() || null,
      to: to?.toISOString() || null,
    },
    totals: {
      pageViews: pageViews.length,
      uniqueVisitors,
      uniqueSessions,
      repeatedVisitors,
      emailOpens: events.filter((event) => event.type === "email_open").length,
      emailClicks: events.filter((event) => event.type === "email_click").length,
      assistantOpens: events.filter((event) => event.type === "assistant_open").length,
      meetingRequests: events.filter((event) => event.type === "meeting_request").length,
    },
    pages: countBy("path", "page_view"),
    sources: countBy("source", "page_view"),
    campaigns: countBy("campaign", "page_view"),
    timezones: countBy("timezone", "page_view"),
    daily: [...dailyMap.values()]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(({ visitors, ...day }) => ({ ...day, uniqueVisitors: visitors.size })),
    recent: events.slice(-200).reverse(),
  });
}
