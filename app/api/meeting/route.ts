import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, hashIp, recordEvent } from "@/lib/analytics";

export const runtime = "nodejs";

const ownerRecipients = [
  "imsubhamrk@outlook.com",
  "hellow@tathyaforge.in",
];
const meetingAttempts = new Map<string, number[]>();

function text(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] || character,
  );
}

function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function calendarInvite({
  uid,
  start,
  end,
  name,
  email,
  need,
  organizer,
}: {
  uid: string;
  start: Date;
  end: Date;
  name: string;
  email: string;
  need: string;
  organizer: string;
}) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TathyaForge//Project Discovery//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    "SUMMARY:TathyaForge project discovery",
    `DESCRIPTION:${escapeIcs(`Project need: ${need}`)}`,
    `ORGANIZER;CN=TathyaForge:mailto:${organizer}`,
    `ATTENDEE;CN=${escapeIcs(name)};RSVP=TRUE:mailto:${email}`,
    ...ownerRecipients.map(
      (owner) => `ATTENDEE;RSVP=TRUE:mailto:${owner}`,
    ),
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (text(body.website)) {
      return NextResponse.json({ ok: true });
    }

    const ipHash = hashIp(clientIp(request.headers));
    const now = Date.now();
    const recentAttempts = (meetingAttempts.get(ipHash) || []).filter(
      (attempt) => now - attempt < 60 * 60 * 1000,
    );
    if (recentAttempts.length >= 5) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please email us directly." },
        { status: 429 },
      );
    }
    meetingAttempts.set(ipHash, [...recentAttempts, now]);

    const name = text(body.name, 100);
    const email = text(body.email, 180).toLowerCase();
    const need = text(body.need, 2000);
    const category = text(body.category, 100);
    const timezone = text(body.timezone, 100);
    const start = new Date(text(body.start, 80));
    const duration = Math.min(Math.max(Number(body.duration) || 30, 15), 60);

    if (
      name.length < 2 ||
      !validEmail(email) ||
      need.length < 10 ||
      Number.isNaN(start.getTime()) ||
      start.getTime() < Date.now() + 30 * 60 * 1000
    ) {
      return NextResponse.json(
        { ok: false, error: "Please provide valid meeting details." },
        { status: 400 },
      );
    }

    const end = new Date(start.getTime() + duration * 60 * 1000);
    const event = await recordEvent({
      type: "meeting_request",
      timezone,
      ipHash,
      metadata: {
        name,
        email,
        need,
        category,
        start: start.toISOString(),
        duration,
      },
    });

    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    if (!smtpUser || !smtpPassword) {
      return NextResponse.json({
        ok: true,
        emailed: false,
        requestId: event.id,
        message:
          "Your preferred time has been recorded. Subham will confirm it by email shortly.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== "false",
      auth: { user: smtpUser, pass: smtpPassword },
    });
    const uid = `${randomUUID()}@tathyaforge.in`;
    const invite = calendarInvite({
      uid,
      start,
      end,
      name,
      email,
      need,
      organizer: smtpUser,
    });

    await transporter.sendMail({
      from: `"TathyaForge" <${smtpUser}>`,
      to: email,
      bcc: ownerRecipients,
      replyTo: ownerRecipients[0],
      subject: `Meeting request confirmed — ${name} × TathyaForge`,
      text: [
        `Hi ${name},`,
        "",
        "Your TathyaForge project discovery request has been received.",
        `Preferred time: ${start.toISOString()} (${timezone})`,
        `Project: ${need}`,
        "",
        "A calendar invitation is attached. Subham will reply if the time needs adjustment.",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.6">
          <h2>Project discovery request received</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Your preferred meeting time has been recorded.</p>
          <p><strong>Time:</strong> ${start.toISOString()} (${timezone})<br>
          <strong>Project:</strong> ${escapeHtml(need)}</p>
          <p>A calendar invitation is attached. Subham will reply if the time needs adjustment.</p>
          <p>— TathyaForge</p>
        </div>`,
      icalEvent: {
        filename: "tathyaforge-discovery.ics",
        method: "REQUEST",
        content: invite,
      },
    });

    return NextResponse.json({
      ok: true,
      emailed: true,
      requestId: event.id,
      message:
        "Your meeting request and calendar invitation have been emailed to everyone.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to save the request right now." },
      { status: 500 },
    );
  }
}
