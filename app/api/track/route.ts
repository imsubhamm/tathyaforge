import { NextRequest, NextResponse } from "next/server";
import { clientIp, hashIp, recordEvent } from "@/lib/analytics";

export const runtime = "nodejs";

const allowedEvents = new Set([
  "page_view",
  "assistant_open",
  "assistant_need",
  "assistant_schedule_intent",
  "meeting_request",
  "cta_click",
]);

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const body = JSON.parse(text || "{}");
    if (!allowedEvents.has(body.type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await recordEvent({
      ...body,
      ipHash: hashIp(clientIp(request.headers)),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

