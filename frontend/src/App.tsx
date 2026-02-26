import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ServiceBookingPage from './pages/ServiceBookingPage';
import ClientPortalPage from './pages/ClientPortalPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ComplianceDashboardPage from './pages/ComplianceDashboardPage';
import ComplianceAdminDashboardPage from './pages/ComplianceAdminDashboardPage';
import VisitorServiceRequestPage from './pages/VisitorServiceRequestPage';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
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

const aboutUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about-us',
  component: AboutUsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: VisitorServiceRequestPage,
});

const serviceBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/service-booking',
  component: () => (
    <ProtectedRoute>
      <ServiceBookingPage />
    </ProtectedRoute>
  ),
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

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute>
      <AdminDashboardPage />
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

const complianceAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compliance-admin',
  component: () => (
    <ProtectedRoute>
      <ComplianceAdminDashboardPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutUsRoute,
  contactRoute,
  serviceBookingRoute,
  clientPortalRoute,
  adminDashboardRoute,
  complianceDashboardRoute,
  complianceAdminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
