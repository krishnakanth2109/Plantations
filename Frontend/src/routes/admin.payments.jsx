import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { getAllPayments, updatePaymentStatus } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/admin/payments")({ component: Page });

function mapPayment(payment) {
  return {
    id: payment._id || payment.id,
    invoice: payment.invoiceNumber,
    customer: payment.customerId?.name || "",
    date: payment.date ? new Date(payment.date).toLocaleDateString("en-IN") : "",
    method: payment.method,
    amount: payment.amount || 0,
    status: payment.status,
  };
}

function Page() {
  const [items, setItems] = useState([]);
  const total = items.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pending = items.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  useEffect(() => {
    getAllPayments()
      .then((data) => setItems(data.payments.map(mapPayment)))
      .catch((error) => toast.error(error.message));
  }, []);

  async function toggle(payment) {
    const status = payment.status === "Paid" ? "Pending" : "Paid";
    try {
      const data = await updatePaymentStatus(payment.id, status);
      setItems((prev) => prev.map((x) => (x.id === payment.id ? mapPayment(data.payment) : x)));
      toast.success(`Payment ${status}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return <div className="space-y-6">
      <PageHeader title="Payments & billing" subtitle="Invoices and payment tracking" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Collected</div><div className="mt-1 font-display text-2xl text-primary">Rs. {total.toLocaleString("en-IN")}</div></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Pending</div><div className="mt-1 font-display text-2xl text-accent">Rs. {pending.toLocaleString("en-IN")}</div></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Invoices</div><div className="mt-1 font-display text-2xl">{items.length}</div></div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th><th /></tr></thead>
          <tbody>{items.map((p) => <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">{p.invoice}</td>
              <td className="px-4 py-3">{p.customer}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
              <td className="px-4 py-3">{p.method}</td>
              <td className="px-4 py-3">Rs. {p.amount.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
              <td className="px-4 py-3"><button onClick={() => toggle(p)} className="rounded border border-border px-2 py-1 text-xs">Toggle</button></td>
            </tr>)}</tbody>
        </table>
      </div>
    </div>;
}

export { Route };
