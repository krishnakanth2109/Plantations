import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
const seed = [
  { id: uid(), title: "5 indoor plants that purify the air", category: "Care Tips", excerpt: "Snake plant, peace lily and more.", body: "Full article body\u2026", date: "2026-05-10", published: true },
  { id: uid(), title: "Monsoon plant care checklist", category: "Seasonal", excerpt: "Protect plants from overwatering this season.", body: "\u2026", date: "2026-04-22", published: true }
];
const Route = createFileRoute("/superadmin/blog")({ component: Page });
function Page() {
  const [items, setItems] = useStore("blog", seed);
  const [editing, setEditing] = useState(null);
  function save() {
    if (!editing) return;
    if (!editing.title) {
      toast.error("Title required");
      return;
    }
    if (editing.id) setItems((p) => p.map((x) => x.id === editing.id ? editing : x));
    else setItems((p) => [{ ...editing, id: uid(), date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }, ...p]);
    setEditing(null);
    toast.success("Saved");
  }
  function del(id) {
    if (!confirm("Delete?")) return;
    setItems((p) => p.filter((x) => x.id !== id));
  }
  function togglePub(id) {
    setItems((p) => p.map((x) => x.id === id ? { ...x, published: !x.published } : x));
  }
  return <div className="space-y-6">
      <PageHeader title="Blog & plant tips" action={<button onClick={() => setEditing({ id: "", title: "", category: "Care Tips", excerpt: "", body: "", date: "", published: false })} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> New post</button>} />
      <div className="space-y-3">
        {items.map((p) => <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Badge>{p.category}</Badge>{p.date}</div>
                <h3 className="mt-1 font-display text-xl">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
              <Badge tone={p.published ? "success" : "warn"}>{p.published ? "Published" : "Draft"}</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => togglePub(p.id)} className="rounded-full border border-border px-3 py-1 text-xs">{p.published ? "Unpublish" : "Publish"}</button>
              <button onClick={() => setEditing(p)} className="rounded-full border border-border px-3 py-1 text-xs"><Pencil className="inline h-3 w-3" /> Edit</button>
              <button onClick={() => del(p.id)} className="rounded-full border border-border px-3 py-1 text-xs text-rose-600"><Trash2 className="inline h-3 w-3" /> Delete</button>
            </div>
          </div>)}
      </div>

      {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-xl rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">{editing.id ? "Edit post" : "New post"}</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm">
                {["Care Tips", "Seasonal", "Styling", "Wellness", "News"].map((r) => <option key={r}>{r}</option>)}
              </select>
              <textarea placeholder="Excerpt" rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <textarea placeholder="Body" rows={6} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Publish immediately</label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Save</button>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  Route
};
