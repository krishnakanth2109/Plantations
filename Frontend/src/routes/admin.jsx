import React from "react";
import { createFileRoute } from "../lib/router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { LayoutDashboard, Users, CalendarCheck, ClipboardList, Repeat, Stethoscope, FolderKanban, UsersRound, Boxes, Package, CreditCard, ContactRound, MessageSquareQuote, Images, Globe, Bell, BarChart3, Tags, Newspaper, Settings } from "lucide-react";
const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/consultations", label: "Consultations", icon: CalendarCheck },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/admin/maintenance-plans", label: "Maintenance Plans", icon: ClipboardList },
  { to: "/admin/wellness", label: "Plant Wellness", icon: Stethoscope },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
//  { to: "/admin/staff", label: "Staff", icon: UsersRound },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  // { to: "/admin/leads", label: "Leads / CRM", icon: ContactRound },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/cms", label: "Website CMS", icon: Globe },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/coupons", label: "Offers / Coupons", icon: Tags },
  // { to: "/admin/blog", label: "Blog / Tips", icon: Newspaper },
  { to: "/admin/settings", label: "Settings", icon: Settings }
];
const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin \u2014 Yogini Planters" }] }),
  component: () => <DashboardShell role="admin" nav={nav} title="Admin Panel" />
});
export {
  Route
};
