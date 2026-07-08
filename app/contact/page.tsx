import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { company, projectInquiryHref } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TathyaForge to discuss data engineering, Azure, Fabric, OpenAI, prompt engineering, data science, dashboards, cloud platforms, ERP, or SaaS development.",
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
            <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Email
              </p>
              <a
                href={`mailto:${company.email}`}
                className="mt-3 inline-block text-lg font-semibold text-white transition hover:text-amber-300"
              >
                {company.email}
              </a>
              <div className="mt-6">
                <a
                  href={projectInquiryHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                >
                  Email TathyaForge
                </a>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
