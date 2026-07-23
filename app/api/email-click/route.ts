import { NextRequest, NextResponse } from "next/server";
import { clientIp, hashIp, recordEvent } from "@/lib/analytics";

export const runtime = "nodejs";

const destinations: Record<string, string> = {
  home: "/",
  work: "/case-studies",
  contact: "/contact",
};

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "unknown";
  const target = request.nextUrl.searchParams.get("to") || "home";
  await recordEvent({
    type: "email_click",
    content: id,
    path: destinations[target] || "/",
    source: "outreach",
    medium: "email",
    ipHash: hashIp(clientIp(request.headers)),
  });
  const publicOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://tathyaforge.in";
  const destination = new URL(destinations[target] || "/", publicOrigin);
  destination.searchParams.set("utm_source", "outreach");
  destination.searchParams.set("utm_medium", "email");
  destination.searchParams.set("utm_campaign", "creator_outreach");
  destination.searchParams.set("utm_content", id);
  return NextResponse.redirect(destination);
}
