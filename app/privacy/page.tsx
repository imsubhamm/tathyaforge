import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for TathyaForge inquiries and website visitors.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Privacy"
          title="Privacy Policy"
          description="TathyaForge only asks for the information needed to understand and respond to project inquiries."
        />
        <div className="surface mt-10 max-w-3xl rounded-lg p-6 text-sm leading-7 text-slate-600 sm:p-8">
          <p>
            If you contact TathyaForge, the details you provide may be used to
            respond to your inquiry, discuss project requirements, and prepare a
            relevant delivery plan.
          </p>
          <p className="mt-5">
            TathyaForge does not sell personal information. Project information
            shared during discovery is treated as confidential business context.
          </p>
          <p className="mt-5">
            The website records first-party usage information such as pages
            visited, campaign parameters, referring website, general device type,
            browser language, timezone, assistant activity, and meeting requests.
            Network addresses are stored only as a one-way shortened hash for
            basic unique-visit and abuse analysis.
          </p>
          <p className="mt-5">
            Outreach emails may contain a unique link and a small tracking image
            to estimate opens, clicks, and resulting website visits. Open counts
            are approximate because email applications may block images, preload
            them, or protect recipient privacy.
          </p>
          <p className="mt-5">
            For privacy questions, email{" "}
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
