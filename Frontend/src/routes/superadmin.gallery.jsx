import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createGalleryItem, deleteGalleryItem, getAllGalleryItems, uploadFile } from "../api";

const Route = createFileRoute("/superadmin/gallery")({ component: Page });

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ title: "", category: "Indoor Styling", image: "" });
  
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllGalleryItems()
      .then((data) => {
        if (active) setItems(data.galleryItems);
      })
      .catch((err) => toast.error(err.message || "Failed to load gallery"))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleUploadImage(file) {
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadFile(file, "gallery");
      setD((prev) => ({ ...prev, image: res.url }));
      toast.success("Image uploaded to Cloudinary");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function add() {
    if (!d.title || !d.category || !d.image) {
      toast.error("All fields required");
      return;
    }
    try {
      const data = await createGalleryItem(d);
      setItems((p) => [data.galleryItem, ...p]);
      toast.success("Added to gallery");
      setOpen(false);
      setD({ title: "", category: "Indoor Styling", image: "" });
    } catch (err) {
      toast.error(err.message || "Failed to save gallery item");
    }
  }

  async function del(id) {
    if (!confirm("Delete?")) return;
    try {
      await deleteGalleryItem(id);
      setItems((p) => p.filter((g) => (g._id || g.id) !== id));
      toast.success("Deleted from gallery");
    } catch (err) {
      toast.error(err.message || "Failed to delete gallery item");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        subtitle="Manage gallery photos"
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/95 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        }
      />
      {loading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Loading gallery...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => {
          const id = g._id || g.id;
          const image = g.image || g.after || g.before;
          return (
          <div key={id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={image} alt={g.title} className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{g.title}</div>
                <div className="text-xs text-muted-foreground">{g.category}</div>
              </div>
              <button
                onClick={() => del(id)}
                className="rounded-md border border-border p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          );
        })}
        {items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            No photos in gallery. Click Add to create one.
          </div>
        )}
      </div>
      )}

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
                <label className="text-xs font-semibold">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => e.target.files?.[0] && handleUploadImage(e.target.files[0])}
                  className="mt-1 w-full text-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-border file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
                />
                {uploadingImage && (
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Uploading to Cloudinary...
                  </div>
                )}
                {!uploadingImage && d.image && (
                  <img
                    src={d.image}
                    alt="Gallery preview"
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
                disabled={uploadingImage}
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
