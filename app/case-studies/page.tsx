import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { caseStudyCards, projectInquiryHref } from "@/lib/content";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Explore selected TathyaForge product, ERP, SaaS, and automation builds with documented delivery scope.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="Selected work"
            title="Proof is in the system, not the adjectives."
            description="Three documented builds across construction ERP, creator SaaS, and data-led automation. Every figure below describes tracked implementation scope—never invented revenue or vanity metrics."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["148", "ERP workflow sections"],
              ["5+", "product revenue flows"],
              ["147", "validated lead records"],
            ].map(([value, label]) => (
              <div key={label} className="surface rounded-xl p-5">
                <strong className="text-3xl text-slate-950">{value}</strong>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="space-y-8">
            {caseStudyCards.map((card, index) => (
              <article
                key={card.title}
                className="surface overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="border-b border-slate-200 p-6 sm:p-9 lg:border-b-0 lg:border-r">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                      0{index + 1} / {card.eyebrow}
                    </p>
                    <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                      {card.title}
                    </h2>
                    <p className="mt-5 leading-7 text-slate-600">{card.summary}</p>

                    <div className="mt-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Business problem
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">{card.problem}</p>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {card.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50/70 p-6 sm:p-9">
                    <div className="grid grid-cols-3 gap-2">
                      {card.proof.map((metric) => (
                        <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
                          <strong className="block text-xl text-slate-950 sm:text-2xl">{metric.value}</strong>
                          <span className="mt-1 block text-[11px] leading-4 text-slate-500 sm:text-xs">
                            {metric.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Delivered system
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {card.delivered.map((item) => (
                          <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                            <span className="text-amber-600">✓</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        System flow
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-4">
                        {card.architecture.map((item, step) => (
                          <div key={item} className="relative rounded-lg bg-slate-950 p-3 text-white">
                            <span className="font-mono text-[10px] text-amber-400">0{step + 1}</span>
                            <p className="mt-2 text-xs leading-4">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-mono text-xs font-semibold text-slate-600">{card.outcome}</p>
                      <ButtonLink href={projectInquiryHref} variant="secondary">
                        Discuss This Build
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-slate-950 px-6 py-8 text-white sm:flex sm:items-center sm:justify-between sm:px-9">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-400">Your workflow / next</p>
              <h2 className="mt-3 text-2xl font-semibold">Bring the messy process. Leave with a build path.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                The project assistant will classify your need and book a 30-minute discovery call with a Google Meet link.
              </p>
            </div>
            <div className="mt-6 shrink-0 sm:mt-0 sm:pl-8">
              <ButtonLink href={projectInquiryHref}>Plan My Project</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
