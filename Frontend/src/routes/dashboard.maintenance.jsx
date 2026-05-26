import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { getMySubscriptions, getMaintenancePlans, createSubscription } from "../api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  // Dynamic plans explore states
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [plantsCount, setPlantsCount] = useState(10);
  const [submittingPlan, setSubmittingPlan] = useState("");

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

  async function loadPlans() {
    setPlansLoading(true);
    try {
      const data = await getMaintenancePlans();
      setPlans(data.plans.filter(p => p.isActive));
    } catch (err) {
      toast.error(err.message || "Failed to load plans");
    } finally {
      setPlansLoading(false);
    }
  }

  useEffect(() => {
    if (showExplore) {
      loadPlans();
    }
  }, [showExplore]);

  async function subscribe(planDoc) {
    const id = planDoc._id || planDoc.id;
    setSubmittingPlan(id);
    try {
      const data = await createSubscription({
        planId: id,
        plan: planDoc.name,
        plantsCount
      });
      toast.success("Maintenance plan requested successfully");
      setItems(p => [mapSubscription(data.subscription), ...p]);
      setShowExplore(false);
    } catch (error) {
      toast.error(error.message || "Failed to request plan");
    } finally {
      setSubmittingPlan("");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My maintenance plans"
        subtitle={loading ? "Loading..." : "Subscription details & schedule"}
        action={
          <button
            onClick={() => setShowExplore(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            Explore plans
          </button>
        }
      />
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
        {!loading && items.length === 0 && <div className="md:col-span-2 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No active plans. Click Explore Plans to subscribe.</div>}
      </div>

      {showExplore && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowExplore(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-2xl text-primary">Available Maintenance Plans</h3>
              <button
                onClick={() => setShowExplore(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Plants Count Input inside Modal */}
            <div className="mt-5 max-w-xs">
              <label className="text-xs font-semibold">Approx. number of plants</label>
              <input
                type="number"
                min="1"
                value={plantsCount}
                onChange={(e) => setPlantsCount(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {plansLoading ? (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading plans...
              </div>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {plans.map((p) => {
                  const id = p._id || p.id;
                  return (
                    <div key={id} className="rounded-2xl border border-border bg-secondary/20 p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display text-lg text-primary">{p.name} Maintenance</h4>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {p.description}
                        </p>
                        <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                          {p.features?.map((f, i) => (
                            <li key={i} className="flex gap-1.5 items-start">
                              <span className="text-primary font-bold">✓</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 border-t border-border pt-4">
                        {p.priceNote && (
                          <p className="text-[10px] italic text-muted-foreground mb-3 bg-card p-2 rounded border border-border/40">
                            {p.priceNote}
                          </p>
                        )}
                        <button
                          onClick={() => subscribe(p)}
                          disabled={submittingPlan === id}
                          className="w-full py-2 px-3 rounded-full bg-primary hover:bg-primary/95 text-xs font-semibold text-primary-foreground disabled:opacity-60 cursor-pointer"
                        >
                          {submittingPlan === id ? "Requesting..." : "Book this plan"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
