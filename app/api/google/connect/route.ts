import { NextRequest, NextResponse } from "next/server";
import { googleAuthorizationUrl } from "@/lib/google-calendar";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (
    !process.env.ANALYTICS_ADMIN_KEY ||
    request.nextUrl.searchParams.get("key") !== process.env.ANALYTICS_ADMIN_KEY
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.redirect(googleAuthorizationUrl());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Google OAuth is not configured",
      },
      { status: 503 },
    );
  }
}
