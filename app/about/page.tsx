import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { company, values } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "TathyaForge is a founder-led engineering company focused on facts, systems, and business outcomes.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="About"
            title="Founder-led engineering focused on facts, systems, and outcomes."
            description="TathyaForge builds reliable data platforms, AI automation workflows, dashboards, and custom software for companies that need practical systems rather than presentation-only strategy."
          />
          <div className="surface rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">The name</h2>
            <p className="mt-4 leading-7 text-slate-600">
              &quot;Tathya&quot; means fact, truth, and data. &quot;Forge&quot; means to build,
              engineer, and create strong systems. Together, TathyaForge reflects
              the company&apos;s belief that durable technology starts with real facts
              and becomes valuable through disciplined engineering.
            </p>
            <p className="mt-5 leading-7 text-slate-600">
              The company is founder-led, which means clients work close to the
              engineering judgment behind the architecture, roadmap, delivery, and
              long-term maintainability of each system.
            </p>
          </div>
        </div>
        <section className="surface mt-16 rounded-xl p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start lg:gap-10">
            <div className="relative h-[100px] w-[100px] overflow-hidden rounded-2xl bg-slate-950 shadow-[0_18px_45px_rgba(15,23,42,.18)] ring-4 ring-white">
              <Image
                src="/subham-mondal.jpg"
                alt="Subham Mondal, founder of TathyaForge"
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                Meet the founder
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                Subham Mondal
              </h2>
              <p className="mt-2 font-medium text-slate-700">
                Founder, TathyaForge · Senior Data Engineer &amp; AI Consultant
              </p>
              <p className="mt-5 max-w-2xl leading-7 text-slate-600">
                Subham works across data engineering, cloud platforms, AI, and
                production software. His hands-on background includes Databricks,
                PySpark, Python, SQL, GenAI, Azure, and AWS—bringing enterprise
                engineering discipline to focused, founder-led delivery.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Verify on LinkedIn ↗
                </a>
                <span className="inline-flex min-h-11 items-center rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
                  Based in {company.location}
                </span>
              </div>
              <p className="mt-6 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">
                TathyaForge is an independent, founder-led technology studio.
                Professional background is linked for verification and does not
                imply endorsement or affiliation by any employer.
              </p>
            </div>
          </div>
        </section>
        <div className="mt-16">
          <SectionHeader eyebrow="Values" title="How the work is shaped." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value) => (
              <article key={value} className="surface rounded-lg p-5">
                <h3 className="text-lg font-semibold text-slate-950">{value}</h3>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
