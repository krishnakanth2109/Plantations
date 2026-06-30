import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useStore } from "../lib/store";
import { toast } from "sonner";
const Route = createFileRoute("/superadmin/settings")({ component: Page });
function Page() {
  const [s, setS] = useStore("settings", { businessName: "Yogini Planters", phone: "", email: "", instagram: "", address: "" });
  return <div className="space-y-6">
      <PageHeader title="Business settings" subtitle="Manage your business profile" />
      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
        {["businessName", "phone", "email", "instagram", "address"].map((k) => <div key={k}>
            <label className="text-xs font-medium capitalize">{k.replace(/([A-Z])/g, " $1")}</label>
            <input value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>)}
        <button onClick={() => toast.success("Saved")} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Save settings</button>
      </div>
    </div>;
}
export {
  Route
};
