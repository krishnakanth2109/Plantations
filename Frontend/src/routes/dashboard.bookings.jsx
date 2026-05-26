import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { cancelBooking, getMyBookings } from "../api";

const Route = createFileRoute("/dashboard/bookings")({ component: Page });

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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const mine = items.filter((b) => (b.customerEmail ? b.customerEmail === user?.email : b.customer === user?.name));

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
  }, [setItems, user]);

  async function cancel(id) {
    if (!confirm("Cancel this booking?")) return;
    try {
      const data = await cancelBooking(id, "Cancelled by customer");
      setItems((p) => p.map((b) => (b.id === id ? mapBooking(data.booking) : b)));
      toast.success("Cancelled");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My bookings" subtitle={loading ? "Loading..." : `${mine.length} total`} />
      <div className="space-y-3">
        {mine.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
            <div>
              <div className="font-medium">{b.service}</div>
              <div className="text-xs text-muted-foreground">{b.date} - {b.address}</div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={statusTone(b.status)}>{b.status}</Badge>
              {b.status !== "Cancelled" && b.status !== "Completed" && (
                <button onClick={() => cancel(b.id)} className="rounded-full border border-border px-3 py-1 text-xs text-rose-600">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {mine.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}

export { Route };
