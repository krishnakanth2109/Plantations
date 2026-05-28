import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { cancelBooking, getMyBookings, createBooking } from "../api";

const Route = createFileRoute("/dashboard/bookings")({ component: Page });

const SERVICES = [
  "Indoor Plant Styling",
  "Balcony Makeover",
  "Landscaping",
  "Plant Wellness",
  "Fertilizing",
  "Partial Maintenance",
  "Fully Customized Maintenance",
];

function mapBooking(booking) {
  return {
    id: booking._id || booking.id,
    customer: booking.customerId?.name || booking.customer || "",
    customerEmail: booking.customerId?.email || booking.customerEmail || "",
    service: booking.serviceId?.title || booking.serviceType || booking.service,
    date: booking.date ? new Date(booking.date).toLocaleDateString("en-IN") : "",
    address: booking.address,
    status: booking.status,
    amount: booking.amount || 0,
  };
}

function Page() {
  const { user } = useAuth();
  
  // Bookings list states
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const mine = items.filter((b) => (b.customerEmail ? b.customerEmail === user?.email : b.customer === user?.name));

  // Request booking form states
  const [form, setForm] = useState({
    service: SERVICES[0],
    date: new Date().toISOString().slice(0, 10),
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getMyBookings()
      .then((data) => {
        if (active) setItems(data.bookings.map(mapBooking));
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  // Handle Form Submission (Create Booking)
  async function handleBook(e) {
    e.preventDefault();
    if (!form.address) {
      toast.error("Add your address");
      return;
    }
    if (!user) {
      toast.error("Please login before booking a service");
      return;
    }

    setSubmitting(true);
    try {
      const data = await createBooking({
        serviceType: form.service,
        date: form.date,
        address: form.address,
        notes: form.notes,
        amount: 0,
      });
      toast.success("Booking requested successfully!");
      // Add the new booking directly to the right-side list!
      setItems((prev) => [mapBooking(data.booking), ...prev]);
      // Reset only notes while maintaining address
      setForm((prev) => ({ ...prev, notes: "" }));
    } catch (error) {
      toast.error(error.message || "Failed to submit booking request");
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Cancel Booking
  async function handleCancel(id) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const data = await cancelBooking(id, "Cancelled by customer");
      setItems((prev) => prev.map((b) => (b.id === id ? mapBooking(data.booking) : b)));
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" subtitle="Book new services and manage your active schedule" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Book a Service Form (5 columns wide on desktop) */}
        <div className="lg:col-span-5 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h3 className="font-display text-xl text-primary">Book a Service</h3>
          <p className="text-xs text-muted-foreground pb-2">We will review and confirm your request within 24 hours.</p>
          
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground/80">Select Service</label>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              >
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-foreground/80">Preferred Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-foreground/80">Service Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Where should our experts visit?"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-foreground/80">Additional Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special instructions or plant details..."
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              />
            </div>
            
            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Requesting..." : "Request Booking"}
            </button>
          </form>
        </div>

        {/* Right Side: My Bookings List (7 columns wide on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl text-primary">My Bookings</h3>
            <span className="text-xs text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full font-medium">
              {loading ? "Loading..." : `${mine.length} Total`}
            </span>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {mine.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 transition hover:shadow-xs"
              >
                <div>
                  <div className="font-medium text-foreground">{b.service}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {b.date} &bull; {b.address}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                  {b.status !== "Cancelled" && b.status !== "Completed" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {!loading && mine.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                <p>No bookings requested yet.</p>
                <p className="text-xs mt-1 text-muted-foreground/80">Use the form on the left to schedule your first plant styling or wellness service!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Route };
