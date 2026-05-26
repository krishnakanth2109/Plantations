import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { getMyPayments } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/payments")({ component: Page });

function mapPayment(payment) {
  return {
    id: payment._id || payment.id,
    invoice: payment.invoiceNumber,
    date: payment.date ? new Date(payment.date).toLocaleDateString("en-IN") : "",
    amount: payment.amount || 0,
    status: payment.status,
  };
}

function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getMyPayments()
      .then((data) => setItems(data.payments.map(mapPayment)))
      .catch((error) => toast.error(error.message));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="My payments" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Invoice</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
          <tbody>{items.map((p) => <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">{p.invoice}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
              <td className="px-4 py-3">Rs. {p.amount.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
            </tr>)}</tbody>
        </table>
        {items.length === 0 && <div className="p-10 text-center text-muted-foreground">No payments yet.</div>}
      </div>
    </div>
  );
}

export { Route };
