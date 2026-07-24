"use client";

import { FormEvent } from "react";
import { company } from "@/lib/content";

export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = encodeURIComponent(
      [
        `Name: ${form.get("name") ?? ""}`,
        `Email: ${form.get("email") ?? ""}`,
        `Company: ${form.get("company") ?? ""}`,
        `Project Type: ${form.get("projectType") ?? ""}`,
        "",
        `${form.get("message") ?? ""}`,
      ].join("\n"),
    );

    window.location.href = `mailto:${company.email}?subject=Project%20Inquiry%20for%20TathyaForge&body=${body}`;
  }

  const inputClass =
    "min-h-12 rounded-md border border-slate-300 bg-white/90 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10";

  return (
    <form onSubmit={handleSubmit} className="surface grid gap-4 rounded-lg p-5 sm:p-6">
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Name
        <input className={inputClass} name="name" type="text" autoComplete="name" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Email
        <input className={inputClass} name="email" type="email" autoComplete="email" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Company
        <input className={inputClass} name="company" type="text" autoComplete="organization" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Project Type
        <select className={inputClass} name="projectType" defaultValue="Data Engineering">
          <option>Data Engineering</option>
          <option>Azure / GCP / AWS / Lakehouse</option>
          <option>OpenAI / LLM Automation</option>
          <option>Data Science / Machine Learning</option>
          <option>Prompt Engineering</option>
          <option>Multi-cloud Data Platform</option>
          <option>Dashboard & Reporting</option>
          <option>Custom ERP / SaaS</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Message
        <textarea
          className={`${inputClass} min-h-36 resize-y`}
          name="message"
          required
          placeholder="Tell us about the workflow, data platform, AI automation, dashboard, data science, or software system you want to build."
        />
      </label>
      <button
        type="submit"
        className="mt-2 min-h-12 rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
      >
        Open Email Draft
      </button>
    </form>
  );
}
