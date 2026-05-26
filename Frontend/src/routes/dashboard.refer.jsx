import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useAuth } from "../lib/auth";
import { Copy, Gift } from "lucide-react";
import { toast } from "sonner";
const Route = createFileRoute("/dashboard/refer")({ component: Page });
function Page() {
  const { user } = useAuth();
  const code = "YOGINI-" + (user?.name?.split(" ")[0]?.toUpperCase() || "FRIEND");
  return <div className="space-y-6">
      <PageHeader title="Refer & earn" subtitle="Invite friends and earn rewards" />
      <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/60 to-card p-8">
        <Gift className="h-10 w-10 text-accent" />
        <h2 className="mt-4 font-display text-3xl text-primary">Get ₹500 for every friend who books</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">Share your code with friends. When they book their first service, both of you earn ₹500 in credit.</p>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-primary/40 bg-background p-4">
          <div className="font-mono text-lg">{code}</div>
          <button onClick={() => {
    navigator.clipboard.writeText(code);
    toast.success("Copied!");
  }} className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"><Copy className="h-3 w-3" /> Copy code</button>
        </div>
      </div>
    </div>;
}
export {
  Route
};
