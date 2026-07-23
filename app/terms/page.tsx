import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms",
  description: "Website terms for TathyaForge.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Terms"
          title="Website Terms"
          description="This website describes TathyaForge services and example solution areas for prospective clients."
        />
        <div className="surface mt-10 max-w-3xl rounded-lg p-6 text-sm leading-7 text-slate-600 sm:p-8">
          <p>
            Website content is provided for general business information and does
            not create a client relationship by itself. Project scope, timelines,
            responsibilities, and commercial terms are agreed separately in writing.
          </p>
          <p className="mt-5">
            Solution blueprints shown on this website are examples of systems
            TathyaForge can shape and build. They are not presented as completed
            client case studies unless explicitly stated.
          </p>
          <p className="mt-5">
            For questions, email{" "}
            <a className="text-amber-700 hover:text-amber-800" href={`mailto:${company.email}`}>
              {company.email}
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
