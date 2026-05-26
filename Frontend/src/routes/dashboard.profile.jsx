import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useAuth } from "../lib/auth";
import { useStore } from "../lib/store";
import { toast } from "sonner";
import { useEffect } from "react";
const Route = createFileRoute("/dashboard/profile")({ component: Page });
function Page() {
  const { user } = useAuth();
  const [p, setP] = useStore("profile", {
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || ""
  });
  useEffect(() => {
    if (!user) return;
    setP((current) => ({
      name: current.name || user.name || "",
      phone: current.phone || user.phone || "",
      email: current.email || user.email || "",
      address: current.address || user.address || ""
    }));
  }, [user, setP]);
  return <div className="space-y-6">
      <PageHeader title="My profile" subtitle="Manage your personal details" />
      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
        {["name", "phone", "email", "address"].map((k) => <div key={k}>
            <label className="text-xs font-medium capitalize">{k}</label>
            <input value={p[k]} onChange={(e) => setP({ ...p, [k]: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>)}
        <button onClick={() => toast.success("Profile saved")} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Save changes</button>
      </div>
    </div>;
}
export {
  Route
};
