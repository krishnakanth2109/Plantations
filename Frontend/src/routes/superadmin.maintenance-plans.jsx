import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { getMaintenancePlans, createMaintenancePlan, updateMaintenancePlan, deleteMaintenancePlan } from "../api";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Route = createFileRoute("/superadmin/maintenance-plans")({ component: Page });

const emptyPlan = {
  name: "",
  slug: "",
  description: "",
  features: "",
  priceNote: "",
  isActive: true,
  sortOrder: 0
};

function Page() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMaintenancePlans();
        setPlans(data.plans || []);
      } catch (err) {
        toast.error(err.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.description) {
      toast.error("Name and Description are required");
      return;
    }
    
    // Auto-generate slug from name if not specified
    const payload = {
      ...editing,
      slug: editing.slug || editing.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      features: typeof editing.features === "string" 
        ? editing.features.split("\n").map(f => f.trim()).filter(Boolean)
        : editing.features
    };

    try {
      if (editing._id || editing.id) {
        const id = editing._id || editing.id;
        const data = await updateMaintenancePlan(id, payload);
        setPlans(p => p.map(x => (x._id === id || x.id === id) ? data.plan : x));
        toast.success("Plan updated successfully");
      } else {
        const data = await createMaintenancePlan(payload);
        setPlans(p => [...p, data.plan]);
        toast.success("Plan created successfully");
      }
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Failed to save plan");
    }
  }

  async function del(id) {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deleteMaintenancePlan(id);
      setPlans(p => p.filter(x => x._id !== id && x.id !== id));
      toast.success("Plan deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete plan");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans"
        subtitle="Manage dynamic plans shown to customers"
        action={
          <button
            onClick={() => setEditing({ ...emptyPlan, features: "" })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add plan
          </button>
        }
      />

      {loading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading plans...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p._id || p.id}
              className={`rounded-2xl border p-6 bg-card flex flex-col justify-between ${
                p.isActive ? "border-border" : "border-dashed border-border opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Order: {p.sortOrder || 0}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-2xl text-primary">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Features:
                  </h4>
                  <ul className="list-disc list-inside text-xs space-y-1 text-slate-600">
                    {p.features?.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                {p.priceNote && (
                  <p className="mt-4 text-xs italic text-muted-foreground bg-secondary/40 p-2.5 rounded-lg">
                    {p.priceNote}
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
                <button
                  onClick={() =>
                    setEditing({
                      ...p,
                      features: p.features?.join("\n") || ""
                    })
                  }
                  className="rounded-md border border-border p-2 hover:bg-secondary text-sm flex items-center gap-1"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => del(p._id || p.id)}
                  className="rounded-md border border-border p-2 hover:bg-rose-50 hover:text-rose-600 text-sm flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              No plans found. Click Add Plan to create one.
            </div>
          )}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl text-primary">
              {editing._id || editing.id ? "Edit Plan" : "Add Plan"}
            </h3>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold">Plan Name</label>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Partial"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Slug (Optional)</label>
                <input
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="e.g. partial"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Description</label>
                <textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="e.g. Guided plant care support..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Features (One per line)</label>
                <textarea
                  value={editing.features || ""}
                  onChange={(e) => setEditing({ ...editing, features: e.target.value })}
                  placeholder="Plant health observation&#10;Watering guidance&#10;Online support"
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Price / Charges Note</label>
                <input
                  value={editing.priceNote || ""}
                  onChange={(e) => setEditing({ ...editing, priceNote: e.target.value })}
                  placeholder="e.g. Charges vary by number of plants."
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-6">
                <div>
                  <label className="text-xs font-semibold">Sort Order</label>
                  <input
                    type="number"
                    value={editing.sortOrder || 0}
                    onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editing.isActive}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold select-none cursor-pointer">
                    Active &amp; Visible
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setEditing(null)}
                className="rounded-full border border-border px-5 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
