import React from "react";
import { createFileRoute, useNavigate } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useAuth } from "../lib/auth";
import { useState } from "react";
import { toast } from "sonner";
import { createBooking } from "../api";
const Route = createFileRoute("/dashboard/book")({ component: Page });
const SERVICES = ["Indoor Plant Styling", "Balcony Makeover", "Landscaping", "Plant Wellness", "Fertilizing", "Partial Maintenance", "Fully Customized Maintenance"];
function Page() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ service: SERVICES[0], date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  async function book(e) {
    e.preventDefault();
    if (!form.address) {
      toast.error("Add your address");
      return;
    }
    if (!user) {
      toast.error("Please login before booking a service");
      navigate({ to: "/login" });
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        serviceType: form.service,
        date: form.date,
        address: form.address,
        notes: form.notes,
        amount: 0
      });
      toast.success("Booking requested!");
      navigate({ to: "/dashboard/bookings" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }
  return <div className="space-y-6">
      <PageHeader title="Book a service" subtitle="We'll confirm within 24 hours" />
      <form onSubmit={book} className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <label className="text-xs font-medium">Service</label>
          <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium">Preferred date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium">Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium">Notes</label>
          <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <button disabled={submitting} type="submit" className="w-full rounded-full bg-primary py-3 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {submitting ? "Requesting..." : "Request booking"}
        </button>
      </form>
    </div>;
}
export {
  Route
};
