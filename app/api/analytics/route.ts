import { NextRequest, NextResponse } from "next/server";
import { readEvents } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supplied = request.headers.get("x-analytics-key");
  const expected = process.env.ANALYTICS_ADMIN_KEY;
  if (!expected || supplied !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await readEvents();
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

  return NextResponse.json({
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
    recent: events.slice(-100).reverse(),
  });
}

