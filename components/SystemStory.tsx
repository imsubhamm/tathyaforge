import { Container } from "@/components/Container";

const stages = [
  {
    number: "01",
    label: "Connect",
    title: "Every signal enters one trusted system.",
    copy: "Cloud platforms, operational tools, documents, and live events become governed, observable data.",
    metrics: ["24 sources", "99.98% healthy", "Quality enforced"],
    nodes: ["Azure", "GCP", "AWS", "ERP"],
  },
  {
    number: "02",
    label: "Reason",
    title: "Context becomes intelligence.",
    copy: "Models, agents, and analytics reason over business context with evaluation, guardrails, and human review.",
    metrics: ["RAG grounded", "Eval passed", "Human in loop"],
    nodes: ["LLMs", "Agents", "Analytics", "Rules"],
  },
  {
    number: "03",
    label: "Act",
    title: "Intelligence moves the business.",
    copy: "Decisions flow into dashboards, products, approvals, and automated operations—with control intact.",
    metrics: ["Actions routed", "Audit ready", "Teams aligned"],
    nodes: ["Workflow", "SaaS", "BI", "Alerts"],
  },
];

export function SystemStory() {
  return (
    <section className="system-story" data-camera-story>
      <div className="camera-stage">
        <Container>
          <div className="camera-layout">
            <div className="camera-copy">
              <p className="story-kicker">The intelligence pipeline</p>
              <h2>A system that moves from facts to action.</h2>
              <p className="camera-intro">
                Scroll through the architecture TathyaForge builds for modern
                AI-driven companies.
              </p>
              <div className="camera-progress" aria-hidden="true">
                <span data-camera-progress />
              </div>
              <div className="camera-step-labels" aria-hidden="true">
                {stages.map((stage) => (
                  <span key={stage.number}>{stage.number} / {stage.label}</span>
                ))}
              </div>
            </div>

            <div className="camera-world" data-camera-world>
              <div className="camera-grid" aria-hidden="true" />
              <div className="camera-glow" aria-hidden="true" />

              {stages.map((stage, index) => (
                <article
                  className={`camera-panel camera-panel-${index + 1}`}
                  data-camera-panel={index + 1}
                  key={stage.number}
                >
                  <div className="panel-bar">
                    <span>{stage.number}</span>
                    <strong>{stage.label}</strong>
                    <i>LIVE</i>
                  </div>
                  <div className="panel-body">
                    <div>
                      <p className="panel-system-label">TATHYA SYSTEM / {stage.number}</p>
                      <h3>{stage.title}</h3>
                      <p>{stage.copy}</p>
                    </div>
                    <div className="panel-orbit" aria-hidden="true">
                      <span className="panel-core">{stage.number}</span>
                      {stage.nodes.map((node, nodeIndex) => (
                        <span className={`panel-node panel-node-${nodeIndex + 1}`} key={node}>
                          {node}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="panel-metrics">
                    {stage.metrics.map((metric) => <span key={metric}>{metric}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
