import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { StatCard, PageHeader } from "../components/dashboard/DashboardShell";
import { useAuth } from "../lib/auth";
import { Link } from "../lib/router";
import { getMyBookings, getMyPayments, getMySubscriptions, getMyWellnessTickets } from "../api";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

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
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Human"}.`}
        subtitle="Your urban sanctuary is thriving. Today's plant-care summary is ready for review."
      />
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#a78b6a]">
          {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active bookings" value={bookings.filter((b) => !["Completed", "Cancelled"].includes(b.status)).length.toString().padStart(2, "0")} hint="Scheduled this week" />
          <StatCard label="Maintenance plan" value={subs.filter((s) => s.status === "Active").length} hint="Active coverage" />
          <StatCard label="Open ticket" value={tickets.filter((t) => t.status !== "Resolved").length} hint="Wellness checks" />
          <StatCard label="Pending payments" value={`Rs. ${payments.filter((p) => p.status === "Pending").reduce((s, p) => s + (p.amount || 0), 0).toLocaleString("en-IN")}`} hint="All clear when zero" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <h3 className="font-display text-2xl text-[#173822]">Quick actions</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { to: "/dashboard/book", title: "Book service", desc: "Indoor, balcony, wellness" },
              { to: "/dashboard/wellness", title: "Raise issue", desc: "Get expert diagnosis" },
              { to: "/dashboard/maintenance", title: "View plan", desc: "Maintenance schedule" },
              { to: "/dashboard/library", title: "Library", desc: "Plant care guides" },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="group rounded-2xl border border-[#eadfce] bg-[#fbf7f1] p-4 transition hover:border-primary hover:bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{item.title}</div>
                  <ArrowUpRight className="h-4 w-4 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="mt-2 text-xs text-[#7f6f5e]">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-[#173822]">Recent activity</h3>
            <Link to="/dashboard/bookings" className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">View all</Link>
          </div>
          <ul className="mt-5 space-y-3">
            {bookings.slice(0, 2).map((booking) => (
              <li key={booking._id || booking.id} className="rounded-2xl border border-[#eadfce] bg-[#fbf7f1] p-4">
                <div className="text-sm font-medium">{booking.serviceType}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-[#a78b6a]">{booking.status}</div>
              </li>
            ))}
            {tickets.slice(0, 2).map((ticket) => (
              <li key={ticket._id || ticket.id} className="rounded-2xl border border-[#eadfce] bg-[#fbf7f1] p-4">
                <div className="text-sm font-medium">{ticket.issue}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-[#a78b6a]">{ticket.status}</div>
              </li>
            ))}
            {bookings.length === 0 && tickets.length === 0 && <li className="rounded-2xl border border-dashed border-[#eadfce] bg-[#fbf7f1] p-4 text-sm text-muted-foreground">No recent activity yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export { Route };
