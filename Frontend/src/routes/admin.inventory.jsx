import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
const seed = [
  { id: uid(), name: "Snake Plant", category: "Plant", stock: 24, unit: "pcs", price: 450 },
  { id: uid(), name: "Money Plant", category: "Plant", stock: 38, unit: "pcs", price: 250 },
  { id: uid(), name: 'Ceramic White Pot 10"', category: "Pot", stock: 18, unit: "pcs", price: 650 },
  { id: uid(), name: "Organic Fertilizer", category: "Care", stock: 4, unit: "kg", price: 320 },
  { id: uid(), name: "Neem Oil Spray", category: "Care", stock: 2, unit: "btl", price: 280 }
];
const Route = createFileRoute("/admin/inventory")({ component: Page });
function Page() {
  const [items, setItems] = useStore("inventory", seed);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ id: "", name: "", category: "Plant", stock: 0, unit: "pcs", price: 0 });
  function add() {
    if (!d.name) {
      toast.error("Name required");
      return;
    }
    setItems((p) => [{ ...d, id: uid() }, ...p]);
    setOpen(false);
    setD({ id: "", name: "", category: "Plant", stock: 0, unit: "pcs", price: 0 });
    toast.success("Item added");
  }
  function adjust(id, n) {
    setItems((p) => p.map((i) => i.id === id ? { ...i, stock: Math.max(0, i.stock + n) } : i));
  }
  function del(id) {
    if (!confirm("Delete?")) return;
    setItems((p) => p.filter((i) => i.id !== id));
  }
  const low = items.filter((i) => i.stock <= 5).length;
  return <div className="space-y-6">
      <PageHeader title="Inventory" subtitle={`${items.length} SKUs \u2022 ${low} low stock`} action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add item</button>} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Item</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left">Stock</th><th className="px-4 py-3 text-left">Price</th><th /></tr></thead>
          <tbody>{items.map((i) => <tr key={i.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{i.name}</td>
              <td className="px-4 py-3"><Badge>{i.category}</Badge></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => adjust(i.id, -1)} className="rounded border border-border px-2">−</button>
                  <span className={i.stock <= 5 ? "font-medium text-rose-600" : ""}>{i.stock} {i.unit}</span>
                  <button onClick={() => adjust(i.id, 1)} className="rounded border border-border px-2">+</button>
                </div>
              </td>
              <td className="px-4 py-3">₹{i.price}</td>
              <td className="px-4 py-3 text-right"><button onClick={() => del(i.id)} className="rounded border border-border p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></td>
            </tr>)}</tbody>
        </table>
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">Add item</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <select value={d.category} onChange={(e) => setD({ ...d, category: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm">
                {["Plant", "Pot", "Care", "Tools", "Decor"].map((r) => <option key={r}>{r}</option>)}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="Stock" value={d.stock} onChange={(e) => setD({ ...d, stock: +e.target.value })} className="rounded-lg border border-input px-3 py-2 text-sm" />
                <input placeholder="Unit" value={d.unit} onChange={(e) => setD({ ...d, unit: e.target.value })} className="rounded-lg border border-input px-3 py-2 text-sm" />
                <input type="number" placeholder="Price" value={d.price} onChange={(e) => setD({ ...d, price: +e.target.value })} className="rounded-lg border border-input px-3 py-2 text-sm" />
              </div>
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
