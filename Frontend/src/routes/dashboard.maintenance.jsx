import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { getMySubscriptions } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/maintenance")({ component: Page });

function mapSubscription(subscription) {
  return {
    id: subscription._id || subscription.id,
    plan: subscription.planId?.name || subscription.plan,
    plants: subscription.plantsCount,
    start: subscription.startDate ? new Date(subscription.startDate).toLocaleDateString("en-IN") : "",
    renewal: subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString("en-IN") : "",
    status: subscription.status,
  };
}

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMySubscriptions()
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

  return (
    <div className="space-y-6">
      <PageHeader title="My maintenance plans" subtitle={loading ? "Loading..." : "Subscription details & schedule"} />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">{s.plan} Plan</h3>
              <Badge tone={statusTone(s.status)}>{s.status}</Badge>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Plants covered</dt><dd>{s.plants}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd>{s.start}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Renewal</dt><dd>{s.renewal}</dd></div>
            </dl>
          </div>
        ))}
        {!loading && items.length === 0 && <div className="md:col-span-2 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No active plans. Visit Maintenance to subscribe.</div>}
      </div>
    </div>
  );
}

export { Route };
