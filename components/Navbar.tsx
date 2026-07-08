import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";
import { navItems, projectInquiryHref } from "@/lib/content";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="hidden sm:block">
          <ButtonLink href={projectInquiryHref}>Start Your Project</ButtonLink>
        </div>
      </nav>
    </header>
  );
}
