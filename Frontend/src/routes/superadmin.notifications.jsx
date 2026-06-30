import React, { useEffect, useState } from "react";
import { createFileRoute } from "../lib/router";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Bell, Trash2 } from "lucide-react";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead, deleteNotification } from "../api";
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

  const [deletingId, setDeletingId] = useState(null);

  const markSingleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      window.dispatchEvent(new CustomEvent("yp-store-change", { detail: "notifications" }));
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const deleteSingle = (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const executeDelete = async (id) => {
    try {
      await deleteNotification(id);
      setItems((prev) => prev.filter((n) => (n._id || n.id) !== id));
      toast.success("Notification deleted");
      window.dispatchEvent(new CustomEvent("yp-store-change", { detail: "notifications" }));
    } catch (error) {
      toast.error("Failed to delete notification");
    } finally {
      setDeletingId(null);
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
            const isDeleting = deletingId === id;

            return (
              <div
                key={id}
                onClick={() => !n.read && !isDeleting && markSingleRead(id)}
                className={`flex items-start gap-4 rounded-2xl border p-5 transition ${
                  isDeleting 
                    ? "border-rose-500/20 bg-rose-500/5 cursor-default" 
                    : n.read 
                    ? "border-border bg-card opacity-80 cursor-pointer group/item" 
                    : "border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer group/item"
                }`}
              >
                {isDeleting ? (
                  <div className="flex-1 flex flex-wrap items-center justify-between gap-4 py-1.5 animate-in fade-in slide-in-from-right-3 duration-150">
                    <div className="flex items-center gap-2.5 text-sm text-rose-700 font-medium">
                      <span className="text-lg">⚠️</span>
                      <span>Delete this notification?</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(null);
                        }}
                        className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold hover:bg-secondary cursor-pointer transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          executeDelete(id);
                        }}
                        className="rounded-full bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-semibold text-white cursor-pointer transition shadow-sm"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Bell className={`h-5 w-5 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                    <div className="flex-1">
                      <div className="font-medium flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          {n.title}
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </span>
                        <button
                          onClick={(e) => deleteSingle(e, id)}
                          className="rounded-full p-1 hover:bg-secondary text-muted-foreground hover:text-rose-600 transition md:opacity-0 md:group-hover/item:opacity-100"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{n.body}</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(n.createdAt || n.date || Date.now()).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </>
                )}
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
