import { createHash, randomUUID } from "crypto";
import { appendFile, mkdir, readFile } from "fs/promises";
import path from "path";

export type AnalyticsEvent = {
  id: string;
  at: string;
  type: string;
  visitorId?: string;
  sessionId?: string;
  path?: string;
  referrer?: string;
  campaign?: string;
  source?: string;
  medium?: string;
  content?: string;
  timezone?: string;
  language?: string;
  device?: string;
  ipHash?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

const dataDirectory =
  process.env.ANALYTICS_DATA_DIR || path.join(process.cwd(), "data");
const analyticsFile = path.join(dataDirectory, "analytics.ndjson");

function clean(value: unknown, max = 300) {
  return typeof value === "string" ? value.trim().slice(0, max) : undefined;
}

export function hashIp(ip: string) {
  const salt = process.env.ANALYTICS_SALT || "tathyaforge-local-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 20);
}

export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function recordEvent(
  input: Partial<AnalyticsEvent> & Pick<AnalyticsEvent, "type">,
) {
  await mkdir(dataDirectory, { recursive: true });
  const event: AnalyticsEvent = {
    id: randomUUID(),
    at: new Date().toISOString(),
    type: clean(input.type, 60) || "unknown",
    visitorId: clean(input.visitorId, 80),
    sessionId: clean(input.sessionId, 80),
    path: clean(input.path, 500),
    referrer: clean(input.referrer, 500),
    campaign: clean(input.campaign, 120),
    source: clean(input.source, 120),
    medium: clean(input.medium, 120),
    content: clean(input.content, 160),
    timezone: clean(input.timezone, 100),
    language: clean(input.language, 40),
    device: clean(input.device, 40),
    ipHash: clean(input.ipHash, 40),
    metadata: input.metadata,
  };
  await appendFile(analyticsFile, `${JSON.stringify(event)}\n`, "utf8");
  return event;
}

export async function readEvents(limit = 20000) {
  try {
    const content = await readFile(analyticsFile, "utf8");
    return content
      .trim()
      .split("\n")
      .filter(Boolean)
      .slice(-limit)
      .map((line) => JSON.parse(line) as AnalyticsEvent);
  } catch {
    return [];
  }
}

