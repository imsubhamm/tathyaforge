import { access, readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const runsDirectory = resolve(here, "runs");
const requiredFields = [
  "business", "city", "state", "industry", "problem", "currentSolution",
  "solution", "budgetLow", "budgetHigh", "budgetReason", "confidence",
  "priority", "sourceUrl", "sourceClaim"
];

const runDates = (await readdir(runsDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
  .map((entry) => entry.name)
  .sort()
  .reverse();

let runDate;
let runDirectory;
for (const candidate of runDates) {
  const directory = resolve(runsDirectory, candidate);
  try {
    await access(resolve(directory, "leads.json"));
    runDate = candidate;
    runDirectory = directory;
    break;
  } catch {
    // Ignore incomplete folders.
  }
}

if (!runDate || !runDirectory) {
  throw new Error("No complete research run with leads.json was found.");
}

const leads = JSON.parse(await readFile(resolve(runDirectory, "leads.json"), "utf8"));
if (!Array.isArray(leads) || leads.length === 0 || leads.length > 20) {
  throw new Error(`Expected 1–20 qualified leads, received ${leads.length}.`);
}

const names = new Set();
let demos = 0;
for (const [index, lead] of leads.entries()) {
  const missing = requiredFields.filter((field) => lead[field] === undefined || lead[field] === "");
  if (missing.length) {
    throw new Error(`Lead ${index + 1} is missing: ${missing.join(", ")}`);
  }
  const normalized = String(lead.business).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (names.has(normalized)) throw new Error(`Duplicate business: ${lead.business}`);
  names.add(normalized);
  if (!["P1", "P2", "P3"].includes(lead.priority)) {
    throw new Error(`Invalid priority for ${lead.business}: ${lead.priority}`);
  }
  if (lead.budgetLow > lead.budgetHigh) {
    throw new Error(`Budget range is inverted for ${lead.business}.`);
  }
  if (lead.demoPath) {
    await access(resolve(runDirectory, lead.demoPath));
    demos += 1;
  }
}

if (demos > 5) throw new Error(`Expected no more than five demos, received ${demos}.`);

console.log(JSON.stringify({
  ok: true,
  runDate,
  qualifiedLeads: leads.length,
  demos,
  priorities: {
    P1: leads.filter((lead) => lead.priority === "P1").length,
    P2: leads.filter((lead) => lead.priority === "P2").length,
    P3: leads.filter((lead) => lead.priority === "P3").length
  }
}, null, 2));
