import { Container } from "@/components/Container";

const stages = [
  {
    number: "01",
    label: "Connect",
    title: "Bring every signal into view.",
    copy: "Cloud systems, documents, events, and operational data enter one governed intelligence layer.",
    tags: ["Pipelines", "Cloud", "Quality"],
  },
  {
    number: "02",
    label: "Reason",
    title: "Turn context into intelligence.",
    copy: "Models, agents, and analytics reason over trusted business context—with evaluation and human review built in.",
    tags: ["LLMs", "RAG", "Analytics"],
  },
  {
    number: "03",
    label: "Act",
    title: "Move the business forward.",
    copy: "Insights become controlled actions across workflows, dashboards, products, and internal operations.",
    tags: ["Automation", "SaaS", "Decisions"],
  },
];

export function SystemStory() {
  return (
    <section className="system-story py-20 sm:py-28" data-story>
      <Container>
        <div className="story-intro" data-reveal>
          <p className="story-kicker">One connected intelligence system</p>
          <h2>From raw signal to reliable action.</h2>
          <p>
            TathyaForge engineers the complete path—so AI is not a demo sitting
            beside your business, but a dependable system working inside it.
          </p>
        </div>

        <div className="story-track" data-story-track>
          <div className="story-line" aria-hidden="true"><span data-story-line /></div>
          {stages.map((stage) => (
            <article className="story-node" key={stage.number}>
              <div className="story-node-head">
                <span>{stage.number}</span>
                <i aria-hidden="true" />
                <strong>{stage.label}</strong>
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.copy}</p>
              <div className="story-tags">
                {stage.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
