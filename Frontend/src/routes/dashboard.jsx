import React from "react";
import { createFileRoute } from "../lib/router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { LayoutDashboard, User, CalendarPlus, ClipboardList, Repeat, Stethoscope, CreditCard, Bell, BookOpen, Headphones, Heart, Gift, Star } from "lucide-react";
const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/book", label: "Book a service", icon: CalendarPlus },
  { to: "/dashboard/bookings", label: "My bookings", icon: ClipboardList },
  { to: "/dashboard/maintenance", label: "Maintenance", icon: Repeat },
  { to: "/dashboard/wellness", label: "Plant wellness", icon: Stethoscope },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/library", label: "Plant care library", icon: BookOpen },
  { to: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star },
  { to: "/dashboard/refer", label: "Refer & earn", icon: Gift },
  { to: "/dashboard/support", label: "Support", icon: Headphones }
];
const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard \u2014 Yogini Planters" }] }),
  component: () => <DashboardShell role="customer" nav={nav} title="Customer Dashboard" />
});
export {
  Route
};
