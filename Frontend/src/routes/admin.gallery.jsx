import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
const Route = createFileRoute("/admin/gallery")({ component: Page });
function Page() {
  const [items, setItems] = useStore("gallery", []);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ title: "", category: "Indoor Styling", before: "", after: "" });
  function add() {
    if (!d.title || !d.before || !d.after) {
      toast.error("All fields required");
      return;
    }
    setItems((p) => [{ ...d, id: uid() }, ...p]);
    toast.success("Added to gallery");
    setOpen(false);
    setD({ title: "", category: "Indoor Styling", before: "", after: "" });
  }
  function del(id) {
    if (!confirm("Delete?")) return;
    setItems((p) => p.filter((g) => g.id !== id));
  }
  function readFile(file) {
    return new Promise((r) => {
      const fr = new FileReader();
      fr.onload = () => r(fr.result);
      fr.readAsDataURL(file);
    });
  }
  return <div className="space-y-6">
      <PageHeader title="Gallery" subtitle="Before / after transformations" action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add</button>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => <div key={g.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid grid-cols-2">
              <img src={g.before} alt="before" className="aspect-square w-full object-cover" />
              <img src={g.after} alt="after" className="aspect-square w-full object-cover" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{g.title}</div>
                <div className="text-xs text-muted-foreground">{g.category}</div>
              </div>
              <button onClick={() => del(g.id)} className="rounded-md border border-border p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>)}
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">Add gallery item</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Title" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <select value={d.category} onChange={(e) => setD({ ...d, category: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm">
                {["Indoor Styling", "Balcony Makeover", "Landscaping", "Commercial", "Wellness"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <div>
                <label className="text-xs">Before image</label>
                <input type="file" accept="image/*" onChange={async (e) => e.target.files?.[0] && setD({ ...d, before: await readFile(e.target.files[0]) })} className="mt-1 w-full text-xs" />
                {d.before && <img src={d.before} alt="" className="mt-2 h-20 w-20 rounded object-cover" />}
              </div>
              <div>
                <label className="text-xs">After image</label>
                <input type="file" accept="image/*" onChange={async (e) => e.target.files?.[0] && setD({ ...d, after: await readFile(e.target.files[0]) })} className="mt-1 w-full text-xs" />
                {d.after && <img src={d.after} alt="" className="mt-2 h-20 w-20 rounded object-cover" />}
              </div>
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
