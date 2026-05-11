import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { ProtectedRoute } from './ProtectedRoute';
import { RedirectAuthenticated } from './RedirectAuthenticated';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicLayout } from '../layouts/PublicLayout';

// ── Lazy-loaded page components (code splitting) ──────────────────────
const Home = lazy(() =>
  import('../Components/Pages/Home/Home').then(m => ({ default: m.Home }))
);
const LoginPage = lazy(() =>
  import('../Components/Pages/LoginPage/LoginPage').then(m => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../Components/Pages/RegisterPage/RegisterPage').then(m => ({ default: m.RegisterPage }))
);
const Page404 = lazy(() =>
  import('../Components/Pages/Page404/Page404').then(m => ({ default: m.Page404 }))
);
const Unauthorized = lazy(() =>
  import('../Components/Pages/Unauthorized/Unauthorized').then(m => ({ default: m.Unauthorized }))
);

// Admin pages
const AdminMenu = lazy(() =>
  import('../Components/Pages/Admin/AdminMenu/AdminMenu').then(m => ({ default: m.AdminMenu }))
);
const GetAllCompanies = lazy(() =>
  import('../Components/Pages/Admin/GetAllCompanies/GetAllCompanies').then(m => ({ default: m.GetAllCompanies }))
);
const GetAllCustomers = lazy(() =>
  import('../Components/Pages/Admin/GetAllCustomers/GetAllCustomers').then(m => ({ default: m.GetAllCustomers }))
);
const GetAllCoupons = lazy(() =>
  import('../Components/Pages/Admin/GetAllCoupons/GetAllCoupons').then(m => ({ default: m.GetAllCoupons }))
);

// Company pages
const CompanyMenu = lazy(() =>
  import('../Components/Pages/Company/CompanyMenu/CompanyMenu').then(m => ({ default: m.CompanyMenu }))
);

// Customer pages
const CustomerMenu = lazy(() =>
  import('../Components/Pages/Customer/CustomerMenu/CustomerMenu').then(m => ({ default: m.CustomerMenu }))
);
const GetCustomerCoupons = lazy(() =>
  import('../Components/Pages/Customer/GetCustomerCoupons/GetCustomerCoupons').then(m => ({ default: m.GetCustomerCoupons }))
);
const ThankYouPage = lazy(() =>
  import('../Components/Pages/Customer/ThankYouPage/ThankYouPage').then(m => ({ default: m.ThankYouPage }))
);

// ── Loading fallback ──────────────────────────────────────────────────
function PageLoader() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );
}

// ── Helper: wrap a page element with DashboardLayout + ProtectedRoute ─
function DashboardPage({
  children,
  allowedRoles,
  checkOwnership = false,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  checkOwnership?: boolean;
}) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles} checkOwnership={checkOwnership}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

// ── Route definitions ─────────────────────────────────────────────────
export function AppRoutes(): JSX.Element {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes (PublicLayout with top bar) ──────── */}
        <Route
          path="/"
          element={<PublicLayout><Home /></PublicLayout>}
        />
        <Route
          path="/home"
          element={<PublicLayout><Home /></PublicLayout>}
        />

        {/* ── Auth routes (no layout — AuthLayout is inside the pages) */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticated>
              <LoginPage />
            </RedirectAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectAuthenticated>
              <RegisterPage />
            </RedirectAuthenticated>
          }
        />

        {/* ── Admin routes (DashboardLayout) ─────────────────── */}
        <Route
          path="/admin/:id"
          element={
            <DashboardPage allowedRoles={['ADMIN']} checkOwnership>
              <AdminMenu />
            </DashboardPage>
          }
        />
        <Route
          path="/admin/:id/companies"
          element={
            <DashboardPage allowedRoles={['ADMIN']} checkOwnership>
              <GetAllCompanies />
            </DashboardPage>
          }
        />
        <Route
          path="/admin/:id/customers"
          element={
            <DashboardPage allowedRoles={['ADMIN']} checkOwnership>
              <GetAllCustomers />
            </DashboardPage>
          }
        />
        <Route
          path="/admin/:id/coupons"
          element={
            <DashboardPage allowedRoles={['ADMIN']} checkOwnership>
              <GetAllCoupons />
            </DashboardPage>
          }
        />

        {/* ── Company routes (DashboardLayout) ───────────────── */}
        <Route
          path="/company/:id"
          element={
            <DashboardPage allowedRoles={['COMPANY']} checkOwnership>
              <CompanyMenu />
            </DashboardPage>
          }
        />

        {/* ── Customer routes (DashboardLayout) ──────────────── */}
        <Route
          path="/customer/:id"
          element={
            <DashboardPage allowedRoles={['CUSTOMER']} checkOwnership>
              <CustomerMenu />
            </DashboardPage>
          }
        />
        <Route
          path="/customer/:id/coupons"
          element={
            <DashboardPage allowedRoles={['CUSTOMER']} checkOwnership>
              <GetCustomerCoupons />
            </DashboardPage>
          }
        />
        <Route
          path="/customer/:id/thank-you/:name"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']} checkOwnership>
              <ThankYouPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/:id/thank-you"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']} checkOwnership>
              <ThankYouPage />
            </ProtectedRoute>
          }
        />

        {/* ── Error routes ───────────────────────────────────── */}
        <Route
          path="/unauthorized"
          element={<PublicLayout><Unauthorized /></PublicLayout>}
        />
        <Route
          path="*"
          element={<PublicLayout><Page404 /></PublicLayout>}
        />
      </Routes>
    </Suspense>
  );
}
