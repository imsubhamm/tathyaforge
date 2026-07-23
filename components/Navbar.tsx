"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";
import { navItems, projectInquiryHref } from "@/lib/content";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header data-nav className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/78 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-sm font-medium text-slate-300 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 hover:text-white"
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
          className="grid h-11 w-11 place-items-center rounded-md border border-slate-700 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 md:hidden"
        >
          <span className="text-xl">{open ? "×" : "☰"}</span>
        </button>
      </nav>
      <div id="mobile-menu" className={`mobile-menu md:hidden ${open ? "is-open" : ""}`}>
        <div className="grid gap-1 px-5 pb-5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
