import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { caseStudyCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Solution Blueprints",
  description:
    "Explore TathyaForge solution blueprints for construction ERP workflows, Azure, GCP, and AWS data platforms, data science, and AI-powered business automation.",
  alternates: {
    canonical: "/case-studies",
  },
};

export default function CaseStudiesPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Case studies"
          title="Solution blueprints, without invented claims."
          description="These cards describe example solution areas TathyaForge can architect and build. They are intentionally framed as blueprints, not completed client case studies."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {caseStudyCards.map((card) => (
            <article key={card.title} className="surface rounded-lg p-6 sm:p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                {card.eyebrow}
              </p>
              <h2 className="mt-5 text-2xl font-semibold text-white">{card.title}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">{card.summary}</p>
              <div className="mt-7">
                <ButtonLink href="/contact" variant="secondary">
                  Discuss This Area
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
