import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { getLeads, updateLeadStatus } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/admin/consultations")({ component: Page });
const statuses = ["New", "Scheduled", "In Progress", "Completed", "Cancelled"];
const consultationInterests = ["Indoor Plant Styling", "Balcony Makeover", "Landscaping", "Plant Wellness", "Fertilizing", "Partial Maintenance", "Fully Customized Maintenance"];

function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getLeads()
      .then((data) => setItems(data.leads.filter((lead) => consultationInterests.includes(lead.interest))))
      .catch((error) => toast.error(error.message));
  }, []);

  async function setStatus(id, status) {
    try {
      const data = await updateLeadStatus(id, status);
      setItems((p) => p.map((c) => ((c._id || c.id) === id ? data.lead : c)));
      toast.success(`Marked ${status}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" subtitle="Review and schedule consultation requests" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Notes</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3" /></tr>
          </thead>
          <tbody>
            {items.map((c) => {
              const id = c._id || c.id;
              return (
                <tr key={id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.interest}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : ""}</td>
                  <td className="px-4 py-3 max-w-xs text-muted-foreground">{c.message}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                  <td className="px-4 py-3">
                    <select value={c.status} onChange={(e) => setStatus(id, e.target.value)} className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                      {statuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Route };
