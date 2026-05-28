import React, { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { createSubscription, getMaintenancePlans } from "../api";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance Plans \u2014 Yogini Planters" },
      { name: "description", content: "Partial maintenance with guided support, or fully customized professional plant care plans." }
    ]
  }),
  component: Maintenance
});

function Maintenance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState("");
  const [plantsCount, setPlantsCount] = useState(10);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMaintenancePlans();
        // Only display active plans
        setPlans(data.plans.filter(p => p.isActive));
      } catch (err) {
        toast.error(err.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function subscribe(planDoc) {
    if (!user) {
      toast.error("Please login before booking a plan");
      navigate({ to: "/login" });
      return;
    }
    const id = planDoc._id || planDoc.id;
    setSubmitting(id);
    try {
      const data = await createSubscription({ 
        planId: id, 
        plan: planDoc.name, 
        plantsCount 
      });
      if (data?.upgradeRequested) {
        toast.success("Plan change request sent to admin for approval");
      } else {
        toast.success("Maintenance plan requested");
      }
      navigate({ to: "/dashboard/maintenance" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting("");
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Maintenance</p>
        <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Plant care, your way</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Plants need regular care to remain healthy and beautiful. Choose guided support, or hand the work over to our team.
        </p>
        <div className="mt-8 max-w-xs">
          <label className="text-xs font-medium">Approx. number of plants</label>
          <input
            type="number"
            min="1"
            value={plantsCount}
            onChange={(e) => setPlantsCount(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground mt-14">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            Loading maintenance plans...
          </div>
        ) : (
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {plans.map((p) => {
              const isCustomized = p.slug === "fully-customized" || p.name.toLowerCase().includes("custom");
              const id = p._id || p.id;
              
              if (isCustomized) {
                return (
                  <div
                    key={id}
                    className="rounded-3xl border border-primary bg-primary text-primary-foreground p-8 shadow-xl shadow-primary/20 flex flex-col justify-between animate-fade-in"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-accent">
                        <Sparkles className="h-4 w-4" /> Hands-off
                      </div>
                      <h2 className="mt-3 font-display text-3xl">{p.name} Maintenance</h2>
                      <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
                        {p.description}
                      </p>
                      <ul className="mt-6 space-y-2 text-sm">
                        {p.features?.map((f, i) => (
                          <li key={i} className="flex gap-2">
                            <Check className="mt-0.5 h-4 w-4 text-accent" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      {p.priceNote && (
                        <p className="mt-6 rounded-lg bg-primary-foreground/10 px-4 py-3 text-xs text-primary-foreground/80">
                          {p.priceNote}
                        </p>
                      )}
                      <button
                        onClick={() => subscribe(p)}
                        disabled={submitting === id}
                        className="mt-6 inline-flex w-full justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
                      >
                        {submitting === id ? "Requesting..." : "Book this plan"}
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={id}
                  className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-between animate-fade-in"
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Sparkles className="h-4 w-4" /> Guided
                    </div>
                    <h2 className="mt-3 font-display text-3xl">{p.name} Maintenance</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <ul className="mt-6 space-y-2 text-sm">
                      {p.features?.map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-primary" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    {p.priceNote && (
                      <p className="mt-6 rounded-lg bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
                        {p.priceNote}
                      </p>
                    )}
                    <button
                      onClick={() => subscribe(p)}
                      disabled={submitting === id}
                      className="mt-6 inline-flex w-full justify-center rounded-full border border-primary px-5 py-3 text-sm font-medium text-primary hover:bg-secondary disabled:opacity-60 cursor-pointer"
                    >
                      {submitting === id ? "Requesting..." : "Book this plan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

export { Route };
