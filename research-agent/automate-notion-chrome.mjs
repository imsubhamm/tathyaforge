import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const PAGE_TITLE = "TathyaForge Sales HQ";

function log(obj) {
  console.log(JSON.stringify(obj));
}

async function clickFirst(page, locator) {
  try {
    if ((await locator.count()) > 0) {
      await locator.first().click({ timeout: 3000 });
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

const version = await fetch("http://127.0.0.1:9222/json/version").then((r) => r.json());
const browser = await chromium.connectOverCDP(version.webSocketDebuggerUrl);
const context = browser.contexts()[0];
const page = context.pages().find((p) => /notion/i.test(p.url())) || (await context.newPage());
await page.bringToFront();

// Use app host directly (session cookies are on .app.notion.com)
await page.goto("https://www.notion.so/login", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(1500);
await page.goto("https://www.notion.so", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
log({ step: "after_home", url: page.url() });

// Prefer opening workspace via "Open Notion" / workspace entry if present
await clickFirst(page, page.getByRole("link", { name: /open notion|workspaces|mail to|continue/i }));
await page.waitForTimeout(2000);

await page.goto("https://www.notion.so/new", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(5000);
log({ step: "after_new", url: page.url() });

if (/login/i.test(page.url()) || page.url().includes("notion.com/") && !page.url().includes("app.notion.com")) {
  await clickFirst(page, page.getByRole("button", { name: /continue with google|google/i }));
  await clickFirst(page, page.getByRole("link", { name: /log in/i }));
  writeFileSync(
    "/tmp/notion-automation-status.json",
    JSON.stringify(
      {
        status: "needs_login_in_subham_window",
        url: page.url(),
        hint: "In the open Subham Chrome window, finish Notion login once. Then say continue.",
      },
      null,
      2,
    ),
  );
  log({ status: "needs_login", url: page.url() });
  process.exit(3);
}

// Clear default title and type ours
await page.keyboard.press("Meta+A").catch(() => {});
await page.keyboard.type(PAGE_TITLE, { delay: 15 });
await page.keyboard.press("Enter");
await page.waitForTimeout(2500);
const pageUrl = page.url();
log({ step: "titled", pageUrl });

// Try Share -> Add connections
await clickFirst(page, page.getByRole("button", { name: /^share$/i }));
await page.waitForTimeout(800);
await clickFirst(page, page.getByText(/connections|add connections|connect to/i));
await page.waitForTimeout(800);

// ••• fallback
await clickFirst(page, page.locator('button[aria-label*="More"], button[aria-label*="more"]').first());
await clickFirst(page, page.getByRole("button", { name: /more/i }));
await page.waitForTimeout(600);
await clickFirst(page, page.getByText(/^connections$/i));
await page.waitForTimeout(1000);

const search = page.getByPlaceholder(/search/i).first();
if ((await search.count()) > 0) {
  await search.fill("tathya");
  await page.waitForTimeout(1200);
}

let connected = false;
if ((await page.getByText(/^tathya$/i).count()) > 0) {
  await page.getByText(/^tathya$/i).first().click();
  await page.waitForTimeout(1000);
  await clickFirst(page, page.getByRole("button", { name: /connect|confirm|allow|continue|save/i }));
  connected = true;
}

const buttons = (await page.locator("button, [role='menuitem']").allTextContents().catch(() => []))
  .map((t) => t.trim())
  .filter(Boolean)
  .slice(0, 50);

writeFileSync(
  "/tmp/notion-automation-status.json",
  JSON.stringify({ status: connected ? "connected" : "page_ready_needs_connection", pageUrl, connected, buttons }, null, 2),
);
log({ done: true, pageUrl, connected, buttonSample: buttons.slice(0, 15) });
process.exit(connected ? 0 : 4);
