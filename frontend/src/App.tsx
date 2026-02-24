import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import ServiceBookingPage from './pages/ServiceBookingPage';
import ClientPortalPage from './pages/ClientPortalPage';
import ComplianceDashboardPage from './pages/ComplianceDashboardPage';
import VisitorServiceRequestPage from './pages/VisitorServiceRequestPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfileSetup from './components/UserProfileSetup';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const serviceBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book-service',
  component: ServiceBookingPage,
});

const visitorRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visitor-request',
  component: VisitorServiceRequestPage,
});

const clientPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portal',
  component: () => (
    <ProtectedRoute>
      <ClientPortalPage />
    </ProtectedRoute>
  ),
});

const complianceDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compliance',
  component: () => (
    <ProtectedRoute>
      <ComplianceDashboardPage />
    </ProtectedRoute>
  ),
});

// Admin dashboard uses its own AdminGuard (email-based) inside the page component
// ProtectedRoute handles the base authentication layer
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-dashboard',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  serviceBookingRoute,
  visitorRequestRoute,
  clientPortalRoute,
  complianceDashboardRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <UserProfileSetup />
      <Toaster />
    </ThemeProvider>
  );
}
