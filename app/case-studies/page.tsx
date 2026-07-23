import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { caseStudyCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Explore selected TathyaForge product, ERP, and automation builds.",
  alternates: {
    canonical: "/case-studies",
  },
};

export default function CaseStudiesPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Selected work"
          title="Real systems, described without inflated claims."
          description="A selection of products and operational systems built across construction ERP, creator SaaS, and data-led automation. Metrics reflect the currently tracked project scope."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {caseStudyCards.map((card) => (
            <article key={card.title} className="surface rounded-lg p-6 sm:p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                {card.eyebrow}
              </p>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">{card.summary}</p>
              <p className="mt-6 border-y border-slate-200 py-4 font-mono text-xs font-semibold leading-5 text-slate-700">
                {card.outcome}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {card.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-7">
                <ButtonLink href="/contact" variant="secondary">
                  Build Something Similar
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
