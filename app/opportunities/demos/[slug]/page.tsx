import { Suspense } from "react";
import PrivateOpportunityDemoClient from "./demo-client";

export default function PrivateOpportunityDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="command-shell grid min-h-screen place-items-center text-slate-400">
          Loading private demo…
        </div>
      }
    >
      <PrivateOpportunityDemoClient />
    </Suspense>
  );
}
