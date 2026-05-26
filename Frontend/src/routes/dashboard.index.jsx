import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { StatCard, PageHeader } from "../components/dashboard/DashboardShell";
import { useAuth } from "../lib/auth";
import { Link } from "../lib/router";
import { getMyBookings, getMyPayments, getMySubscriptions, getMyWellnessTickets } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [subs, setSubs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    Promise.all([getMyBookings(), getMySubscriptions(), getMyWellnessTickets(), getMyPayments()])
      .then(([bookingData, subscriptionData, ticketData, paymentData]) => {
        setBookings(bookingData.bookings);
        setSubs(subscriptionData.subscriptions);
        setTickets(ticketData.tickets);
        setPayments(paymentData.payments);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} subtitle="Your plant wellness summary" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active bookings" value={bookings.filter((b) => !["Completed", "Cancelled"].includes(b.status)).length} />
        <StatCard label="Maintenance plans" value={subs.filter((s) => s.status === "Active").length} />
        <StatCard label="Wellness tickets" value={tickets.length} />
        <StatCard label="Pending payments" value={`Rs. ${payments.filter((p) => p.status === "Pending").reduce((s, p) => s + (p.amount || 0), 0).toLocaleString("en-IN")}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl">Quick actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link to="/dashboard/book" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">Book a service</div><div className="text-xs text-muted-foreground">Indoor, balcony, wellness...</div></Link>
            <Link to="/dashboard/wellness" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">Raise plant issue</div><div className="text-xs text-muted-foreground">Get expert diagnosis</div></Link>
            <Link to="/dashboard/maintenance" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">View my plan</div><div className="text-xs text-muted-foreground">Maintenance schedule</div></Link>
            <Link to="/dashboard/library" className="rounded-xl border border-border bg-secondary/40 p-4 hover:border-primary"><div className="font-medium">Plant care library</div><div className="text-xs text-muted-foreground">Tips & guides</div></Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl">Recent activity</h3>
          <ul className="mt-4 space-y-3">
            {bookings.slice(0, 2).map((booking) => (
              <li key={booking._id || booking.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="text-sm font-medium">{booking.serviceType}</div>
                <div className="text-xs text-muted-foreground">{booking.status}</div>
              </li>
            ))}
            {tickets.slice(0, 2).map((ticket) => (
              <li key={ticket._id || ticket.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="text-sm font-medium">{ticket.issue}</div>
                <div className="text-xs text-muted-foreground">{ticket.status}</div>
              </li>
            ))}
            {bookings.length === 0 && tickets.length === 0 && <li className="rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-sm text-muted-foreground">No recent activity yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export { Route };
