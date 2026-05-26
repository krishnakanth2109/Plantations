import React, { useState } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { SiteLayout } from "../components/site/SiteLayout";
import { Check, Sparkles } from "lucide-react";
import { createSubscription } from "../api";
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
const partial = ["Plant health observation", "Customized maintenance checklist", "Watering guidance", "Fertilizer recommendations", "Basic plant care instructions", "Seasonal care guidance", "Issue monitoring via photos", "Online support", "Wellness tracking"];
const full = ["Complete plant health monitoring", "Scheduled watering services", "Fertilizing & nutrient care", "Pruning & trimming", "Pest & disease treatment", "Soil care & refresh", "Repotting support", "Leaf cleaning", "Plant recovery care", "Seasonal maintenance", "Growth monitoring", "Overall wellness management"];
function Maintenance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState("");
  const [plantsCount, setPlantsCount] = useState(10);

  async function subscribe(plan) {
    if (!user) {
      toast.error("Please login before booking a plan");
      navigate({ to: "/login" });
      return;
    }
    setSubmitting(plan);
    try {
      await createSubscription({ plan, plantsCount });
      toast.success("Maintenance plan requested");
      navigate({ to: "/dashboard/maintenance" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting("");
    }
  }

  return <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Maintenance</p>
        <h1 className="mt-2 font-display text-5xl text-primary md:text-6xl">Plant care, your way</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Plants need regular care to remain healthy and beautiful. Choose guided support, or hand the work over to our team.</p>
        <div className="mt-8 max-w-xs">
          <label className="text-xs font-medium">Approx. number of plants</label>
          <input type="number" min="1" value={plantsCount} onChange={(e) => setPlantsCount(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8">
            <div className="flex items-center gap-2 text-sm font-medium text-primary"><Sparkles className="h-4 w-4" /> Guided</div>
            <h2 className="mt-3 font-display text-3xl">Partial Maintenance</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">We monitor and guide you with customized care instructions. You perform basic care and share plant updates regularly for monitoring.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {partial.map((p) => <li key={p} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> {p}</li>)}
            </ul>
            <p className="mt-6 rounded-lg bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">Charges vary based on number of plants, condition, space, and monitoring frequency.</p>
            <button onClick={() => subscribe("Partial")} disabled={submitting === "Partial"} className="mt-6 inline-flex w-full justify-center rounded-full border border-primary px-5 py-3 text-sm font-medium text-primary hover:bg-secondary disabled:opacity-60">{submitting === "Partial" ? "Requesting..." : "Book this plan"}</button>
          </div>

          <div className="rounded-3xl border border-primary bg-primary text-primary-foreground p-8 shadow-xl shadow-primary/20">
            <div className="flex items-center gap-2 text-sm font-medium text-accent"><Sparkles className="h-4 w-4" /> Hands-off</div>
            <h2 className="mt-3 font-display text-3xl">Fully Customized Maintenance</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">Our team takes complete responsibility for plant wellness — scheduled visits, treatment, repotting, everything.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {full.map((p) => <li key={p} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-accent" /> {p}</li>)}
            </ul>
            <p className="mt-6 rounded-lg bg-primary-foreground/10 px-4 py-3 text-xs text-primary-foreground/80">Charges depend on plant count, space size, plant type and frequency.</p>
            <button onClick={() => subscribe("Fully Customized")} disabled={submitting === "Fully Customized"} className="mt-6 inline-flex w-full justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60">{submitting === "Fully Customized" ? "Requesting..." : "Book this plan"}</button>
          </div>
        </div>
      </section>
    </SiteLayout>;
}
export {
  Route
};
