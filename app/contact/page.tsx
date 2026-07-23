import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { company, projectInquiryHref } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TathyaForge to discuss data engineering, Azure, GCP, AWS, OpenAI, prompt engineering, data science, dashboards, cloud platforms, ERP, or SaaS development.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Contact"
              title="Tell us what you want to build."
              description="We'll help you shape the architecture, roadmap, and delivery plan."
            />
            <div className="mt-8 rounded-lg border border-slate-200 bg-white/75 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Email
              </p>
              <a
                href={`mailto:${company.email}`}
                className="mt-3 inline-block text-lg font-semibold text-slate-950 transition hover:text-amber-700"
              >
                {company.email}
              </a>
              <div className="mt-6">
                <ButtonLink href={projectInquiryHref}>Plan With Tathya AI</ButtonLink>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
