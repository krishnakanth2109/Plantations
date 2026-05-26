import React, { useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useStore, uid } from "../lib/store";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "../api";

const Route = createFileRoute("/admin/gallery")({ component: Page });

function Page() {
  const [items, setItems] = useStore("gallery", []);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ title: "", category: "Indoor Styling", before: "", after: "" });
  
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  async function handleUploadBefore(file) {
    if (!file) return;
    setUploadingBefore(true);
    try {
      const res = await uploadFile(file, "gallery-before");
      setD((prev) => ({ ...prev, before: res.url }));
      toast.success("Before image uploaded to Cloudinary");
    } catch (err) {
      toast.error(err.message || "Failed to upload before image");
    } finally {
      setUploadingBefore(false);
    }
  }

  async function handleUploadAfter(file) {
    if (!file) return;
    setUploadingAfter(true);
    try {
      const res = await uploadFile(file, "gallery-after");
      setD((prev) => ({ ...prev, after: res.url }));
      toast.success("After image uploaded to Cloudinary");
    } catch (err) {
      toast.error(err.message || "Failed to upload after image");
    } finally {
      setUploadingAfter(false);
    }
  }

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        subtitle="Before / after transformations"
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/95 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid grid-cols-2">
              <img src={g.before} alt="before" className="aspect-square w-full object-cover" />
              <img src={g.after} alt="after" className="aspect-square w-full object-cover" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{g.title}</div>
                <div className="text-xs text-muted-foreground">{g.category}</div>
              </div>
              <button
                onClick={() => del(g.id)}
                className="rounded-md border border-border p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            No transformations in gallery. Click Add to create one.
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl text-primary">Add gallery item</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold">Title</label>
                <input
                  placeholder="Title"
                  value={d.title}
                  onChange={(e) => setD({ ...d, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Category</label>
                <select
                  value={d.category}
                  onChange={(e) => setD({ ...d, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {["Indoor Styling", "Balcony Makeover", "Landscaping", "Commercial", "Wellness"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold">Before image</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingBefore}
                  onChange={(e) => e.target.files?.[0] && handleUploadBefore(e.target.files[0])}
                  className="mt-1 w-full text-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-border file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
                />
                {uploadingBefore && (
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Uploading to Cloudinary...
                  </div>
                )}
                {!uploadingBefore && d.before && (
                  <img
                    src={d.before}
                    alt="Before preview"
                    className="mt-2 h-20 w-20 rounded object-cover border border-border"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold">After image</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingAfter}
                  onChange={(e) => e.target.files?.[0] && handleUploadAfter(e.target.files[0])}
                  className="mt-1 w-full text-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-border file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
                />
                {uploadingAfter && (
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Uploading to Cloudinary...
                  </div>
                )}
                {!uploadingAfter && d.after && (
                  <img
                    src={d.after}
                    alt="After preview"
                    className="mt-2 h-20 w-20 rounded object-cover border border-border"
                  />
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={add}
                disabled={uploadingBefore || uploadingAfter}
                className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/95 disabled:opacity-60 cursor-pointer"
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
