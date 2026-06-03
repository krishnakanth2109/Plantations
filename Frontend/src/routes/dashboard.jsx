import React from "react";
import { createFileRoute } from "../lib/router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { LayoutDashboard, User, CalendarPlus, ClipboardList, Repeat, Stethoscope, CreditCard, BookOpen, Headphones, Heart, Gift, Star } from "lucide-react";
const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/book", label: "Book a service", icon: CalendarPlus, section: "Services" },
  { to: "/dashboard/bookings", label: "My bookings", icon: ClipboardList, section: "Services" },
  { to: "/dashboard/maintenance", label: "My plan", icon: Repeat, section: "Maintenance" },
  { to: "/dashboard/wellness", label: "Plant wellness", icon: Stethoscope, section: "Maintenance" },
  { to: "/dashboard/library", label: "Plant care library", icon: BookOpen, section: "Explore" },
  { to: "/dashboard/wishlist", label: "Wishlist", icon: Heart, section: "Explore" },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard, section: "Account" },
  { to: "/dashboard/refer", label: "Refer and earn", icon: Gift, section: "Account", badge: "New" },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star, section: "Account", badge: "New" },
  { to: "/dashboard/profile", label: "Profile", icon: User, section: "Account" },
  { to: "/dashboard/support", label: "Support Center", icon: Headphones, section: "Account" }
];
const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard \u2014 Yogini Planters" }] }),
  component: () => <DashboardShell role="customer" nav={nav} title="Customer Dashboard" />
});
export {
  Route
};
