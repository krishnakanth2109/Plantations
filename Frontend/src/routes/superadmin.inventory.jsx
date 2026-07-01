import React, { useState, useEffect } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { Plus, Trash2, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { uploadFile, getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../api";

const Route = createFileRoute("/superadmin/inventory")({ component: Page });

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [d, setD] = useState({ name: "", category: "Plant", stock: 0, unit: "pcs", price: 0, image: "" });

  useEffect(() => {
    getInventory()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load inventory");
        setLoading(false);
      });
  }, []);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadFile(file, "inventory");
      setD(prev => ({ ...prev, image: res.url }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function add() {
    if (!d.name) {
      toast.error("Name required");
      return;
    }
    try {
      const newItem = await createInventoryItem(d);
      setItems((p) => [newItem, ...p]);
      setOpen(false);
      setD({ name: "", category: "Plant", stock: 0, unit: "pcs", price: 0, image: "" });
      toast.success("Item added");
    } catch (err) {
      toast.error(err.message || "Failed to add item");
    }
  }

  async function adjust(id, n) {
    const item = items.find((i) => i._id === id);
    if (!item) return;
    const newStock = Math.max(0, item.stock + n);
    try {
      const updated = await updateInventoryItem(id, { stock: newStock });
      setItems((p) => p.map((i) => i._id === id ? updated : i));
    } catch (err) {
      toast.error("Failed to update stock");
    }
  }

  async function del(id) {
    if (!confirm("Delete?")) return;
    try {
      await deleteInventoryItem(id);
      setItems((p) => p.filter((i) => i._id !== id));
      toast.success("Item deleted");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  }

  const low = items.filter((i) => i.stock <= 5).length;
  
  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return <div className="space-y-6">
      <PageHeader title="Inventory" subtitle={`${items.length} SKUs \u2022 ${low} low stock`} action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"><Plus className="h-4 w-4" /> Add Item</button>} />
      
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left w-16">Image</th>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i._id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  {i.image ? (
                    <img src={i.image} alt={i.name} className="h-10 w-10 rounded-lg object-cover shadow-sm border border-border" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{i.name}</td>
                <td className="px-4 py-3"><Badge>{i.category}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjust(i._id, -1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background transition hover:bg-muted">−</button>
                    <span className={`w-10 text-center font-medium ${i.stock <= 5 ? "text-rose-600" : ""}`}>{i.stock} {i.unit}</span>
                    <button onClick={() => adjust(i._id, 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background transition hover:bg-muted">+</button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">₹{i.price}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => del(i._id)} className="rounded-lg p-2 text-rose-600/70 transition hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                  No inventory items found. Add some products!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md scale-100 rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl tracking-tight text-foreground">Add New Item</h3>
            <p className="mt-1 text-sm text-muted-foreground">Fill in the details to add a new product to inventory.</p>
            
            <div className="mt-6 space-y-4">
              {/* Image Upload Area */}
              <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 transition-all hover:bg-muted/50">
                {d.image ? (
                  <div className="relative w-full flex justify-center">
                    <img src={d.image} alt="Preview" className="h-32 w-32 rounded-xl object-cover shadow-md" />
                    <button 
                      onClick={() => setD({...d, image: ""})} 
                      className="absolute -top-3 -right-3 rounded-full bg-background p-1.5 text-muted-foreground shadow-sm border border-border hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">JPEG, PNG or WebP</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 cursor-pointer opacity-0" 
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Name</label>
                <input placeholder="e.g. Monstera Deliciosa" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                <select value={d.category} onChange={(e) => setD({ ...d, category: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  {["Plant", "Pot", "Care", "Tools", "Decor"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</label>
                  <input type="number" min="0" placeholder="0" value={d.stock} onChange={(e) => setD({ ...d, stock: +e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit</label>
                  <input placeholder="pcs" value={d.unit} onChange={(e) => setD({ ...d, unit: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price (₹)</label>
                  <input type="number" min="0" placeholder="0.00" value={d.price} onChange={(e) => setD({ ...d, price: +e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted">Cancel</button>
              <button onClick={add} disabled={uploading} className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50">Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>;
}

export { Route };
