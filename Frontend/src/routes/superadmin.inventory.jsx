import React, { useState, useEffect } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { uploadFile, getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../api";

const Route = createFileRoute("/superadmin/inventory")({ component: Page });

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [d, setD] = useState({ name: "", stock: 0, unit: "pcs", price: 0, images: [] });

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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if ((d.images || []).length + files.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }
    try {
      setUploading(true);
      const newUrls = [];
      for (const file of files) {
        const res = await uploadFile(file, "inventory");
        newUrls.push(res.url);
      }
      setD(prev => ({ ...prev, images: [...(prev.images || []), ...newUrls].slice(0, 3) }));
      toast.success("Image(s) uploaded!");
    } catch (err) {
      toast.error("Failed to upload image(s)");
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(item) {
    setD(item);
    setOpen(true);
  }

  async function add() {
    if (!d.name) {
      toast.error("Name required");
      return;
    }
    try {
      if (d._id) {
        const payload = { name: d.name, stock: d.stock, unit: d.unit, price: d.price, images: d.images };
        const updated = await updateInventoryItem(d._id, payload);
        setItems((p) => p.map((i) => (i._id === d._id ? updated : i)));
        toast.success("Item updated");
      } else {
        const payload = { name: d.name, stock: d.stock, unit: d.unit, price: d.price, images: d.images };
        const newItem = await createInventoryItem(payload);
        setItems((p) => [newItem, ...p]);
        toast.success("Item added");
      }
      setOpen(false);
      setD({ name: "", stock: 0, unit: "pcs", price: 0, images: [] });
    } catch (err) {
      toast.error(err.message || "Failed to save item");
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
      <PageHeader title="Inventory" subtitle={`${items.length} SKUs \u2022 ${low} low stock`} action={<button onClick={() => { setD({ name: "", stock: 0, unit: "pcs", price: 0, images: [] }); setOpen(true); }} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"><Plus className="h-4 w-4" /> Add Item</button>} />
      
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left w-16">Image</th>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i._id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  {i.images && i.images.length > 0 ? (
                    <img src={i.images[0]} alt={i.name} className="h-10 w-10 rounded-lg object-cover shadow-sm border border-border" />
                  ) : i.image ? (
                    <img src={i.image} alt={i.name} className="h-10 w-10 rounded-lg object-cover shadow-sm border border-border" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{i.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjust(i._id, -1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background transition hover:bg-muted">−</button>
                    <span className={`w-10 text-center font-medium ${i.stock <= 5 ? "text-rose-600" : ""}`}>{i.stock} {i.unit}</span>
                    <button onClick={() => adjust(i._id, 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background transition hover:bg-muted">+</button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">₹{i.price}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => handleEdit(i)} className="rounded-lg p-2 text-primary/70 transition hover:bg-primary/10 hover:text-primary mr-1">
                    <Edit2 className="h-4 w-4" />
                  </button>
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
            <h3 className="font-display text-2xl tracking-tight text-foreground">{d._id ? "Edit Item" : "Add New Item"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Fill in the details to {d._id ? "update the product in" : "add a new product to"} inventory.</p>
            
            <div className="mt-6 space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Images (Max 3)</label>
                <div className="flex gap-4 mb-4">
                  {(d.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative">
                      <img src={imgUrl} alt={`Preview ${idx + 1}`} className="h-24 w-24 rounded-xl object-cover shadow-md" />
                      <button 
                        onClick={() => {
                          const newImages = [...(d.images || [])];
                          newImages.splice(idx, 1);
                          setD({ ...d, images: newImages });
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-background p-1 text-muted-foreground shadow-sm border border-border hover:text-foreground"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {(!d.images || d.images.length < 3) && (
                  <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-4 transition-all hover:bg-muted/50">
                    <UploadCloud className="mb-1 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {uploading ? "Uploading..." : "Click to upload images"}
                    </p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="absolute inset-0 cursor-pointer opacity-0" 
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Name</label>
                <input placeholder="e.g. Monstera Deliciosa" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
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
              <button onClick={() => { setOpen(false); setD({ name: "", stock: 0, unit: "pcs", price: 0, images: [] }); }} className="rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted">Cancel</button>
              <button onClick={add} disabled={uploading} className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50">{d._id ? "Update Item" : "Save Item"}</button>
            </div>
          </div>
        </div>
      )}
    </div>;
}

export { Route };
