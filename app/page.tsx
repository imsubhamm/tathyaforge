import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";
import { ProcessStep } from "@/components/ProcessStep";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { TechStack } from "@/components/TechStack";
import { DataEngine } from "@/components/DataEngine";
import { AISystemVisual } from "@/components/AISystemVisual";
import { SystemStory } from "@/components/SystemStory";
import {
  faqs,
  howWeWork,
  processSteps,
  projectInquiryHref,
  serviceChips,
  services,
  solutionBlueprints,
  whoWeHelp,
} from "@/lib/content";

export default function Home() {
  return (
    <>
      <section data-hero className="hero-texture relative flex min-h-[calc(100svh-68px)] items-center overflow-hidden py-16 sm:py-20">
        <DataEngine />
        <Container>
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
            <div className="hero-copy">
              <p data-hero-copy className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                TathyaForge
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                <span className="hero-line"><span data-hero-reveal>Data & AI systems</span></span>
                <span className="hero-line"><span data-hero-reveal className="text-gradient">engineered from facts.</span></span>
              </h1>
              <p data-hero-copy className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                We build reliable data platforms, AI automation workflows,
                dashboards, and custom software that help teams move from scattered
                processes to scalable systems.
              </p>
              <div data-hero-copy className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={projectInquiryHref}>Start Your Project</ButtonLink>
                <ButtonLink href="/services" variant="secondary">
                  Explore Services
                </ButtonLink>
              </div>
              <div data-hero-copy className="mt-8 flex flex-wrap gap-2.5">
                {serviceChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p
                data-hero-copy
                className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
              >
                Founder-led delivery&nbsp;&nbsp;•&nbsp;&nbsp; Weekly working
                updates&nbsp;&nbsp;•&nbsp;&nbsp; Documentation included
              </p>
            </div>
            <div className="w-full min-w-0">
              <AISystemVisual />
            </div>
          </div>
        </Container>
        <div data-hero-copy className="scroll-cue" aria-hidden="true"><span /> Scroll to explore</div>
      </section>

      <SystemStory />

      <section className="border-b border-slate-200/80 bg-white/35 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="The engagement standard"
              title="No black box. You see the system take shape."
              description="A strong technical partner should reduce uncertainty from the first week—not ask you to wait until the end to find out what was built."
            />
            <div data-stagger className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Start with clarity",
                  copy: "Architecture, risks, scope, and the delivery path are made visible before build decisions harden.",
                },
                {
                  step: "02",
                  title: "See working progress",
                  copy: "You get regular working increments and clear decisions—not presentation-only status updates.",
                },
                {
                  step: "03",
                  title: "Own the outcome",
                  copy: "Maintainable code, practical documentation, handover, and a clear support path are part of delivery.",
                },
              ].map((item) => (
                <article key={item.step} className="surface rounded-xl p-6">
                  <span className="font-mono text-xs font-semibold text-amber-700">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Services"
            title="Production-ready systems for data, AI, analytics, and operations."
            description="TathyaForge helps teams replace fragile manual processes with reliable platforms, automations, dashboards, and internal software that can be supported after launch."
          />
          <div data-stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="How we work"
            title="A calm delivery rhythm from first architecture decision to handover."
            description="The work stays structured and visible, so you understand what is being built, why it matters, and what is coming next."
          />
          <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {howWeWork.map((item) => (
              <article key={item} className="surface rounded-lg p-5">
                <div className="mb-4 h-1 w-10 rounded-full bg-amber-500" />
                <h3 className="text-base font-semibold leading-6 text-slate-950">{item}</h3>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Who we help"
              title="For teams that need clarity, not another generic software pitch."
              description="The best projects start with a real operational bottleneck: manual reporting, disconnected data, slow approvals, or a product idea that needs a disciplined first build."
            />
            <div data-stagger className="grid gap-4 sm:grid-cols-2">
              {whoWeHelp.map((item) => (
                <article key={item} className="surface rounded-lg p-5">
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Why TathyaForge"
              title="Built with ownership from architecture to launch."
              description="You get a practical delivery partner who cares about the business workflow, the quality of the architecture, and whether the system will still make sense after the first launch."
            />
            <div data-stagger className="grid gap-4 sm:grid-cols-2">
              {[
                "Clear architecture before build decisions harden",
                "Systems designed around business operations",
                "Delivery with direct founder-level accountability",
                "Maintainable code, documentation, and support paths",
              ].map((point) => (
                <div key={point} className="surface rounded-lg p-5">
                  <p className="text-sm leading-6 text-slate-700">{point}</p>
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
          <ol data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
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
          <div data-stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutionBlueprints.map((blueprint) => (
              <article key={blueprint.title} className="surface rounded-lg p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Blueprint
                </p>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{blueprint.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{blueprint.summary}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div data-reveal className="surface rounded-xl p-8 sm:p-10">
            <SectionHeader
              eyebrow="Founder-led"
              title="Senior attention stays close to the work."
              description="TathyaForge is intentionally founder-led. You work directly with someone who can understand the business problem, challenge the scope when needed, make practical architecture decisions, and keep delivery focused on the system your team actually needs."
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
            <div data-stagger><TechStack /></div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="FAQ"
            title="Straight answers before the first call."
          />
          <div data-stagger className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="surface rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <CTASection
          title="Have a data, AI, or software idea? Let's forge it into a real system."
          buttonLabel="Discuss Your Project"
          href={projectInquiryHref}
        />
      </Container>
    </>
  );
}
