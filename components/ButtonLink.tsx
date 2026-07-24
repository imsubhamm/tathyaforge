"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  const opensAssistant = href === "#project-assistant";
  const classes =
    variant === "primary"
      ? "bg-amber-500 text-white shadow-[0_10px_25px_rgba(217,119,6,.2)] hover:bg-amber-600"
      : "border border-slate-300 bg-white/70 text-slate-800 hover:border-amber-500/70 hover:text-slate-950";

  return (
    <Link
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (!opensAssistant) return;
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("tathya:open-assistant"));
      }}
      className={`group relative inline-flex min-h-11 w-full items-center justify-center overflow-hidden rounded-md px-5 py-3 text-sm font-semibold transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 sm:w-auto ${classes}`}
    >
      <span className="relative z-10">{children}</span>
      <span aria-hidden="true" className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1">↗</span>
    </Link>
  );
}
