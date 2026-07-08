import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { detailedServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Data engineering, Azure, Microsoft Fabric, Databricks, OpenAI, data science, AI automation, dashboards, and custom ERP/SaaS development services from TathyaForge.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Services"
          title="Engineering services for data-driven businesses."
          description="From raw business facts to reliable Azure, Fabric, multi-cloud, OpenAI, data science, automation, dashboard, and custom software systems, TathyaForge helps teams turn operational complexity into production systems."
        />
        <div className="mt-12 grid gap-6">
          {detailedServices.map((service) => (
            <article key={service.title} className="surface rounded-lg p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
                  <div className="mt-6">
                    <ButtonLink href="/contact">Contact TathyaForge</ButtonLink>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  <ServiceList title="What we build" items={service.builds} />
                  <ServiceList title="Problems solved" items={service.problems} />
                  <ServiceList title="Deliverables" items={service.deliverables} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ServiceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
