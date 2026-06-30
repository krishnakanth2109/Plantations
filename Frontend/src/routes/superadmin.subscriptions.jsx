import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { getAllSubscriptions, renewSubscription, updateSubscriptionStatus, resolveSubscriptionUpgrade } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/admin/subscriptions")({ component: Page });

function mapSubscription(subscription) {
  return {
    id: subscription._id || subscription.id,
    customer: subscription.customerId?.name || "",
    plan: subscription.planId?.name || subscription.plan,
    plants: subscription.plantsCount,
    start: subscription.startDate ? new Date(subscription.startDate).toLocaleDateString("en-IN") : "",
    renewal: subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString("en-IN") : "",
    status: subscription.status,
    pendingUpgradePlanName: subscription.pendingUpgradePlanName,
    pendingUpgradePlantsCount: subscription.pendingUpgradePlantsCount,
    upgradeRequestStatus: subscription.upgradeRequestStatus,
  };
}

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function resolveUpgrade(id, actionVal) {
    try {
      const data = await resolveSubscriptionUpgrade(id, actionVal);
      setItems((prev) => prev.map((s) => (s.id === id ? mapSubscription(data.subscription) : s)));
      toast.success(`Upgrade request ${actionVal === "approve" ? "approved" : "declined"}`);
    } catch (error) {
      toast.error(error.message || "Failed to resolve upgrade request");
    }
  }

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllSubscriptions()
      .then((data) => {
        if (active) setItems(data.subscriptions.map(mapSubscription));
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function action(id, status) {
    try {
      const data = await updateSubscriptionStatus(id, { status });
      setItems((p) => p.map((c) => (c.id === id ? mapSubscription(data.subscription) : c)));
      toast.success(`Plan ${status}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function renew(id) {
    try {
      const data = await renewSubscription(id, 6);
      setItems((p) => p.map((c) => (c.id === id ? mapSubscription(data.subscription) : c)));
      toast.success("Plan renewed");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance subscriptions" subtitle={loading ? "Loading..." : "Manage active plans"} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl">{s.customer}</div>
                <div className="text-xs text-muted-foreground">{s.plan} - {s.plants} plants</div>
              </div>
              <Badge tone={statusTone(s.status)}>{s.status}</Badge>
            </div>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd>{s.start}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Renewal</dt><dd>{s.renewal}</dd></div>
            </dl>
            {s.upgradeRequestStatus === "Pending" && (
              <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-800 leading-normal flex flex-col gap-0.5">
                <span className="font-semibold block">
                  {s.pendingUpgradePlanName === "Fully Customized" ? "Upgrade Requested:" : "Plan Change Requested:"}
                </span>
                <span>wants to switch to <strong>{s.pendingUpgradePlanName}</strong> ({s.pendingUpgradePlantsCount} plants)</span>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {s.status === "Active" && <button onClick={() => action(s.id, "Paused")} className="rounded-full border border-border px-3 py-1 text-xs">Pause</button>}
              {s.status === "Paused" && <button onClick={() => action(s.id, "Active")} className="rounded-full border border-border px-3 py-1 text-xs">Resume</button>}
              
              {s.upgradeRequestStatus === "Pending" && (
                <>
                  <button onClick={() => resolveUpgrade(s.id, "approve")} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs font-semibold transition cursor-pointer">
                    {s.pendingUpgradePlanName === "Fully Customized" ? "Accept Upgrade" : "Accept Change"}
                  </button>
                  <button onClick={() => resolveUpgrade(s.id, "reject")} className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 text-xs font-semibold transition cursor-pointer">Reject</button>
                </>
              )}

              <button onClick={() => renew(s.id)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Renew +6mo</button>
              {s.status !== "Cancelled" && <button onClick={() => action(s.id, "Cancelled")} className="rounded-full border border-border px-3 py-1 text-xs text-rose-600">Cancel</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Route };
