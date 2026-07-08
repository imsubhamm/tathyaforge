import Link from "next/link";
import type { ReactNode } from "react";

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
  const classes =
    variant === "primary"
      ? "bg-amber-300 text-slate-950 hover:bg-amber-200"
      : "border border-slate-700/80 bg-slate-950/35 text-slate-100 hover:border-amber-300/70 hover:text-white";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition sm:w-auto ${classes}`}
    >
      {children}
    </Link>
  );
}
