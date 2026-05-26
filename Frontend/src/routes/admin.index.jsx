import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { StatCard, PageHeader } from "../components/dashboard/DashboardShell";
import { getAllBookings, getAllPayments, getAllSubscriptions, getAllWellnessTickets, getLeads } from "../api";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, AreaChart, Area } from "recharts";
import { toast } from "sonner";
const Route = createFileRoute("/admin/")({
  component: AdminOverview
});
const monthly = [
  { m: "Dec", revenue: 142e3, bookings: 12 },
  { m: "Jan", revenue: 168e3, bookings: 16 },
  { m: "Feb", revenue: 191e3, bookings: 21 },
  { m: "Mar", revenue: 215e3, bookings: 24 },
  { m: "Apr", revenue: 248e3, bookings: 27 },
  { m: "May", revenue: 286e3, bookings: 31 }
];
const services = [
  { name: "Indoor", v: 38 },
  { name: "Balcony", v: 24 },
  { name: "Landscape", v: 11 },
  { name: "Wellness", v: 19 },
  { name: "Maintenance", v: 42 }
];
function AdminOverview() {
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    Promise.all([getAllBookings(), getAllSubscriptions(), getAllWellnessTickets(), getLeads(), getAllPayments()])
      .then(([bookingData, subscriptionData, ticketData, leadData, paymentData]) => {
        setBookings(bookingData.bookings);
        setSubscriptions(subscriptionData.subscriptions);
        setTickets(ticketData.tickets);
        setLeads(leadData.leads);
        setPayments(paymentData.payments);
      })
      .catch((error) => toast.error(error.message));
  }, []);
  const revenue = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + (p.amount || 0), 0);
  const subRevenue = subscriptions.filter((s) => s.status === "Active").length * 4500;
  return <div className="space-y-6">
      <PageHeader title="Dashboard overview" subtitle="Live snapshot of your business" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total customers" value={new Set(bookings.map((b) => b.customerId?._id || b.customerId)).size} hint="From bookings" />
        <StatCard label="Active projects" value={bookings.filter((b) => ["Approved", "Scheduled", "Ongoing"].includes(b.status)).length} />
        <StatCard label="New consultations" value={leads.filter((c) => c.status === "New").length} />
        <StatCard label="Pending maintenance" value={subscriptions.filter((s) => s.status === "Active").length} />
        <StatCard label="Ongoing plans" value={subscriptions.filter((s) => s.status === "Active").length} />
        <StatCard label="Completed projects" value={bookings.filter((b) => b.status === "Completed").length} />
        <StatCard label="Monthly revenue" value={`\u20B9${revenue.toLocaleString("en-IN")}`} hint="Paid this period" />
        <StatCard label="Subscription revenue" value={`\u20B9${subRevenue.toLocaleString("en-IN")}`} />
        <StatCard label="Contact leads" value={leads.length} />
        <StatCard label="WhatsApp enquiries" value={leads.filter((l) => l.source === "WhatsApp").length} />
        <StatCard label="Wellness cases" value={tickets.length} />
        <StatCard label="Balcony projects" value={bookings.filter((b) => (b.serviceType || "").includes("Balcony")).length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <h3 className="font-display text-xl text-primary">Monthly revenue</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="m" stroke="currentColor" fontSize={12} />
              <YAxis stroke="currentColor" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl text-primary">Service bookings</h3>
          <p className="text-xs text-muted-foreground">Distribution by service</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={services}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
              <YAxis stroke="currentColor" fontSize={12} />
              <Tooltip />
              <Bar dataKey="v" fill="var(--accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-display text-xl text-primary">Customer growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="m" stroke="currentColor" fontSize={12} />
              <YAxis stroke="currentColor" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
}
export {
  Route
};
