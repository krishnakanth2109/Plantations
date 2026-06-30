import React, { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { PageHeader, Badge } from "../components/dashboard/DashboardShell";
import { Plus, ToggleLeft, ToggleRight, Loader2, ShieldCheck, Mail, Phone, MapPin, Calendar, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { getAdmins, createAdmin, toggleAdminStatus, deleteAdmin, updateAdmin } from "../api";

const Route = createFileRoute("/superadmin/admins")({ component: Page });
const emptyForm = { name: "", email: "", password: "", phone: "", address: "" };

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function Page() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.role !== "superadmin") {
      navigate({ to: "/superadmin" });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "superadmin") return;
    async function load() {
      try {
        const data = await getAdmins();
        setItems(data.admins || []);
      } catch (err) {
        toast.error(err.message || "Failed to load admins");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user || user.role !== "superadmin") {
    return null;
  }

  const filtered = items.filter((i) =>
    (i.name + i.email + (i.phone || "")).toLowerCase().includes(q.toLowerCase())
  );

  async function handleCreate() {
    if (!editing) return;
    if (!editing.name || !editing.email || !editing.password) {
      toast.error("Name, email, and password are required");
      return;
    }
    if (editing.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const data = await createAdmin(editing);
      setItems((prev) => [data.user, ...prev]);
      toast.success("Admin account created successfully!");
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Failed to create admin");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!editing) return;
    if (!editing.name) {
      toast.error("Name is required");
      return;
    }
    if (editing.password && editing.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const data = await updateAdmin(editing.id, {
        name: editing.name,
        password: editing.password || undefined,
      });

      let finalUser = data.user;

      const original = items.find((item) => item.id === editing.id);
      if (original && original.isActive !== editing.isActive) {
        const confirmMessage = original.isActive
          ? "Are you sure you want to deactivate this admin account? They will lose access immediately and be logged out of active sessions."
          : "Are you sure you want to activate this admin account?";
        
        if (confirm(confirmMessage)) {
          const updatedStatus = await toggleAdminStatus(editing.id, editing.isActive);
          finalUser = updatedStatus.user;
        } else {
          // Revert isActive state in local editing if cancelled
          editing.isActive = original.isActive;
        }
      }

      setItems((prev) => prev.map((item) => (item.id === editing.id ? finalUser : item)));
      toast.success("Admin account updated successfully!");
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Failed to update admin");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAdmin(id) {
    if (!confirm("Are you sure you want to permanently delete this admin account? This action cannot be undone.")) return;
    try {
      await deleteAdmin(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Admin account has been permanently deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete admin account");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admins"
        subtitle={`${items.length} administrator accounts`}
        action={
          <button
            onClick={() => setEditing({ ...emptyForm })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Admin
          </button>
        }
      />

      <div className="relative max-w-md">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search administrators by name, email..."
          className="w-full rounded-xl border border-[#eadfce] bg-card px-4 py-2.5 text-sm outline-none focus:border-primary shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading administrators...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#f6efe5] text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3.5 text-left font-semibold">Name</th>
                <th className="px-4 py-3.5 text-left font-semibold">Contact Information</th>
                <th className="px-4 py-3.5 text-left font-semibold">Address</th>
                <th className="px-4 py-3.5 text-left font-semibold">Status</th>
                <th className="px-4 py-3.5 text-left font-semibold">Joined At</th>
                <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((admin) => (
                <tr key={admin.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-4 font-semibold text-[#1f271f]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                      <span>{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                        {admin.email}
                      </span>
                      {admin.phone && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {admin.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {admin.address ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                        {admin.address}
                      </span>
                    ) : (
                      <span className="text-xs italic text-muted-foreground/50">No address specified</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={admin.isActive ? "success" : "danger"}>
                      {admin.isActive ? "Active" : "Deactivated"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {formatDate(admin.joinedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => setEditing({ id: admin.id, name: admin.name, isActive: admin.isActive, password: "" })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border p-1.5 text-xs font-semibold shadow-sm transition-all hover:bg-secondary hover:text-primary"
                        title="Edit Admin"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border p-1.5 text-xs font-semibold shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        title="Delete Admin"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No administrator accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl text-primary font-semibold">
              {editing.id ? "Edit Admin Account" : "Create Admin Account"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {editing.id
                ? "Modify display name and/or set a new password."
                : "Provide account credentials and contact info. Newly created admins can log in immediately."}
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1f271f]">Full Name</label>
                <input
                  required
                  placeholder="e.g. John Doe"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#eadfce] bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {!editing.id && (
                <div>
                  <label className="text-xs font-semibold text-[#1f271f]">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="name@yogini.com"
                    value={editing.email || ""}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#eadfce] bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#1f271f]">
                  {editing.id ? "New Password (leave blank to keep current)" : "Password"}
                </label>
                <input
                  required={!editing.id}
                  type="password"
                  placeholder={editing.id ? "At least 6 characters" : "At least 6 characters"}
                  value={editing.password || ""}
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#eadfce] bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {editing.id && (
                <div>
                  <label className="text-xs font-semibold text-[#1f271f]">Account Status</label>
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, isActive: !editing.isActive })}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                        editing.isActive
                          ? "text-emerald-600 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
                          : "text-rose-600 border-rose-200 bg-rose-50/50 hover:bg-rose-50"
                      }`}
                    >
                      {editing.isActive ? (
                        <>
                          <ToggleRight className="h-4 w-4" /> Active (Click to Deactivate)
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4" /> Deactivated (Click to Activate)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!editing.id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1f271f]">Phone Number</label>
                    <input
                      placeholder="+91 XXXXX XXXXX"
                      value={editing.phone || ""}
                      onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#eadfce] bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1f271f]">Office Address</label>
                    <input
                      placeholder="Address, City"
                      value={editing.address || ""}
                      onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#eadfce] bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  disabled={submitting}
                  className="rounded-full border border-border px-5 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editing.id ? handleUpdate : handleCreate}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-xs"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editing.id ? "Save Changes" : "Create Admin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
