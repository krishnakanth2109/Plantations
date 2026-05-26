import React from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { useStore } from "../lib/store";
import { Bell } from "lucide-react";
const Route = createFileRoute("/admin/notifications")({ component: Page });
function Page() {
  const [items, setItems] = useStore("notifications", []);
  function markRead(id) {
    setItems((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  }
  return <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="Recent activity" action={<button onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))} className="rounded-full border border-border px-4 py-2 text-sm">Mark all read</button>} />
      <div className="space-y-3">
        {items.map((n) => <div key={n.id} className={`flex items-start gap-4 rounded-2xl border p-5 ${n.read ? "border-border bg-card" : "border-primary/30 bg-primary/5"}`}>
            <Bell className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-muted-foreground">{n.body}</div>
              <div className="mt-1 text-xs text-muted-foreground">{n.date}</div>
            </div>
            {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-primary">Mark read</button>}
          </div>)}
      </div>
    </div>;
}
export {
  Route
};
