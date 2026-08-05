import React, { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { LoadingCircle } from "../components/ui/LoadingCircle";
import {
  Sparkles,
  Loader2,
  Droplets,
  Scissors,
  Sprout,
  HeartPulse,
  Eye,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { createSubscription, getMaintenancePlans } from "../api";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance Plans — Yogini Planters" },
      { name: "description", content: "Professional plant care plans, doctor visits, fertilizing, and customized green maintenance services." },
      { property: "og:title", content: "Professional Plant Maintenance — Yogini Planters" },
    ]
  }),
  component: Maintenance
});

function getFeatureIcon(featureText) {
  const text = (featureText || "").toLowerCase();
  if (text.includes("water") || text.includes("drip") || text.includes("moisture")) return Droplets;
  if (text.includes("prun") || text.includes("trim") || text.includes("cut")) return Scissors;
  if (text.includes("fertiliz") || text.includes("soil") || text.includes("nutrition") || text.includes("feed")) return Sprout;
  if (text.includes("health") || text.includes("diagnos") || text.includes("doctor") || text.includes("wellness")) return HeartPulse;
  if (text.includes("dust") || text.includes("clean") || text.includes("shine") || text.includes("leaf")) return Sparkles;
  if (text.includes("monitor") || text.includes("inspect") || text.includes("check") || text.includes("visit")) return Eye;
  if (text.includes("pest") || text.includes("shield") || text.includes("protect") || text.includes("disease")) return ShieldCheck;
  return CheckCircle2;
}

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
      {/* Hero Header Section */}
      <section className="relative w-full border-b border-border/40 py-16 sm:py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Professional Maintenance
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
            Keep Your Green Spaces Beautiful, Always
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
            Plants require dedicated nurture, seasonal nutrition, and professional health diagnostics to remain vibrant. Choose guided maintenance or hand total care over to our experts.
          </p>

          {/* Outlined Floating Label: Plant Count Input */}
          <div className="mt-10 max-w-xs mx-auto">
            <div className="relative">
              <input
                type="number"
                min="1"
                id="plants-count"
                value={plantsCount}
                onChange={(e) => setPlantsCount(Math.max(1, Number(e.target.value)))}
                placeholder=" "
                className="peer w-full rounded-2xl border border-input bg-background/80 px-4 py-3.5 text-center text-base font-bold text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
              <label
                htmlFor="plants-count"
                className="absolute left-1/2 -translate-x-1/2 -top-2.5 z-10 px-2 bg-background text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted-foreground/60 peer-focus:-top-2.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary whitespace-nowrap"
              >
                Approx. number of plants
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Plans Showcase Section */}
      <section className="bg-background py-16 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 text-muted-foreground">
              <LoadingCircle size="lg" label="Loading maintenance packages..." />
            </div>
          ) : (
            <div className="grid gap-8 sm:gap-12 md:grid-cols-2 items-stretch">
              {plans.map((p) => {
                const isCustomized = p.slug === "fully-customized" || p.name.toLowerCase().includes("custom");
                const id = p._id || p.id;

                if (isCustomized) {
                  return (
                    <div
                      key={id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border-2 border-primary bg-card p-8 sm:p-10 shadow-xl shadow-primary/10 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
                    >
                      {/* Top Highlight Badge */}
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Recommended Plan
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between gap-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                            <ShieldCheck className="h-3.5 w-3.5" /> 360° Turnkey Care
                          </span>
                        </div>

                        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                          {p.name} Maintenance
                        </h2>

                        <p className="text-base text-muted-foreground leading-relaxed">
                          {p.description}
                        </p>

                        <div className="pt-4 border-t border-border/40 space-y-3.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">All-Inclusive Services</p>
                          {p.features?.map((f, i) => {
                            const IconComp = getFeatureIcon(f);
                            return (
                              <div key={i} className="flex items-center gap-3 text-sm font-semibold text-foreground">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                                  <IconComp className="h-4 w-4" />
                                </div>
                                <span>{f}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-8 mt-6 border-t border-border/40 space-y-4">
                        {p.priceNote && (
                          <p className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-xs font-medium text-primary text-center">
                            {p.priceNote}
                          </p>
                        )}
                        <button
                          onClick={() => subscribe(p)}
                          disabled={submitting === id}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 group/btn cursor-pointer"
                        >
                          <span>{submitting === id ? "Requesting..." : "Book This Plan"}</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-border/60 bg-card p-8 sm:p-10 shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                          <Sparkles className="h-3.5 w-3.5" /> Guided Care
                        </span>
                      </div>

                      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                        {p.name} Maintenance
                      </h2>

                      <p className="text-base text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>

                      <div className="pt-4 border-t border-border/40 space-y-3.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What's Included</p>
                        {p.features?.map((f, i) => {
                          const IconComp = getFeatureIcon(f);
                          return (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <IconComp className="h-4 w-4" />
                              </div>
                              <span>{f}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-8 mt-6 border-t border-border/40 space-y-4">
                      {p.priceNote && (
                        <p className="rounded-xl bg-muted/60 p-4 text-xs font-medium text-muted-foreground text-center">
                          {p.priceNote}
                        </p>
                      )}
                      <button
                        onClick={() => subscribe(p)}
                        disabled={submitting === id}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-8 py-4 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 group/btn cursor-pointer"
                      >
                        <span>{submitting === id ? "Requesting..." : "Book This Plan"}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

export { Route };
