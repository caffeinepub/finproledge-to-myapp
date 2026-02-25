import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServiceBookingPage from './pages/ServiceBookingPage';
import ClientPortalPage from './pages/ClientPortalPage';
import ComplianceDashboardPage from './pages/ComplianceDashboardPage';
import ComplianceAdminDashboardPage from './pages/ComplianceAdminDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import VisitorServiceRequestPage from './pages/VisitorServiceRequestPage';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

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
  path: '/request-service',
  component: VisitorServiceRequestPage,
});

const clientPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client-portal',
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

const complianceAdminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compliance-admin',
  component: () => (
    <ProtectedRoute>
      <ComplianceAdminDashboardPage />
    </ProtectedRoute>
  ),
});

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
  complianceAdminDashboardRoute,
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
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
