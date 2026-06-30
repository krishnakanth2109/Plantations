import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
const seed = [
  { id: uid(), name: "Ramesh K.", role: "Plant Stylist", phone: "+91 98765 11111", status: "Active", assigned: 8 },
  { id: uid(), name: "Sunita M.", role: "Maintenance Lead", phone: "+91 98765 22222", status: "Active", assigned: 12 },
  { id: uid(), name: "Vikram S.", role: "Landscape Specialist", phone: "+91 98765 33333", status: "On Leave", assigned: 3 }
];
const Route = createFileRoute("/admin/staff")({ component: Page });
function Page() {
  const [items, setItems] = useStore("staff", seed);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ id: "", name: "", role: "Plant Stylist", phone: "", status: "Active", assigned: 0 });
  function add() {
    if (!d.name) {
      toast.error("Name required");
      return;
    }
    setItems((p) => [{ ...d, id: uid() }, ...p]);
    setOpen(false);
    setD({ id: "", name: "", role: "Plant Stylist", phone: "", status: "Active", assigned: 0 });
    toast.success("Staff added");
  }
  function del(id) {
    if (!confirm("Remove staff member?")) return;
    setItems((p) => p.filter((s) => s.id !== id));
  }
  function toggle(id) {
    setItems((p) => p.map((s) => s.id === id ? { ...s, status: s.status === "Active" ? "On Leave" : "Active" } : s));
  }
  return <div className="space-y-6">
      <PageHeader title="Staff" subtitle={`${items.length} team members`} action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add staff</button>} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-left">Assigned</th><th className="px-4 py-3 text-left">Status</th><th /></tr></thead>
          <tbody>{items.map((s) => <tr key={s.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{s.name}</td>
              <td className="px-4 py-3">{s.role}</td>
              <td className="px-4 py-3 text-muted-foreground">{s.phone}</td>
              <td className="px-4 py-3">{s.assigned}</td>
              <td className="px-4 py-3"><Badge tone={s.status === "Active" ? "success" : "warn"}>{s.status}</Badge></td>
              <td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => toggle(s.id)} className="rounded border border-border px-2 py-1 text-xs">Toggle</button><button onClick={() => del(s.id)} className="rounded border border-border p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
            </tr>)}</tbody>
        </table>
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">Add staff</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <select value={d.role} onChange={(e) => setD({ ...d, role: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm">
                {["Plant Stylist", "Maintenance Lead", "Landscape Specialist", "Plant Doctor", "Logistics"].map((r) => <option key={r}>{r}</option>)}
              </select>
              <input placeholder="Phone" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
              <button onClick={add} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Add</button>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  Route
};
