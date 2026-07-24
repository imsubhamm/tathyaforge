export const ADMIN_SESSION_COOKIE = "tf_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.RESEARCH_DASHBOARD_KEY ||
    process.env.ANALYTICS_ADMIN_KEY ||
    "tathyaforge-dev-session"
  );
}

export function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@tathyaforge.in").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

export function verifyAdminCredentials(email: string, password: string) {
  const expected = adminCredentials();
  return (
    email.trim().toLowerCase() === expected.email && password === expected.password
  );
}

type SessionPayload = {
  email: string;
  exp: number;
};

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const value of view) binary += String.fromCharCode(value);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToBase64Url(signature);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function createAdminSessionToken(email: string) {
  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${await sign(body)}`;
}

export async function readAdminSessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = await sign(body);
  if (!safeEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as SessionPayload;
    if (!payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.email !== adminCredentials().email) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function hasValidAdminSessionFromRequest(request: {
  cookies: { get: (name: string) => { value: string } | undefined };
  headers: { get: (name: string) => string | null };
}) {
  const cookieToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await readAdminSessionToken(cookieToken)) return true;

  const researchKey = request.headers.get("x-research-key");
  const analyticsKey = request.headers.get("x-analytics-key");
  const expectedResearch = process.env.RESEARCH_DASHBOARD_KEY || process.env.ANALYTICS_ADMIN_KEY;
  const expectedAnalytics = process.env.ANALYTICS_ADMIN_KEY;
  if (expectedResearch && researchKey === expectedResearch) return true;
  if (expectedAnalytics && analyticsKey === expectedAnalytics) return true;
  return false;
}
