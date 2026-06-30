import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { toast } from "sonner";
import { getAllBookings, updateBookingStatus } from "../api";

const Route = createFileRoute("/superadmin/bookings")({ component: Page });
const statuses = ["Pending", "Approved", "Scheduled", "Ongoing", "Completed", "Cancelled"];

function mapBooking(booking) {
  return {
    id: booking._id || booking.id,
    customer: booking.customerId?.name || booking.customer || "",
    service: booking.serviceId?.title || booking.serviceType || booking.service,
    date: booking.date ? new Date(booking.date).toLocaleDateString("en-IN") : "",
    amount: booking.amount || 0,
    status: booking.status,
  };
}

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllBookings()
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
  }, [setItems]);

  async function setStatus(id, status) {
    try {
      const data = await updateBookingStatus(id, { status });
      setItems((p) => p.map((c) => (c.id === id ? mapBooking(data.booking) : c)));
      toast.success(`Booking ${status}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Service bookings" subtitle={loading ? "Loading..." : `${items.length} bookings`} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{c.id.slice(0, 6)}</td>
                <td className="px-4 py-3 font-medium">{c.customer}</td>
                <td className="px-4 py-3">{c.service}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.date}</td>
                <td className="px-4 py-3">Rs. {c.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <select value={c.status} onChange={(e) => setStatus(c.id, e.target.value)} className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Route };
