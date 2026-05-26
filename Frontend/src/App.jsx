import React from "react";
import { Toaster } from "./components/ui/sonner";
import { Router } from "./lib/router";
import { Routes, Route } from "react-router-dom";

import { Route as HomeRoute } from "./routes/index";
import { Route as AboutRoute } from "./routes/about";
import { Route as ContactRoute } from "./routes/contact";
import { Route as GalleryRoute } from "./routes/gallery";
import { Route as LoginRoute } from "./routes/login";
import { Route as MaintenanceRoute } from "./routes/maintenance";
import { Route as RegisterRoute } from "./routes/register";
import { Route as ServicesRoute } from "./routes/services";
import { Route as ServicesBalconyRoute } from "./routes/services.balcony";
import { Route as ServicesIndoorRoute } from "./routes/services.indoor";
import { Route as ServicesLandscapingRoute } from "./routes/services.landscaping";
import { Route as ServicesWellnessRoute } from "./routes/services.wellness";

import { Route as DashboardRoute } from "./routes/dashboard";
import { Route as DashboardIndexRoute } from "./routes/dashboard.index";
import { Route as DashboardBookRoute } from "./routes/dashboard.book";
import { Route as DashboardBookingsRoute } from "./routes/dashboard.bookings";
import { Route as DashboardLibraryRoute } from "./routes/dashboard.library";
import { Route as DashboardMaintenanceRoute } from "./routes/dashboard.maintenance";
import { Route as DashboardNotificationsRoute } from "./routes/dashboard.notifications";
import { Route as DashboardPaymentsRoute } from "./routes/dashboard.payments";
import { Route as DashboardProfileRoute } from "./routes/dashboard.profile";
import { Route as DashboardReferRoute } from "./routes/dashboard.refer";
import { Route as DashboardReviewsRoute } from "./routes/dashboard.reviews";
import { Route as DashboardSupportRoute } from "./routes/dashboard.support";
import { Route as DashboardWellnessRoute } from "./routes/dashboard.wellness";
import { Route as DashboardWishlistRoute } from "./routes/dashboard.wishlist";

import { Route as AdminRoute } from "./routes/admin";
import { Route as AdminIndexRoute } from "./routes/admin.index";
import { Route as AdminBlogRoute } from "./routes/admin.blog";
import { Route as AdminBookingsRoute } from "./routes/admin.bookings";
import { Route as AdminCmsRoute } from "./routes/admin.cms";
import { Route as AdminConsultationsRoute } from "./routes/admin.consultations";
import { Route as AdminCouponsRoute } from "./routes/admin.coupons";
import { Route as AdminCustomersRoute } from "./routes/admin.customers";
import { Route as AdminGalleryRoute } from "./routes/admin.gallery";
import { Route as AdminInventoryRoute } from "./routes/admin.inventory";
import { Route as AdminLeadsRoute } from "./routes/admin.leads";
import { Route as AdminNotificationsRoute } from "./routes/admin.notifications";
import { Route as AdminPackagesRoute } from "./routes/admin.packages";
import { Route as AdminPaymentsRoute } from "./routes/admin.payments";
import { Route as AdminProjectsRoute } from "./routes/admin.projects";
import { Route as AdminReportsRoute } from "./routes/admin.reports";
import { Route as AdminSettingsRoute } from "./routes/admin.settings";
import { Route as AdminStaffRoute } from "./routes/admin.staff";
import { Route as AdminSubscriptionsRoute } from "./routes/admin.subscriptions";
import { Route as AdminTestimonialsRoute } from "./routes/admin.testimonials";
import { Route as AdminWellnessRoute } from "./routes/admin.wellness";
import { Route as AdminMaintenancePlansRoute } from "./routes/admin.maintenance-plans";

const publicRoutes = [
  HomeRoute,
  AboutRoute,
  ContactRoute,
  GalleryRoute,
  LoginRoute,
  MaintenanceRoute,
  RegisterRoute,
  ServicesRoute,
  ServicesBalconyRoute,
  ServicesIndoorRoute,
  ServicesLandscapingRoute,
  ServicesWellnessRoute,
];

const dashboardRoutes = [
  DashboardIndexRoute,
  DashboardBookRoute,
  DashboardBookingsRoute,
  DashboardLibraryRoute,
  DashboardMaintenanceRoute,
  DashboardNotificationsRoute,
  DashboardPaymentsRoute,
  DashboardProfileRoute,
  DashboardReferRoute,
  DashboardReviewsRoute,
  DashboardSupportRoute,
  DashboardWellnessRoute,
  DashboardWishlistRoute,
];

const adminRoutes = [
  AdminIndexRoute,
  AdminBlogRoute,
  AdminBookingsRoute,
  AdminCmsRoute,
  AdminConsultationsRoute,
  AdminCouponsRoute,
  AdminCustomersRoute,
  AdminGalleryRoute,
  AdminInventoryRoute,
  AdminLeadsRoute,
  AdminNotificationsRoute,
  AdminPackagesRoute,
  AdminPaymentsRoute,
  AdminProjectsRoute,
  AdminReportsRoute,
  AdminSettingsRoute,
  AdminStaffRoute,
  AdminSubscriptionsRoute,
  AdminTestimonialsRoute,
  AdminWellnessRoute,
  AdminMaintenancePlansRoute,
];

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route) => {
          const Component = route.component;
          return <Route key={route.path} path={route.path} element={<Component />} />;
        })}

        {/* Dashboard Routes (Nested) */}
        <Route path="/dashboard" element={<DashboardRoute.component />}>
          <Route index element={<DashboardIndexRoute.component />} />
          {dashboardRoutes.filter(r => r.path !== "/dashboard").map((route) => {
            const Component = route.component;
            return <Route key={route.path} path={route.path} element={<Component />} />;
          })}
        </Route>

        {/* Admin Routes (Nested) */}
        <Route path="/admin" element={<AdminRoute.component />}>
          <Route index element={<AdminIndexRoute.component />} />
          {adminRoutes.filter(r => r.path !== "/admin").map((route) => {
            const Component = route.component;
            return <Route key={route.path} path={route.path} element={<Component />} />;
          })}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </Router>
  );
}

export default App;
