import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(resolve(here, "config.json"), "utf8"));
const reportPaths = process.argv.slice(2).map((path) => resolve(path));

if (!process.env.SMTP_PASSWORD) {
  throw new Error("SMTP_PASSWORD is missing. Add it to the scheduled job environment.");
}

const missing = reportPaths.filter((path) => !existsSync(path));
if (missing.length) {
  throw new Error(`Report attachment not found: ${missing.join(", ")}`);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || "true") === "true",
  auth: {
    user: process.env.SMTP_USER || config.senderEmail,
    pass: process.env.SMTP_PASSWORD
  }
});

await transporter.verify();

const date = new Intl.DateTimeFormat("en-CA", {
  timeZone: config.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());

await transporter.sendMail({
  from: `TathyaForge Research <${config.senderEmail}>`,
  to: config.notificationEmail,
  subject: `TathyaForge opportunity report — ${date}`,
  text: [
    `The daily opportunity research run for ${date} is complete.`,
    "",
    "The attached report contains public-source evidence, estimated budgets, priority scores and recommended next actions.",
    "",
    "No prospect outreach was sent automatically."
  ].join("\n"),
  attachments: reportPaths.map((path) => ({
    filename: basename(path),
    path
  }))
});

console.log(`Report sent from ${config.senderEmail} to ${config.notificationEmail}`);
