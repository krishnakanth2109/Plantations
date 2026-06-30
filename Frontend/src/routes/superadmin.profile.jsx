import React, { useState, useEffect } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useAuth, refreshMe } from "../lib/auth";
import { useStore } from "../lib/store";
import { forgotPassword, updateProfile } from "../api";
import { toast } from "sonner";
import { Mail, Shield } from "lucide-react";

const Route = createFileRoute("/superadmin/profile")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [p, setP] = useStore("superadmin-profile", {
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || ""
  });

  const [sendingReset, setSendingReset] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setP((current) => ({
      name: current.name || user.name || "",
      phone: current.phone || user.phone || "",
      email: current.email || user.email || "",
      address: current.address || user.address || ""
    }));
  }, [user, setP]);

  async function handleSendResetEmail() {
    if (!user?.email) {
      toast.error("No registered email found.");
      return;
    }
    setSendingReset(true);
    try {
      await forgotPassword(user.email);
      toast.success("A password reset link has been sent to your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset link.");
    } finally {
      setSendingReset(false);
    }
  }

  async function handleSaveChanges() {
    if (!p.name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name: p.name,
        phone: p.phone,
        address: p.address
      });
      await refreshMe();
      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your personal details & dashboard credentials"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Personal details */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl text-primary font-semibold">Account Details</h2>
          </div>
          {["name", "phone", "email", "address"].map((k) => (
            <div key={k}>
              <label className="text-xs font-semibold capitalize text-[#1f271f]">{k}</label>
              <input 
                value={p[k]} 
                onChange={(e) => setP({ ...p, [k]: e.target.value })} 
                disabled={k === "email"}
                className="mt-1 w-full rounded-lg border border-[#eadfce] bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition disabled:opacity-60" 
              />
            </div>
          ))}
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 font-semibold"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        {/* Right Column: Security / Password Management */}
        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl text-primary flex items-center gap-2 border-b border-border pb-3 font-semibold">
              <Mail className="h-5 w-5 text-primary" /> Password Security
            </h2>
            <p className="text-xs text-muted-foreground">
              Click the button below to receive an email with a secure link to reset your password using Firebase Authentication.
            </p>
            <button 
              type="button"
              onClick={handleSendResetEmail}
              disabled={sendingReset}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold hover:bg-muted transition disabled:opacity-60"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              {sendingReset ? "Sending link..." : "Send Reset Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Route };
