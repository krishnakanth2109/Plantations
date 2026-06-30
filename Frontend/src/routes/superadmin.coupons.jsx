import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
const seed = [
  { id: uid(), code: "GREEN20", discount: 20, type: "%", expires: "2026-12-31", uses: 14, max: 100, active: true },
  { id: uid(), code: "WELCOME500", discount: 500, type: "\u20B9", expires: "2026-08-31", uses: 38, max: 200, active: true },
  { id: uid(), code: "MONSOON10", discount: 10, type: "%", expires: "2026-09-15", uses: 5, max: 50, active: false }
];
const Route = createFileRoute("/superadmin/coupons")({ component: Page });
function Page() {
  const [items, setItems] = useStore("coupons", seed);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ id: "", code: "", discount: 10, type: "%", expires: "", uses: 0, max: 100, active: true });
  function add() {
    if (!d.code) {
      toast.error("Code required");
      return;
    }
    setItems((p) => [{ ...d, code: d.code.toUpperCase(), id: uid() }, ...p]);
    setOpen(false);
    setD({ id: "", code: "", discount: 10, type: "%", expires: "", uses: 0, max: 100, active: true });
    toast.success("Coupon created");
  }
  function toggle(id) {
    setItems((p) => p.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  }
  function del(id) {
    if (!confirm("Delete?")) return;
    setItems((p) => p.filter((c) => c.id !== id));
  }
  return <div className="space-y-6">
      <PageHeader title="Offers & coupons" action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add coupon</button>} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Discount</th><th className="px-4 py-3 text-left">Expires</th><th className="px-4 py-3 text-left">Uses</th><th className="px-4 py-3 text-left">Status</th><th /></tr></thead>
          <tbody>{items.map((c) => <tr key={c.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
              <td className="px-4 py-3">{c.type === "%" ? `${c.discount}%` : `\u20B9${c.discount}`}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.expires}</td>
              <td className="px-4 py-3">{c.uses}/{c.max}</td>
              <td className="px-4 py-3"><Badge tone={c.active ? "success" : "default"}>{c.active ? "Active" : "Disabled"}</Badge></td>
              <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={() => toggle(c.id)} className="rounded border border-border px-2 py-1 text-xs">Toggle</button><button onClick={() => del(c.id)} className="rounded border border-border p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
            </tr>)}</tbody>
        </table>
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">New coupon</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Code (e.g. SUMMER20)" value={d.code} onChange={(e) => setD({ ...d, code: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm uppercase" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Value" value={d.discount} onChange={(e) => setD({ ...d, discount: +e.target.value })} className="rounded-lg border border-input px-3 py-2 text-sm" />
                <select value={d.type} onChange={(e) => setD({ ...d, type: e.target.value })} className="rounded-lg border border-input px-3 py-2 text-sm">
                  <option>%</option><option>₹</option>
                </select>
              </div>
              <input type="date" value={d.expires} onChange={(e) => setD({ ...d, expires: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <input type="number" placeholder="Max uses" value={d.max} onChange={(e) => setD({ ...d, max: +e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
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
