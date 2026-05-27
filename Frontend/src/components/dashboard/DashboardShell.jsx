import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "../../lib/router";
import { useEffect, useState } from "react";
import { useAuth, logout } from "../../lib/auth";
import { seedIfEmpty } from "../../lib/seed";
import logo from "../../assets/logo.png";
import { LogOut, Menu, X, Bell } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";
import { getUnreadNotificationCount } from "../../api";

function DashboardShell({ role, nav, title }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    seedIfEmpty();
  }, []);

  useEffect(() => {
    if (!user) return;
    getUnreadNotificationCount()
      .then((data) => setUnreadCount(data.count))
      .catch((err) => console.error("Error fetching unread count:", err));
  }, [user]);

  useSocket((notif) => {
    setUnreadCount((prev) => prev + 1);
  });

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role !== role) {
      navigate({ to: user.role === "admin" ? "/admin" : "/dashboard" });
    }
  }, [user, ready, role, navigate]);

  if (!ready || !user || user.role !== role) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  return <div className="flex min-h-screen bg-background">
    {
      /* Sidebar */
    }
    <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0`}>
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
        <img src={logo} alt="" className="h-10 w-10 rounded-full" />
        <div>
          <div className="font-display text-lg text-sidebar-foreground">Yogini Planters</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-4">
        {nav.map((n) => {
          const active = location.pathname === n.to || n.to !== `/${role === "admin" ? "admin" : "dashboard"}` && location.pathname.startsWith(n.to);
          return <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
            <n.icon className="h-4 w-4" /> {n.label}
          </Link>;
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">{user.name[0]}</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <button onClick={() => {
          logout();
          navigate({ to: "/" });
        }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm hover:bg-secondary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>

    {
      /* Main */
    }
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle">{open ? <X /> : <Menu />}</button>
        <div className="hidden lg:block">
          <div className="font-display text-lg text-primary">{title}</div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={role === "admin" ? "/admin/notifications" : "/dashboard/notifications"} className="relative rounded-full border border-border bg-card p-2 hover:bg-secondary">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">View site →</Link>
        </div>
      </header>
      <main className="flex-1 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>;
}
function StatCard({ label, value, hint }) {
  return <div className="rounded-2xl border border-border bg-card p-5">
    <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    <div className="mt-2 font-display text-3xl text-primary">{value}</div>
    {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
  </div>;
}
function PageHeader({ title, subtitle, action }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="font-display text-3xl text-primary">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {action}
  </div>;
}
function Badge({ tone = "default", children }) {
  const tones = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-800",
    danger: "bg-rose-100 text-rose-800",
    info: "bg-sky-100 text-sky-800"
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
function statusTone(status) {
  const s = status.toLowerCase();
  if (["completed", "approved", "active", "paid", "resolved", "converted"].includes(s)) return "success";
  if (["pending", "new", "open", "scheduled", "follow-up"].includes(s)) return "info";
  if (["ongoing", "in progress", "contacted", "diagnosed", "paused"].includes(s)) return "warn";
  if (["cancelled", "lost"].includes(s)) return "danger";
  return "default";
}
function ComingSoon({ title, description }) {
  return <div>
    <PageHeader title={title} subtitle={description} />
    <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl">🌱</div>
      <h3 className="mt-4 font-display text-2xl text-primary">Module structure ready</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        The {title} module is wired into the dashboard. Full functionality (CRUD + database persistence) will be enabled when Lovable Cloud is connected.
      </p>
    </div>
  </div>;
}
export {
  Badge,
  ComingSoon,
  DashboardShell,
  PageHeader,
  StatCard,
  statusTone
};
