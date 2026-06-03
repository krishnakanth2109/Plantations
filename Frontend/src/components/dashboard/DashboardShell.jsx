import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "../../lib/router";
import { useEffect, useState } from "react";
import { useAuth, logout } from "../../lib/auth";
import { seedIfEmpty } from "../../lib/seed";
import logo from "../../assets/logo.png";
import { LogOut, Menu, X, Bell, ArrowUpRight } from "lucide-react";
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
  const groupedNav = nav.reduce((groups, item) => {
    const section = item.section || "";
    if (!groups.some((group) => group.section === section)) groups.push({ section, items: [] });
    groups.find((group) => group.section === section).items.push(item);
    return groups;
  }, []);

  return <div className="flex min-h-screen bg-[#fbf7f1] text-[#1f271f]">
    {
      /* Sidebar */
    }
    <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#eadfce] bg-[#f6efe5] transition-transform lg:static lg:translate-x-0`}>
      <div className="flex h-24 items-center gap-3 border-b border-[#eadfce] px-6">
        <img src={logo} alt="" className="h-12 w-12 rounded-full border border-white shadow-sm" />
        <div>
          <div className="font-display text-xl text-[#173822]">Yogini Planters</div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#9b8062]">{title}</div>
        </div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {groupedNav.map((group) => (
          <div key={group.section || "primary"} className="space-y-1.5">
            {group.section && (
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a78b6a]">
                {group.section}
              </div>
            )}
            {group.items.map((n) => {
              const active = location.pathname === n.to || n.to !== `/${role === "admin" ? "admin" : "dashboard"}` && location.pathname.startsWith(n.to);
              return <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-[#4b443c] hover:bg-white/70 hover:text-primary"}`}>
                <span className="flex min-w-0 items-center gap-3">
                  <n.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{n.label}</span>
                </span>
                {n.badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>{n.badge}</span>}
              </Link>;
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-[#eadfce] p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173822] text-sm font-medium text-white">{user.name[0]}</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <button onClick={() => {
          logout();
          navigate({ to: "/" });
        }} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-3 py-2.5 text-sm hover:bg-secondary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>

    {
      /* Main */
    }
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#eadfce] bg-[#fbf7f1]/90 px-4 backdrop-blur lg:px-10">
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle">{open ? <X /> : <Menu />}</button>
        <div className="hidden lg:block">
          <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#a78b6a]">{title}</div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={role === "admin" ? "/admin/notifications" : "/dashboard/notifications"} className="relative rounded-full border border-[#eadfce] bg-white p-2.5 hover:bg-secondary">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-medium text-[#4b443c] hover:text-primary">View site <ArrowUpRight className="h-3.5 w-3.5" /></a>
        </div>
      </header>
      <main className="flex-1 p-4 lg:p-10">
        <Outlet />
      </main>
    </div>
  </div>;
}
function StatCard({ label, value, hint }) {
  return <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a78b6a]">{label}</div>
    <div className="mt-4 font-display text-4xl text-[#173822]">{value}</div>
    {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
  </div>;
}
function PageHeader({ title, subtitle, action }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="font-display text-4xl text-[#173822] md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f6f5e]">{subtitle}</p>}
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
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${tones[tone]}`}>{children}</span>;
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
