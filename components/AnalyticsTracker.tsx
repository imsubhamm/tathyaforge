"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type TrackPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(type: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  let visitorId = localStorage.getItem("tf_visitor_id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("tf_visitor_id", visitorId);
  }
  let sessionId = sessionStorage.getItem("tf_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("tf_session_id", sessionId);
  }
  const body = JSON.stringify({ type, visitorId, sessionId, ...payload });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", body);
  } else {
    fetch("/api/track", {
      method: "POST",
      body,
      keepalive: true,
    }).catch(() => undefined);
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    trackEvent("page_view", {
      path: pathname,
      referrer: document.referrer || "",
      source: params.get("utm_source") || (document.referrer ? "referral" : "direct"),
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      content: params.get("utm_content") || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      device: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop",
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor) return;
      const label = (anchor.textContent || "").trim().slice(0, 120);
      if (
        anchor.href.startsWith("mailto:") ||
        label.includes("Project") ||
        label.includes("Contact") ||
        label.includes("Similar")
      ) {
        trackEvent("cta_click", {
          path: window.location.pathname,
          content: label,
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

