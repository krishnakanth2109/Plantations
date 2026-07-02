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
import { Route as ProductsRoute } from "./routes/products";
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

import { Route as SuperadminRoute } from "./routes/superadmin";
import { Route as SuperadminIndexRoute } from "./routes/superadmin.index";
import { Route as SuperadminAdminsRoute } from "./routes/superadmin.admins";
import { Route as SuperadminProfileRoute } from "./routes/superadmin.profile";
import { Route as SuperadminBlogRoute } from "./routes/superadmin.blog";
import { Route as SuperadminBookingsRoute } from "./routes/superadmin.bookings";
import { Route as SuperadminCmsRoute } from "./routes/superadmin.cms";
import { Route as SuperadminConsultationsRoute } from "./routes/superadmin.consultations";
import { Route as SuperadminCouponsRoute } from "./routes/superadmin.coupons";
import { Route as SuperadminCustomersRoute } from "./routes/superadmin.customers";
import { Route as SuperadminGalleryRoute } from "./routes/superadmin.gallery";
import { Route as SuperadminInventoryRoute } from "./routes/superadmin.inventory";
import { Route as SuperadminLeadsRoute } from "./routes/superadmin.leads";
import { Route as SuperadminNotificationsRoute } from "./routes/superadmin.notifications";
import { Route as SuperadminPackagesRoute } from "./routes/superadmin.packages";
import { Route as SuperadminPaymentsRoute } from "./routes/superadmin.payments";
import { Route as SuperadminProjectsRoute } from "./routes/superadmin.projects";
import { Route as SuperadminReportsRoute } from "./routes/superadmin.reports";
import { Route as SuperadminSettingsRoute } from "./routes/superadmin.settings";
import { Route as SuperadminStaffRoute } from "./routes/superadmin.staff";
import { Route as SuperadminSubscriptionsRoute } from "./routes/superadmin.subscriptions";
import { Route as SuperadminTestimonialsRoute } from "./routes/superadmin.testimonials";
import { Route as SuperadminWellnessRoute } from "./routes/superadmin.wellness";
import { Route as SuperadminMaintenancePlansRoute } from "./routes/superadmin.maintenance-plans";

const publicRoutes = [
  HomeRoute,
  AboutRoute,
  ContactRoute,
  GalleryRoute,
  LoginRoute,
  MaintenanceRoute,
  RegisterRoute,
  ServicesRoute,
  ProductsRoute,
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

const superadminRoutes = [
  SuperadminIndexRoute,
  SuperadminAdminsRoute,
  SuperadminProfileRoute,
  SuperadminBlogRoute,
  SuperadminBookingsRoute,
  SuperadminCmsRoute,
  SuperadminConsultationsRoute,
  SuperadminCouponsRoute,
  SuperadminCustomersRoute,
  SuperadminGalleryRoute,
  SuperadminInventoryRoute,
  SuperadminLeadsRoute,
  SuperadminNotificationsRoute,
  SuperadminPackagesRoute,
  SuperadminPaymentsRoute,
  SuperadminProjectsRoute,
  SuperadminReportsRoute,
  SuperadminSettingsRoute,
  SuperadminStaffRoute,
  SuperadminSubscriptionsRoute,
  SuperadminTestimonialsRoute,
  SuperadminWellnessRoute,
  SuperadminMaintenancePlansRoute,
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
      <div className="relative min-h-screen w-full">
        <div 
          className="fixed inset-0 z-[-1] opacity-300 pointer-events-none bg-repeat bg-[length:500px]"
          style={{ backgroundImage: "url('/rose_watermark.png')" }}
        />
        <div className="relative z-0">
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map((route) => {
              const Component = route.component;
              return <Route key={route.path} path={route.path} element={<Component />} />;
            })}

          {/* Dashboard Routes (Nested) */}
          <Route path="/dashboard" element={<DashboardRoute.component />}>
            <Route index element={<DashboardIndexRoute.component />} />
            {dashboardRoutes.filter(r => r && r.path && r.path !== "/dashboard").map((route) => {
              const Component = route.component;
              const relativePath = route.path.replace(/^\/dashboard\//, "");
              return <Route key={route.path} path={relativePath} element={<Component />} />;
            })}
          </Route>

          {/* Admin Routes (Nested) */}
          <Route path="/superadmin" element={<SuperadminRoute.component />}>
            <Route index element={<SuperadminIndexRoute.component />} />
            {superadminRoutes.filter(r => r && r.path && r.path !== "/superadmin").map((route) => {
              const Component = route.component;
              const relativePath = route.path.replace(/^\/superadmin\//, "");
              return <Route key={route.path} path={relativePath} element={<Component />} />;
            })}
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-right" />
        </div>
      </div>
    </Router>
  );
}

export default App;
