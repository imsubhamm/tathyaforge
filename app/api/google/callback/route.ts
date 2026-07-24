import { NextRequest, NextResponse } from "next/server";
import {
  exchangeAuthorizationCode,
  validOAuthState,
} from "@/lib/google-calendar";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") || "";
  const state = request.nextUrl.searchParams.get("state") || "";
  if (!code || !validOAuthState(state)) {
    return NextResponse.json({ error: "Invalid OAuth callback" }, { status: 400 });
  }
  try {
    const connection = await exchangeAuthorizationCode(code);
    const destination = new URL(
      "/analytics",
      process.env.NEXT_PUBLIC_SITE_URL || "https://tathyaforge.in",
    );
    destination.searchParams.set("calendar", "connected");
    if (connection.connectedEmail) {
      destination.searchParams.set("account", connection.connectedEmail);
    }
    return NextResponse.redirect(destination);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to connect Google Calendar",
      },
      { status: 500 },
    );
  }
}
