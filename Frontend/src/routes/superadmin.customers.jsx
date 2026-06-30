import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api";

const Route = createFileRoute("/superadmin/customers")({ component: Page });
const empty = { id: "", name: "", email: "", phone: "", address: "", tag: "Homeowner" };

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
};

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getCustomers();
        setItems(data);
      } catch (err) {
        toast.error(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = items.filter((i) =>
    (i.name + i.email + (i.phone || "")).toLowerCase().includes(q.toLowerCase())
  );

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.email) {
      toast.error("Name and email required");
      return;
    }
    try {
      if (editing.id) {
        const updated = await updateCustomer(editing.id, editing);
        setItems((p) => p.map((c) => (c.id === editing.id ? updated : c)));
        toast.success("Customer updated");
      } else {
        const created = await createCustomer(editing);
        setItems((p) => [created, ...p]);
        toast.success("Customer added");
      }
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Failed to save customer");
    }
  }

  async function del(id) {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      setItems((p) => p.filter((c) => c.id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete customer");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle={`${items.length} total`}
        action={
          <button
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add customer
          </button>
        }
      />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, email or phone…"
        className="w-full max-w-md rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />

      {loading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading customers...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Tag</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <div>{c.email}</div>
                    <div className="text-xs text-muted-foreground">{c.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.address}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        c.tag === "VIP"
                          ? "warn"
                          : c.tag === "Commercial"
                          ? "info"
                          : "default"
                      }
                    >
                      {c.tag}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(c.joinedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(c)}
                        className="rounded-md border border-border p-1.5 hover:bg-secondary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => del(c.id)}
                        className="rounded-md border border-border p-1.5 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl text-primary">
              {editing.id ? "Edit customer" : "Add customer"}
            </h3>
            <div className="mt-5 space-y-3">
              {[
                { k: "name", l: "Name" },
                { k: "email", l: "Email" },
                { k: "phone", l: "Phone" },
                { k: "address", l: "Address" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-xs font-medium">{f.l}</label>
                  <input
                    value={editing[f.k] || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, [f.k]: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium">Tag</label>
                <select
                  value={editing.tag || "Homeowner"}
                  onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {["Homeowner", "Repeat", "VIP", "Commercial"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-full border border-border px-5 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90"
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

