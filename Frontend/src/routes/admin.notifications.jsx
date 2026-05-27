import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Bell } from "lucide-react";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "../api";
import { useSocket } from "../hooks/useSocket";
import { toast } from "sonner";

const Route = createFileRoute("/admin/notifications")({ component: Page });

function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setItems(data.notifications || []);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen to incoming real-time notifications via WebSockets
  useSocket((newNotif) => {
    setItems((prev) => [newNotif, ...prev]);
  });

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All marked as read");
      window.dispatchEvent(new CustomEvent("yp-store-change", { detail: "notifications" }));
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const markSingleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      window.dispatchEvent(new CustomEvent("yp-store-change", { detail: "notifications" }));
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Recent administrative activity"
        action={
          items.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="rounded-full border border-border px-4 py-2 text-sm bg-card hover:bg-secondary transition"
            >
              Mark all read
            </button>
          )
        }
      />
      
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading notifications...</div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const id = n._id || n.id;
            return (
              <div
                key={id}
                onClick={() => !n.read && markSingleRead(id)}
                className={`flex items-start gap-4 rounded-2xl border p-5 transition cursor-pointer ${
                  n.read ? "border-border bg-card opacity-80" : "border-primary/30 bg-primary/5 hover:bg-primary/10"
                }`}
              >
                <Bell className={`h-5 w-5 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {n.title}
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{n.body}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(n.createdAt || n.date || Date.now()).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
              <p>No new administrative alerts.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { Route };
