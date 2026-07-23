const signals = [
  { label: "INGEST", value: "24 sources", className: "ai-signal-one" },
  { label: "REASON", value: "Context ready", className: "ai-signal-two" },
  { label: "ACT", value: "Guardrails on", className: "ai-signal-three" },
];

export function AISystemVisual() {
  return (
    <div className="ai-system" data-hero-copy aria-label="Animated AI orchestration system">
      <div className="ai-system-topline">
        <span><i /> TATHYA AI ENGINE</span>
        <span>LIVE / 99.98%</span>
      </div>

      <div className="ai-orbit" aria-hidden="true">
        <div className="ai-orbit-ring ring-a" />
        <div className="ai-orbit-ring ring-b" />
        <div className="ai-orbit-ring ring-c" />
        <div className="ai-core">
          <span>AI</span>
          <small>CORE</small>
        </div>
        <span className="orbit-node node-a" />
        <span className="orbit-node node-b" />
        <span className="orbit-node node-c" />
      </div>

      <div className="ai-signal-list">
        {signals.map((signal, index) => (
          <div className={`ai-signal ${signal.className}`} key={signal.label}>
            <span className="signal-index">0{index + 1}</span>
            <span>
              <strong>{signal.label}</strong>
              <small>{signal.value}</small>
            </span>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className="ai-command">
        <span className="command-mark">›</span>
        <span>Systems grounded in trusted data</span>
        <span className="command-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
