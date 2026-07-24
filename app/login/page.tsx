import { Suspense } from "react";
import LoginPage from "./login-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="command-shell grid min-h-screen place-items-center text-slate-400">
          Loading login…
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
