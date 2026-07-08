"use client";

import { FormEvent } from "react";
import { projectInquiryHref } from "@/lib/content";

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

    window.location.href = `${projectInquiryHref}&body=${body}`;
  }

  const inputClass =
    "min-h-12 rounded-md border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300";

  return (
    <form onSubmit={handleSubmit} className="surface grid gap-4 rounded-lg p-5 sm:p-6">
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Name
        <input className={inputClass} name="name" type="text" autoComplete="name" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Email
        <input className={inputClass} name="email" type="email" autoComplete="email" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Company
        <input className={inputClass} name="company" type="text" autoComplete="organization" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Project Type
        <select className={inputClass} name="projectType" defaultValue="Data Engineering">
          <option>Data Engineering</option>
          <option>Azure / Fabric / Lakehouse</option>
          <option>OpenAI / LLM Automation</option>
          <option>Data Science / Machine Learning</option>
          <option>Prompt Engineering</option>
          <option>Multi-cloud Data Platform</option>
          <option>Dashboard & Reporting</option>
          <option>Custom ERP / SaaS</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-200">
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
        className="mt-2 min-h-12 rounded-md bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
      >
        Open Email Draft
      </button>
    </form>
  );
}
