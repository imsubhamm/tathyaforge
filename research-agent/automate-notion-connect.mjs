import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PAGE =
  process.env.NOTION_PAGE_URL ||
  "https://app.notion.com/p/TathyaForge-Sales-HQ-3a728de2bf0180fd8c8cdfa4342badd4";
const USER_DATA = "/tmp/chrome-subham-ud";

async function ensureChrome() {
  try {
    const version = await fetch("http://127.0.0.1:9222/json/version").then((r) => r.json());
    return version;
  } catch {
    spawn(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      [
        "--remote-debugging-port=9222",
        "--remote-allow-origins=*",
        `--user-data-dir=${USER_DATA}`,
        "--profile-directory=Default",
        "--no-first-run",
        "--no-default-browser-check",
        PAGE,
      ],
      { detached: true, stdio: "ignore" },
    ).unref();
    for (let i = 0; i < 30; i++) {
      await sleep(1000);
      try {
        return await fetch("http://127.0.0.1:9222/json/version").then((r) => r.json());
      } catch {
        // retry
      }
    }
    throw new Error("Chrome CDP failed to start");
  }
}

async function clickText(page, re) {
  const loc = page.getByText(re).first();
  if ((await loc.count()) > 0) {
    await loc.click({ timeout: 4000 }).catch(() => {});
    return true;
  }
  return false;
}

const version = await ensureChrome();
const browser = await chromium.connectOverCDP(version.webSocketDebuggerUrl);
const context = browser.contexts()[0];
const page = context.pages().find((p) => /notion/i.test(p.url())) || (await context.newPage());
await page.bringToFront();
await page.goto(PAGE, { waitUntil: "domcontentloaded", timeout: 90000 });
await sleep(3500);
await page.keyboard.press("Escape");
await sleep(400);
await page.keyboard.press("Escape");

console.log(JSON.stringify({ step: "open", url: page.url() }));

// Prefer creating an in-page database via starter button, then connect integration to parent page.
const dbStarter = page.getByRole("button", { name: /^database$/i });
if ((await dbStarter.count()) > 0) {
  await dbStarter.first().click().catch(() => {});
  await sleep(2500);
  console.log(JSON.stringify({ step: "clicked_database_starter", url: page.url() }));
}

// Open Share panel
let openedShare = false;
for (const candidate of [
  page.getByRole("button", { name: /^share$/i }),
  page.locator('[aria-label="Share"]'),
  page.getByText(/^share$/i),
]) {
  if ((await candidate.count()) > 0) {
    await candidate.first().click({ timeout: 4000 }).catch(() => {});
    openedShare = true;
    break;
  }
}
await sleep(1200);
console.log(JSON.stringify({ step: "share", openedShare }));

// Connections area inside share popup / page menu
await clickText(page, /^connections$/i);
await clickText(page, /add connections|connect to|connections/i);
await sleep(1000);

// Search and connect tathya
const search = page.getByPlaceholder(/search/i).first();
if ((await search.count()) > 0) {
  await search.fill("tathya");
  await sleep(1200);
}

let connected = false;
if ((await page.getByText(/^tathya$/i).count()) > 0) {
  await page.getByText(/^tathya$/i).first().click();
  await sleep(1000);
  for (const name of [/connect/i, /confirm/i, /allow/i, /continue/i, /save/i]) {
    const btn = page.getByRole("button", { name });
    if ((await btn.count()) > 0) {
      await btn.first().click().catch(() => {});
      connected = true;
    }
  }
  connected = true;
}

await page.screenshot({ path: "/tmp/notion-connect-attempt.png", fullPage: false });
writeFileSync(
  "/tmp/notion-automation-status.json",
  JSON.stringify({ status: connected ? "connected" : "needs_connection", pageUrl: page.url(), connected }, null, 2),
);
console.log(JSON.stringify({ done: true, connected, url: page.url() }));
process.exit(connected ? 0 : 4);
