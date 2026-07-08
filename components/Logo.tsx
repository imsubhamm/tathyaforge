import Link from "next/link";

type LogoProps = {
  variant?: "transparent" | "dark";
  showWordmark?: boolean;
  className?: string;
  markClassName?: string;
};

export function Logo({
  variant = "transparent",
  showWordmark = true,
  className = "",
  markClassName = "h-10 w-10",
}: LogoProps) {
  const backgroundClass =
    variant === "dark"
      ? "rounded-lg border border-slate-800 bg-slate-950/95 px-3 py-2"
      : "";

  return (
    <Link
      href="/"
      aria-label="TathyaForge home"
      className={`inline-flex items-center gap-3.5 ${backgroundClass} ${className}`}
    >
      <LogoMark className={`${markClassName} shrink-0`} />
      {showWordmark ? (
        <span className="text-xl font-semibold tracking-tight text-slate-50">
          TathyaForge
        </span>
      ) : null}
    </Link>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="TathyaForge TF monogram"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#07111F" />
      <rect
        x="4.75"
        y="4.75"
        width="54.5"
        height="54.5"
        rx="13.25"
        stroke="url(#tf-frame)"
        strokeWidth="1.5"
      />
      <path
        d="M17 18H38M27.5 18V43M27.5 29H17"
        stroke="#F8FAFC"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M37 18H49M37 30H47M37 18V46"
        stroke="#F8FAFC"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M18 43H27.5M18 29V43"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
      <circle cx="18" cy="29" r="2.7" fill="#FBBF24" />
      <circle cx="18" cy="43" r="2.7" fill="#FBBF24" />
      <circle cx="27.5" cy="43" r="2.7" fill="#FBBF24" />
      <path d="M47 41L53 36L50 46L56 42" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="square" />
      <defs>
        <linearGradient id="tf-frame" x1="8" y1="7" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" stopOpacity="0.9" />
          <stop offset="0.52" stopColor="#334155" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
