import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { chmod, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";

type StoredTokens = {
  refreshToken: string;
  connectedEmail?: string;
  connectedAt: string;
};

export type CalendarMeeting = {
  eventId: string;
  eventUrl: string;
  meetUrl: string;
};

export class CalendarConflictError extends Error {
  constructor() {
    super("That time is no longer available. Please choose another slot.");
    this.name = "CalendarConflictError";
  }
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function tokenFile() {
  const dataDirectory =
    process.env.ANALYTICS_DATA_DIR || path.join(process.cwd(), "data");
  return path.join(dataDirectory, "google-calendar-token.json");
}

function redirectUri() {
  return `${required("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "")}/api/google/callback`;
}

function stateSignature(timestamp: string) {
  return createHmac("sha256", required("ANALYTICS_ADMIN_KEY"))
    .update(timestamp)
    .digest("hex");
}

export function createOAuthState() {
  const timestamp = Date.now().toString();
  return `${timestamp}.${stateSignature(timestamp)}`;
}

export function validOAuthState(state: string) {
  const [timestamp, signature] = state.split(".");
  if (!timestamp || !signature || Date.now() - Number(timestamp) > 10 * 60 * 1000) {
    return false;
  }
  const expected = stateSignature(timestamp);
  return (
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
}

export function googleAuthorizationUrl() {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", required("GOOGLE_CLIENT_ID"));
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", CALENDAR_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", createOAuthState());
  return url.toString();
}

async function tokenRequest(parameters: Record<string, string>) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(parameters),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error_description || result.error || "Google OAuth failed");
  }
  return result as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

export async function exchangeAuthorizationCode(code: string) {
  const tokens = await tokenRequest({
    code,
    client_id: required("GOOGLE_CLIENT_ID"),
    client_secret: required("GOOGLE_CLIENT_SECRET"),
    redirect_uri: redirectUri(),
    grant_type: "authorization_code",
  });
  if (!tokens.refresh_token) {
    throw new Error("Google did not return an offline refresh token");
  }

  const profileResponse = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList/primary",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } },
  );
  const profile = profileResponse.ok
    ? ((await profileResponse.json()) as { id?: string })
    : {};
  const stored: StoredTokens = {
    refreshToken: tokens.refresh_token,
    connectedEmail: profile.id,
    connectedAt: new Date().toISOString(),
  };
  const file = tokenFile();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(stored), { mode: 0o600 });
  await chmod(file, 0o600);
  return stored;
}

async function accessToken() {
  const stored = JSON.parse(await readFile(tokenFile(), "utf8")) as StoredTokens;
  const tokens = await tokenRequest({
    refresh_token: stored.refreshToken,
    client_id: required("GOOGLE_CLIENT_ID"),
    client_secret: required("GOOGLE_CLIENT_SECRET"),
    grant_type: "refresh_token",
  });
  return tokens.access_token;
}

async function googleRequest<T>(
  endpoint: string,
  token: string,
  init: RequestInit,
) {
  const response = await fetch(`${GOOGLE_CALENDAR_API}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.error?.message || `Google Calendar returned ${response.status}`,
    );
  }
  return result as T;
}

export async function createCalendarMeeting({
  start,
  end,
  timezone,
  name,
  email,
  need,
}: {
  start: Date;
  end: Date;
  timezone: string;
  name: string;
  email: string;
  need: string;
}): Promise<CalendarMeeting | null> {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return null;
  }

  let token: string;
  try {
    token = await accessToken();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }

  const availability = await googleRequest<{
    calendars: { primary?: { busy?: Array<{ start: string; end: string }> } };
  }>("/freeBusy", token, {
    method: "POST",
    body: JSON.stringify({
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      timeZone: timezone,
      items: [{ id: "primary" }],
    }),
  });
  if (availability.calendars.primary?.busy?.length) {
    throw new CalendarConflictError();
  }

  const attendees = [
    email,
    "imsubhamrk@outlook.com",
    "hellow@tathyaforge.in",
  ].map((attendeeEmail) => ({ email: attendeeEmail }));
  const event = await googleRequest<{
    id: string;
    htmlLink: string;
    hangoutLink?: string;
    conferenceData?: {
      entryPoints?: Array<{ entryPointType: string; uri: string }>;
    };
  }>("/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all", token, {
    method: "POST",
    body: JSON.stringify({
      summary: `TathyaForge project discovery — ${name}`,
      description: `Project need: ${need}\n\nBooked through the TathyaForge website assistant.`,
      start: { dateTime: start.toISOString(), timeZone: timezone },
      end: { dateTime: end.toISOString(), timeZone: timezone },
      attendees,
      guestsCanModify: false,
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  });
  const meetUrl =
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video",
    )?.uri ||
    "";
  if (!meetUrl) throw new Error("Google Calendar did not create a Meet link");
  return { eventId: event.id, eventUrl: event.htmlLink, meetUrl };
}
