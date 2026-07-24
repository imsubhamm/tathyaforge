import { Logo } from "@/components/Logo";
import Link from "next/link";
import { company, footerServiceLinks, navItems } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/35 py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo variant="dark" />
          <p className="mt-3 text-sm text-slate-600">{company.tagline}</p>
          <p className="mt-5 text-sm text-slate-500">Website: {company.website}</p>
          <p className="mt-2 text-sm text-slate-500">Based in {company.location}</p>
          <p className="mt-2 text-sm text-slate-500">
            Email:{" "}
            <a className="text-slate-700 hover:text-amber-700" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
          <a
            className="mt-3 inline-block text-sm text-slate-700 hover:text-amber-700"
            href={company.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            Founder LinkedIn ↗
          </a>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Services
          </h2>
          <ul className="mt-4 space-y-3">
            {footerServiceLinks.map((service) => (
              <li key={service.label}>
                <Link className="text-sm text-slate-600 hover:text-slate-950" href={service.href}>
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Company
          </h2>
          <ul className="mt-4 space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="text-sm text-slate-600 hover:text-slate-950" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-sm text-slate-600 hover:text-slate-950" href="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="text-sm text-slate-600 hover:text-slate-950" href="/terms">
                Terms
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
