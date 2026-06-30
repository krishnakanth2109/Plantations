import React from "react";
import { createFileRoute } from "../lib/router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { LayoutDashboard, Users, CalendarCheck, ClipboardList, Repeat, Stethoscope, FolderKanban, UsersRound, Boxes, Package, CreditCard, ContactRound, MessageSquareQuote, Images, Globe, Bell, BarChart3, Tags, Newspaper, Settings } from "lucide-react";
const nav = [
  { to: "/superadmin", label: "Overview", icon: LayoutDashboard },
  { to: "/superadmin/customers", label: "Customers", icon: Users },
  { to: "/superadmin/admins", label: "Admins", icon: UsersRound },
  { to: "/superadmin/consultations", label: "Consultations", icon: CalendarCheck },
  { to: "/superadmin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/superadmin/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/superadmin/maintenance-plans", label: "Maintenance Plans", icon: ClipboardList },
  { to: "/superadmin/wellness", label: "Plant Wellness", icon: Stethoscope },
  { to: "/superadmin/projects", label: "Projects", icon: FolderKanban },
//  { to: "/superadmin/staff", label: "Staff", icon: UsersRound },
  { to: "/superadmin/inventory", label: "Inventory", icon: Boxes },
  { to: "/superadmin/packages", label: "Packages", icon: Package },
  { to: "/superadmin/payments", label: "Payments", icon: CreditCard },
  // { to: "/superadmin/leads", label: "Leads / CRM", icon: ContactRound },
  { to: "/superadmin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/superadmin/gallery", label: "Gallery", icon: Images },
  { to: "/superadmin/cms", label: "Website CMS", icon: Globe },
  { to: "/superadmin/notifications", label: "Notifications", icon: Bell },
  { to: "/superadmin/reports", label: "Reports", icon: BarChart3 },
  { to: "/superadmin/coupons", label: "Offers / Coupons", icon: Tags },
  // { to: "/superadmin/blog", label: "Blog / Tips", icon: Newspaper },
  { to: "/superadmin/settings", label: "Settings", icon: Settings }
];
const Route = createFileRoute("/superadmin")({
  head: () => ({ meta: [{ title: "Super Admin \u2014 Yogini Planters" }] }),
  component: () => <DashboardShell role="superadmin" nav={nav} title="Super Admin Panel" />
});
export {
  Route
};
