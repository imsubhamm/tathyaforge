"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/components/AnalyticsTracker";

type Step = "need" | "offer" | "identity" | "time" | "done";

function interpretNeed(need: string) {
  const value = need.toLowerCase();
  if (/(erp|inventory|procurement|approval|workflow|operations)/.test(value)) {
    return {
      category: "ERP & workflow automation",
      response:
        "This sounds like an operational system where roles, approvals, and reliable handoffs matter.",
    };
  }
  if (/(data|pipeline|warehouse|lake|databricks|azure|aws|gcp|dashboard)/.test(value)) {
    return {
      category: "Data & cloud platform",
      response:
        "This sounds like a data foundation or reporting problem that needs clearer architecture and trusted delivery.",
    };
  }
  if (/(ai|agent|llm|openai|rag|document|automation)/.test(value)) {
    return {
      category: "AI & automation",
      response:
        "This looks like an AI automation opportunity where accuracy, guardrails, and human review should be designed together.",
    };
  }
  if (/(app|saas|mvp|portal|website|product)/.test(value)) {
    return {
      category: "Custom product build",
      response:
        "This sounds like a custom product build that would benefit from a focused first release and a clear scale-up path.",
    };
  }
  return {
    category: "Project discovery",
    response:
      "This is worth a short architecture conversation so the users, workflow, risks, and right first release can be clarified.",
  };
}

export function ClientAssistant() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("need");
  const [need, setNeed] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:00");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const interpretation = useMemo(() => interpretNeed(need), [need]);
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );
  const [minDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().slice(0, 10);
  });

  useEffect(() => {
    const openFromCta = () => {
      setOpen(true);
      trackEvent("assistant_open", { path: window.location.pathname, content: "primary_cta" });
    };
    window.addEventListener("tathya:open-assistant", openFromCta);
    return () => window.removeEventListener("tathya:open-assistant", openFromCta);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) trackEvent("assistant_open", { path: window.location.pathname });
  };

  const submitNeed = (event: FormEvent) => {
    event.preventDefault();
    if (need.trim().length < 10) return;
    trackEvent("assistant_need", {
      path: window.location.pathname,
      content: interpretation.category,
    });
    setStep("offer");
  };

  const submitIdentity = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setStep("time");
  };

  const submitMeeting = async (event: FormEvent) => {
    event.preventDefault();
    if (!date || !time) return;
    setLoading(true);
    setMessage("");
    try {
      const start = new Date(`${date}T${time}:00`).toISOString();
      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          need,
          category: interpretation.category,
          start,
          timezone,
          duration: 30,
          website: "",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage(result.message);
      setStep("done");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Please email hello@tathyaforge.in to arrange the meeting.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="client-assistant"
        className="assistant-launcher"
      >
        <span className="assistant-status" aria-hidden="true" />
        {open ? "Close" : "Ask Tathya AI"}
      </button>

      <aside
        id="client-assistant"
        className={`assistant-panel ${open ? "is-open" : ""}`}
        aria-label="TathyaForge project assistant"
        aria-hidden={!open}
      >
        <div className="assistant-header">
          <div>
            <span>TATHYA AI / PROJECT CONCIERGE</span>
            <strong>Let&apos;s shape what you need.</strong>
          </div>
          <button type="button" onClick={toggle} aria-label="Close assistant">
            ×
          </button>
        </div>

        <div className="assistant-body" aria-live="polite">
          <div className="assistant-message">
            Tell me what you want to build or improve. I&apos;ll identify the
            likely project path and help arrange a conversation with Subham.
          </div>

          {step === "need" && (
            <form onSubmit={submitNeed} className="assistant-form">
              <label>
                What do you need?
                <textarea
                  value={need}
                  onChange={(event) => setNeed(event.target.value)}
                  placeholder="Example: We need to automate document approvals and reporting across our operations."
                  required
                  minLength={10}
                />
              </label>
              <button type="submit">Interpret my project →</button>
            </form>
          )}

          {step !== "need" && (
            <div className="assistant-message assistant-message-user">{need}</div>
          )}

          {step === "offer" && (
            <>
              <div className="assistant-message">
                <span className="assistant-category">{interpretation.category}</span>
                {interpretation.response}
                <strong> Would you like to book a 30-minute discovery meeting?</strong>
              </div>
              <div className="assistant-actions">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("assistant_schedule_intent", {
                      content: interpretation.category,
                    });
                    setStep("identity");
                  }}
                >
                  Yes, find a time
                </button>
                <a href={`mailto:hello@tathyaforge.in?subject=${encodeURIComponent(interpretation.category)}`}>
                  I&apos;ll email instead
                </a>
              </div>
            </>
          )}

          {step === "identity" && (
            <form onSubmit={submitIdentity} className="assistant-form">
              <label>
                Your name
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                Work email
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                />
              </label>
              <button type="submit">Choose availability →</button>
            </form>
          )}

          {step === "time" && (
            <form onSubmit={submitMeeting} className="assistant-form">
              <label>
                Preferred date
                <input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </label>
              <label>
                Preferred time
                <select value={time} onChange={(event) => setTime(event.target.value)}>
                  {["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map(
                    (slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <p className="assistant-timezone">Timezone: {timezone}</p>
              <button type="submit" disabled={loading}>
                {loading ? "Scheduling…" : "Request meeting →"}
              </button>
              {message && <p className="assistant-error">{message}</p>}
            </form>
          )}

          {step === "done" && (
            <div className="assistant-message assistant-success">
              <strong>Request received.</strong>
              {message}
              <button
                type="button"
                onClick={() => {
                  setStep("need");
                  setNeed("");
                  setMessage("");
                }}
              >
                Start another conversation
              </button>
            </div>
          )}
        </div>
        <p className="assistant-privacy">
          Your details are used only to respond to this project request.
        </p>
      </aside>
    </>
  );
}
