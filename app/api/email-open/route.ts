import { NextRequest, NextResponse } from "next/server";
import { clientIp, hashIp, recordEvent } from "@/lib/analytics";

export const runtime = "nodejs";

const transparentGif = Buffer.from(
  "R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
  "base64",
);

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "unknown";
  await recordEvent({
    type: "email_open",
    content: id,
    ipHash: hashIp(clientIp(request.headers)),
    metadata: {
      userAgent: (request.headers.get("user-agent") || "").slice(0, 240),
    },
  });
  return new NextResponse(transparentGif, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

