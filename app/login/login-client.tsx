"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => {
    const value = searchParams.get("next") || "/opportunities";
    return value.startsWith("/") ? value : "/opportunities";
  }, [searchParams]);

  const [email, setEmail] = useState("admin@tathyaforge.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Login failed.");
      router.replace(nextPath);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="command-shell grid min-h-screen place-items-center px-5 py-16">
      <section className="command-login w-full max-w-md rounded-[2rem] border border-white/10 p-8 shadow-2xl sm:p-10">
        <div className="command-pulse mb-8 grid h-14 w-14 place-items-center rounded-2xl text-sm font-black">TF</div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">Private access</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Admin login
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          Sign in to open the opportunity command center and analytics dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
              placeholder="admin@tathyaforge.in"
              required
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
              placeholder="Password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
          <Link href="/opportunities" className="hover:text-amber-300">
            Opportunities
          </Link>
          <span>·</span>
          <Link href="/analytics" className="hover:text-amber-300">
            Analytics
          </Link>
        </div>
      </section>
    </div>
  );
}
