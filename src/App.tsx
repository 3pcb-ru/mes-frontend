import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/shared/components/ui/sonner';

/**
 * App - Main entry point with route-based code splitting
 */

// Layouts (Keep eager if core/small, or lazy if heavy)
import { LandingLayout } from './landing/layouts/landing-layout';
import { DashboardLayout } from './dashboard/layouts/dashboard-layout';

// Loading Component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

// Landing Pages (Eager - usually landing needs fast LCP)
import { HomePage } from './landing/pages/home';
import { AboutPage } from './landing/pages/about';
import { PrivacyPage } from './landing/pages/privacy';
import { TermsPage } from './landing/pages/terms';

// Auth Pages (Eager - critical path)
import { LoginPage } from './features/auth/pages/login';
import { SignupPage } from './features/auth/pages/signup';
import { ForgotPasswordPage } from './features/auth/pages/forgot-password';
import { ResetPasswordPage } from './features/auth/pages/reset-password';
import { VerifyEmailPage } from './features/auth/pages/verify-email';
import { AcceptInvitationPage } from './features/auth/pages/accept-invitation';
import { ProtectedRoute } from './features/auth/components/protected-route';

// Dashboard Pages (LAZY LOADED - Protocol compliance)
const DashboardHome = lazy(() => import('./dashboard/pages/home').then((m) => ({ default: m.DashboardHome })));
const ProfilePage = lazy(() => import('./dashboard/pages/profile').then((m) => ({ default: m.ProfilePage })));
const UsersPage = lazy(() => import('./dashboard/pages/users').then((m) => ({ default: m.UsersPage })));
const ProductsPage = lazy(() => import('./dashboard/pages/products').then((m) => ({ default: m.ProductsPage })));
const FacilitiesPage = lazy(() => import('./dashboard/pages/facilities').then((m) => ({ default: m.FacilitiesPage })));
const ReportsPage = lazy(() => import('./dashboard/pages/reports').then((m) => ({ default: m.ReportsPage })));
const WarehousePage = lazy(() => import('./dashboard/pages/warehouse').then((m) => ({ default: m.WarehousePage })));
const WorkOrdersPage = lazy(() => import('./dashboard/pages/work-orders').then((m) => ({ default: m.WorkOrdersPage })));
const SettingsPage = lazy(() => import('./dashboard/pages/settings').then((m) => ({ default: m.SettingsPage })));
const ComingSoonPage = lazy(() => import('./dashboard/pages/coming-soon').then((m) => ({ default: m.ComingSoonPage })));

function SessionExpiredRedirector() {
    const navigate = useNavigate();
    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('session_expired')) {
            localStorage.removeItem('session_expired');
            navigate('/login', { replace: true });
        }
    }, [navigate]);
    return null;
}

function ScrollToHash() {
    const { hash, pathname } = useLocation();
    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [hash, pathname]);
    return null;
}

export default function App() {
    return (
        <Router>
            <Toaster />
            <SessionExpiredRedirector />
            <ScrollToHash />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Landing Routes */}
                    <Route element={<LandingLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                    </Route>

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify/:token" element={<VerifyEmailPage />} />
                    <Route path="/accept-invitation" element={<AcceptInvitationPage />} />

                    {/* Dashboard Routes (Protected + Lazy) */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }>
                        <Route path="/dashboard" element={<DashboardHome />} />
                        <Route path="/dashboard/profile" element={<ProfilePage />} />
                        <Route path="/dashboard/users" element={<UsersPage />} />
                        <Route path="/dashboard/products" element={<ProductsPage />} />
                        <Route path="/dashboard/facilities" element={<FacilitiesPage />} />
                        <Route path="/dashboard/reports" element={<ReportsPage />} />
                        <Route path="/dashboard/warehouse" element={<WarehousePage />} />
                        <Route path="/dashboard/work-orders" element={<WorkOrdersPage />} />
                        <Route path="/dashboard/settings" element={<SettingsPage />} />
                        <Route path="/dashboard/help" element={<ComingSoonPage />} />
                        <Route path="/dashboard/messages" element={<ComingSoonPage />} />
                        <Route path="/dashboard/integration" element={<ComingSoonPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}
