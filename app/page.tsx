import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";
import { ProcessStep } from "@/components/ProcessStep";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { TechStack } from "@/components/TechStack";
import {
  blueprints,
  processSteps,
  serviceChips,
  services,
} from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
                TathyaForge
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Data & AI systems engineered from facts.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                We design and build reliable data platforms, AI automation workflows,
                data science solutions, dashboards, and custom business software for
                teams that need clarity, speed, and scale.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact">Start a Project</ButtonLink>
                <ButtonLink href="/services" variant="secondary">
                  Explore Services
                </ButtonLink>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                {serviceChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-slate-700/80 bg-slate-950/50 px-3 py-2 text-sm text-slate-200"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="surface rounded-lg p-6 sm:p-8">
              <div className="accent-line mb-8 h-px w-full" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Engineering focus
              </p>
              <div className="mt-6 grid gap-4">
                {[
                  "Trusted Azure, Fabric, and multi-cloud data foundations",
                  "OpenAI, LLM, and prompt-engineered workflows for operations",
                  "Business workflows translated into maintainable software",
                  "Analytics, data science, and reporting layers built for decisions",
                ].map((item) => (
                  <div key={item} className="rounded-md border border-slate-800 bg-slate-950/55 p-4">
                    <p className="text-base font-medium leading-7 text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Services"
            title="Production-ready systems for data, AI, analytics, and operations."
            description="TathyaForge works where business workflows meet engineering depth: pipelines, Azure and Fabric platforms, lakehouses, data science workflows, dashboards, automations, and custom platforms."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Why TathyaForge"
              title="Built with ownership from architecture to launch."
              description="Clients get practical engineering, clean architecture, business-first delivery, ownership, and long-term maintainability."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Clear architecture before build decisions harden",
                "Systems designed around business operations",
                "Delivery with direct founder-level accountability",
                "Maintainable code, documentation, and support paths",
              ].map((point) => (
                <div key={point} className="surface rounded-lg p-5">
                  <p className="text-sm leading-6 text-slate-200">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Process"
            title="A delivery path that stays grounded in facts."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {processSteps.map((step, index) => (
              <ProcessStep key={step} label={step} index={index} />
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Solution blueprints"
            title="Common systems TathyaForge can shape and build."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {blueprints.map((blueprint) => (
              <article key={blueprint} className="surface rounded-lg p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
                  Blueprint
                </p>
                <h3 className="mt-5 text-xl font-semibold text-white">{blueprint}</h3>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="surface rounded-lg p-8 sm:p-10">
            <SectionHeader
              eyebrow="Founder-led"
              title="Work directly with an experienced data engineering professional."
              description="TathyaForge is designed for teams that want senior judgment close to the work. Clients work directly with a professional who understands enterprise delivery, Azure, Fabric, Databricks, OpenAI, multi-cloud platforms, data architecture, and business workflows."
            />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Tech stack"
            title="Modern tools for durable business systems."
          />
          <div className="mt-10">
            <TechStack />
          </div>
        </Container>
      </section>

      <Container>
        <CTASection
          title="Have a data, AI, or software idea? Let's forge it into a real system."
          buttonLabel="Email Us"
          href="mailto:hello@tathyaforge.in"
        />
      </Container>
    </>
  );
}
