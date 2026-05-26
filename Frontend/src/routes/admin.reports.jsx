import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, StatCard } from "../components/dashboard/DashboardShell";
import { getAllBookings, getAllPayments, getAllSubscriptions, getLeads } from "../api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";
const Route = createFileRoute("/admin/reports")({ component: Page });
const COLORS = ["var(--primary)", "var(--accent)", "#a8c0a0", "#7d9b76", "#5a8a5c"];
function Page() {
  const [bookings, setBookings] = useState([]);
  const [subs, setSubs] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    Promise.all([getAllBookings(), getAllSubscriptions(), getLeads(), getAllPayments()])
      .then(([bookingData, subscriptionData, leadData, paymentData]) => {
        setBookings(bookingData.bookings);
        setSubs(subscriptionData.subscriptions);
        setLeads(leadData.leads);
        setPayments(paymentData.payments);
      })
      .catch((error) => toast.error(error.message));
  }, []);
  const revenue = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + (p.amount || 0), 0);
  const pending = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + (p.amount || 0), 0);
  const customers = new Set(bookings.map((b) => b.customerId?._id || b.customerId).filter(Boolean));
  const byService = Object.entries(bookings.reduce((acc, b) => {
    const service = b.serviceType || b.serviceId?.title || "Service";
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));
  const bySource = Object.entries(leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));
  function exportCSV() {
    const rows = [
      ["Metric", "Value"],
      ["Total revenue", revenue],
      ["Pending revenue", pending],
      ["Customers", customers.size],
      ["Bookings", bookings.length],
      ["Active subscriptions", subs.filter((s) => s.status === "Active").length],
      ["Leads", leads.length]
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `yogini-report-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Report exported");
  }
  return <div className="space-y-6">
      <PageHeader title="Reports & analytics" subtitle="Business performance overview" action={<button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm hover:bg-secondary"><Download className="h-4 w-4" /> Export CSV</button>} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={`\u20B9${revenue.toLocaleString("en-IN")}`} hint="Paid" />
        <StatCard label="Pending" value={`\u20B9${pending.toLocaleString("en-IN")}`} hint="To collect" />
        <StatCard label="Customers" value={customers.size} />
        <StatCard label="Conversion" value={`${Math.round(leads.filter((l) => l.status === "Converted").length / Math.max(1, leads.length) * 100)}%`} hint="Leads → customers" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl text-primary">Bookings by service</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byService}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="currentColor" fontSize={11} />
              <YAxis stroke="currentColor" fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl text-primary">Lead sources</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={bySource} dataKey="value" nameKey="name" outerRadius={90} label>
                {bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
}
export {
  Route
};