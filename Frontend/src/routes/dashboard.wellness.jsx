import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { createWellnessTicket, getMyWellnessTickets } from "../api";
import { toast } from "sonner";

const Route = createFileRoute("/dashboard/wellness")({ component: Page });

function mapTicket(ticket) {
  return {
    id: ticket._id || ticket.id,
    issue: ticket.issue,
    status: ticket.status,
    diagnosis: ticket.diagnosis,
    created: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-IN") : "",
  };
}

function Page() {
  const [items, setItems] = useState([]);
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMyWellnessTickets()
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

  async function raise() {
    if (!issue) {
      toast.error("Describe the issue");
      return;
    }
    setSubmitting(true);
    try {
      const data = await createWellnessTicket({ issue });
      setItems((p) => [mapTicket(data.ticket), ...p]);
      setIssue("");
      toast.success("Ticket raised. Expert will respond soon.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Plant wellness support" subtitle={loading ? "Loading tickets..." : "Raise an issue and our experts will diagnose"} />
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl">Raise a new issue</h3>
        <textarea rows={3} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Money plant leaves turning yellow..." className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <button disabled={submitting} onClick={raise} className="mt-3 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-60">
          {submitting ? "Submitting..." : "Submit ticket"}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{t.created}</div>
              <Badge tone={statusTone(t.status)}>{t.status}</Badge>
            </div>
            <h4 className="mt-1 font-medium">{t.issue}</h4>
            {t.diagnosis && <p className="mt-2 rounded-lg bg-secondary/60 p-3 text-sm"><strong>Expert says:</strong> {t.diagnosis}</p>}
          </div>
        ))}
        {!loading && items.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No wellness tickets yet.</div>}
      </div>
    </div>
  );
}

export { Route };
