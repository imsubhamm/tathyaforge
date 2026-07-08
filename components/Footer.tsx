import Link from "next/link";
import { company, navItems, services } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="text-lg font-semibold text-white">
            {company.name}
          </Link>
          <p className="mt-3 text-sm text-slate-300">{company.tagline}</p>
          <p className="mt-5 text-sm text-slate-400">Website: {company.website}</p>
          <p className="mt-2 text-sm text-slate-400">
            Email:{" "}
            <a className="text-slate-200 hover:text-teal-300" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Services
          </h2>
          <ul className="mt-4 space-y-3">
            {services.map((service) => (
              <li key={service.title}>
                <Link className="text-sm text-slate-300 hover:text-white" href="/services">
                  {service.title}
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
                <Link className="text-sm text-slate-300 hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
