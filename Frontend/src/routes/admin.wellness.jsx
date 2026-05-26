import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { diagnoseWellnessTicket, getAllWellnessTickets, resolveWellnessTicket } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/admin/wellness")({ component: Page });

function mapTicket(ticket) {
  return {
    id: ticket._id || ticket.id,
    customer: ticket.customerId?.name || "",
    issue: ticket.issue,
    status: ticket.status,
    diagnosis: ticket.diagnosis,
    created: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-IN") : "",
  };
}

function Page() {
  const [items, setItems] = useState([]);
  const [diag, setDiag] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllWellnessTickets()
      .then((data) => {
        if (active) setItems(data.tickets.map(mapTicket));
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function diagnose(id) {
    const text = diag[id];
    if (!text) {
      toast.error("Add diagnosis text");
      return;
    }
    try {
      const data = await diagnoseWellnessTicket(id, text);
      setItems((p) => p.map((t) => (t.id === id ? mapTicket(data.ticket) : t)));
      toast.success("Diagnosis sent");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function close(id) {
    try {
      const data = await resolveWellnessTicket(id);
      setItems((p) => p.map((t) => (t.id === id ? mapTicket(data.ticket) : t)));
      toast.success("Case closed");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Plant wellness tickets" subtitle={loading ? "Loading..." : "Diagnose & treat customer plant issues"} />
      <div className="space-y-4">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">{t.created} - {t.customer}</div>
                <h3 className="mt-1 font-display text-lg">{t.issue}</h3>
              </div>
              <Badge tone={statusTone(t.status)}>{t.status}</Badge>
            </div>
            {t.diagnosis && <p className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm"><strong>Diagnosis:</strong> {t.diagnosis}</p>}
            {t.status !== "Resolved" && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input value={diag[t.id] || ""} onChange={(e) => setDiag({ ...diag, [t.id]: e.target.value })} placeholder="Write diagnosis & care plan..." className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                <button onClick={() => diagnose(t.id)} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Send diagnosis</button>
                <button onClick={() => close(t.id)} className="rounded-full border border-border px-4 py-2 text-sm">Close case</button>
              </div>
            )}
          </div>
        ))}
        {!loading && items.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No wellness tickets yet.</div>}
      </div>
    </div>
  );
}

export { Route };
