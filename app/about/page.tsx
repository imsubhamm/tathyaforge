import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { values } from "@/lib/content";

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
            <h2 className="text-2xl font-semibold text-white">The name</h2>
            <p className="mt-4 leading-7 text-slate-300">
              &quot;Tathya&quot; means fact, truth, and data. &quot;Forge&quot; means to build,
              engineer, and create strong systems. Together, TathyaForge reflects
              the company&apos;s belief that durable technology starts with real facts
              and becomes valuable through disciplined engineering.
            </p>
            <p className="mt-5 leading-7 text-slate-300">
              The company is founder-led, which means clients work close to the
              engineering judgment behind the architecture, roadmap, delivery, and
              long-term maintainability of each system.
            </p>
          </div>
        </div>
        <div className="mt-16">
          <SectionHeader eyebrow="Values" title="How the work is shaped." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value) => (
              <article key={value} className="surface rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white">{value}</h3>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
