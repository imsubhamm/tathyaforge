"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";
import { navItems, projectInquiryHref } from "@/lib/content";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header data-nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/82 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-sm font-medium text-slate-600 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="hidden sm:block">
          <ButtonLink href={projectInquiryHref}>Start Your Project</ButtonLink>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-md border border-slate-300 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 md:hidden"
        >
          <span className="text-xl">{open ? "×" : "☰"}</span>
        </button>
      </nav>
      <div id="mobile-menu" className={`mobile-menu md:hidden ${open ? "is-open" : ""}`}>
        <div className="grid gap-1 border-t border-slate-200 bg-white/95 px-5 pb-5 pt-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
