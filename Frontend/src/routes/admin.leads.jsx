import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader, Badge, statusTone } from "../components/dashboard/DashboardShell";
import { createLead, getLeads, updateLeadStatus } from "../api";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const Route = createFileRoute("/admin/leads")({ component: Page });
const statuses = ["New", "Contacted", "Follow-up", "Converted", "Lost"];

function Page() {
  const [items, setItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", phone: "", source: "Admin", interest: "", status: "New" });

  useEffect(() => {
    getLeads()
      .then((data) => setItems(data.leads))
      .catch((error) => toast.error(error.message));
  }, []);

  async function setStatus(id, status) {
    try {
      const data = await updateLeadStatus(id, status);
      setItems((p) => p.map((l) => ((l._id || l.id) === id ? data.lead : l)));
      toast.success(`Lead ${status}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function add() {
    if (!draft.name || !draft.phone) {
      toast.error("Name and phone required");
      return;
    }
    try {
      const data = await createLead(draft);
      setItems((p) => [data.lead, ...p]);
      setAdding(false);
      setDraft({ name: "", phone: "", source: "Admin", interest: "", status: "New" });
      toast.success("Lead added");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Leads / CRM" subtitle="Track and convert enquiries" action={<button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add lead</button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statuses.map((st) => (
          <div key={st} className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">{st}</h3>
            <p className="text-xs text-muted-foreground">{items.filter((l) => l.status === st).length} leads</p>
            <div className="mt-4 space-y-3">
              {items.filter((l) => l.status === st).map((l) => {
                const id = l._id || l.id;
                return (
                  <div key={id} className="rounded-lg border border-border bg-background p-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.phone}</div>
                    <div className="mt-1 text-xs">{l.interest}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge tone={statusTone(l.source)}>{l.source}</Badge>
                      <select value={l.status} onChange={(e) => setStatus(id, e.target.value)} className="rounded border border-input bg-background px-1 py-0.5 text-xs">
                        {statuses.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setAdding(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">Add lead</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <input placeholder="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <input placeholder="Interest" value={draft.interest} onChange={(e) => setDraft({ ...draft, interest: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm" />
              <select value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} className="w-full rounded-lg border border-input px-3 py-2 text-sm">
                {["Website", "WhatsApp", "Instagram", "Phone", "Email", "Referral", "Admin"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setAdding(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
              <button onClick={add} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
