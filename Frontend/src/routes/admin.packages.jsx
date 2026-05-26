import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
const seed = [
  { id: uid(), name: "Starter Indoor", service: "Indoor Styling", price: 4500, duration: "1 visit", includes: "Consultation, 5 plants, styling", active: true },
  { id: uid(), name: "Balcony Bloom", service: "Balcony Makeover", price: 18500, duration: "2-3 days", includes: "Design, plants, pots, install", active: true },
  { id: uid(), name: "Partial Maintenance", service: "Maintenance", price: 2500, duration: "Monthly", includes: "Bi-monthly visits, basic care", active: true },
  { id: uid(), name: "Fully Customized Care", service: "Maintenance", price: 4500, duration: "Monthly", includes: "Weekly visits, full care, replacements", active: true }
];
const Route = createFileRoute("/admin/packages")({ component: Page });
function Page() {
  const [items, setItems] = useStore("packages", seed);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ id: "", name: "", service: "Indoor Styling", price: 0, duration: "", includes: "", active: true });
  function add() {
    if (!d.name) {
      toast.error("Name required");
      return;
    }
    setItems((p) => [{ ...d, id: uid() }, ...p]);
    setOpen(false);
    setD({ id: "", name: "", service: "Indoor Styling", price: 0, duration: "", includes: "", active: true });
    toast.success("Package created");
  }
  function toggle(id) {
    setItems((p) => p.map((i) => i.id === id ? { ...i, active: !i.active } : i));
  }
  function del(id) {
    if (!confirm("Delete?")) return;
    setItems((p) => p.filter((i) => i.id !== id));
  }
  return <div className="space-y-6">
      <PageHeader title="Service packages" subtitle="Create & price packages" action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add package</button>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => <div key={p.id} className={`rounded-2xl border bg-card p-5 ${p.active ? "border-border" : "border-dashed border-border opacity-60"}`}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.service}</div>
            <h3 className="mt-1 font-display text-xl text-primary">{p.name}</h3>
            <div className="mt-2 font-display text-2xl">₹{p.price.toLocaleString("en-IN")}</div>
            <div className="text-xs text-muted-foreground">{p.duration}</div>
            <p className="mt-3 text-sm">{p.includes}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => toggle(p.id)} className="rounded-full border border-border px-3 py-1 text-xs">{p.active ? "Disable" : "Enable"}</button>
              <button onClick={() => del(p.id)} className="rounded-full border border-border px-3 py-1 text-xs text-rose-600"><Trash2 className="inline h-3 w-3" /> Delete</button>
            </div>
          </div>)}
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">New package</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <select value={d.service} onChange={(e) => setD({ ...d, service: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm">
                {["Indoor Styling", "Balcony Makeover", "Landscaping", "Wellness", "Maintenance"].map((r) => <option key={r}>{r}</option>)}
              </select>
              <input type="number" placeholder="Price" value={d.price} onChange={(e) => setD({ ...d, price: +e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <input placeholder="Duration" value={d.duration} onChange={(e) => setD({ ...d, duration: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <textarea placeholder="What's included" rows={3} value={d.includes} onChange={(e) => setD({ ...d, includes: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
              <button onClick={add} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Save</button>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  Route
};
