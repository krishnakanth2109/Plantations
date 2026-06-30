import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "../lib/auth";
function getSeedProjects() {
  const sessionUser = getUser();
  const sessionCustomer = sessionUser?.role === "customer" ? sessionUser.name : "Customer";
  return [
    { id: uid(), name: "Banjara Hills Apartment", customer: sessionCustomer, type: "Indoor Styling", start: "2026-05-20", due: "2026-05-28", progress: 65, status: "In Progress" },
    { id: uid(), name: "Cafe Mocha Landscape", customer: "Cafe Mocha", type: "Landscaping", start: "2026-06-01", due: "2026-06-20", progress: 10, status: "Planning" },
    { id: uid(), name: "Jubilee Hills Balcony", customer: "Priya Reddy", type: "Balcony Makeover", start: "2026-05-10", due: "2026-05-22", progress: 100, status: "Completed" }
  ];
}
const Route = createFileRoute("/superadmin/projects")({ component: Page });
function Page() {
  const [items, setItems] = useStore("projects", getSeedProjects());
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ id: "", name: "", customer: "", type: "Indoor Styling", start: "", due: "", progress: 0, status: "Planning" });
  function add() {
    if (!d.name) {
      toast.error("Project name required");
      return;
    }
    setItems((p) => [{ ...d, id: uid() }, ...p]);
    setOpen(false);
    setD({ id: "", name: "", customer: "", type: "Indoor Styling", start: "", due: "", progress: 0, status: "Planning" });
    toast.success("Project created");
  }
  function adjust(id, p) {
    setItems((prev) => prev.map((x) => x.id === id ? { ...x, progress: p, status: p >= 100 ? "Completed" : x.status === "Completed" ? "In Progress" : x.status } : x));
  }
  function setStatus(id, status) {
    setItems((p) => p.map((x) => x.id === id ? { ...x, status } : x));
  }
  function del(id) {
    if (!confirm("Delete?")) return;
    setItems((p) => p.filter((x) => x.id !== id));
  }
  return <div className="space-y-6">
      <PageHeader title="Projects" subtitle="Track styling & landscaping projects" action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add project</button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((p) => <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl">{p.name}</h3>
                <div className="text-xs text-muted-foreground">{p.type} - {p.customer}</div>
              </div>
              <Badge tone={statusTone(p.status)}>{p.status}</Badge>
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground"><span>Start: {p.start}</span><span>Due: {p.due}</span></div>
            <div className="mt-3">
              <div className="flex justify-between text-xs"><span>Progress</span><span className="font-medium">{p.progress}%</span></div>
              <input type="range" min={0} max={100} value={p.progress} onChange={(e) => adjust(p.id, +e.target.value)} className="mt-1 w-full accent-primary" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <select value={p.status} onChange={(e) => setStatus(p.id, e.target.value)} className="rounded border border-input bg-background px-2 py-1 text-xs">
                {["Planning", "In Progress", "On Hold", "Completed"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button onClick={() => del(p.id)} className="ml-auto rounded border border-border p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>)}
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">New project</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Project name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <input placeholder="Customer" value={d.customer} onChange={(e) => setD({ ...d, customer: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <select value={d.type} onChange={(e) => setD({ ...d, type: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm">
                {["Indoor Styling", "Balcony Makeover", "Landscaping", "Commercial", "Wellness"].map((r) => <option key={r}>{r}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={d.start} onChange={(e) => setD({ ...d, start: e.target.value })} className="rounded-lg border border-input px-3 py-2 text-sm" />
                <input type="date" value={d.due} onChange={(e) => setD({ ...d, due: e.target.value })} className="rounded-lg border border-input px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
              <button onClick={add} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Create</button>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  Route
};
