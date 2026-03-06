import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfileSetup from "./components/UserProfileSetup";

import AboutUsPage from "./pages/AboutUsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ClientPortalPage from "./pages/ClientPortalPage";
import ComplianceAdminDashboardPage from "./pages/ComplianceAdminDashboardPage";
import ComplianceDashboardPage from "./pages/ComplianceDashboardPage";
// Pages
import HomePage from "./pages/HomePage";
import ServiceBookingPage from "./pages/ServiceBookingPage";
import VisitorServiceRequestPage from "./pages/VisitorServiceRequestPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <UserProfileSetup />
      <Outlet />
    </Layout>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutUsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: VisitorServiceRequestPage,
});

const serviceBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/service-booking",
  component: ServiceBookingPage,
});

const clientPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client-portal",
  component: () => (
    <ProtectedRoute>
      <ClientPortalPage />
    </ProtectedRoute>
  ),
});

const complianceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compliance",
  component: () => (
    <ProtectedRoute>
      <ComplianceDashboardPage />
    </ProtectedRoute>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <ProtectedRoute>
      <AdminDashboardPage />
    </ProtectedRoute>
  ),
});

const complianceAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compliance-admin",
  component: () => (
    <ProtectedRoute>
      <ComplianceAdminDashboardPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  contactRoute,
  serviceBookingRoute,
  clientPortalRoute,
  complianceRoute,
  adminRoute,
  complianceAdminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
