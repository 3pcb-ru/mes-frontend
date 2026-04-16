import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/shared/components/ui/sonner';

/**
 * App - Main entry point with route-based code splitting
 */

// Layouts (Lazy loaded for optimal code splitting)
const LandingLayout = lazy(() => import('./landing/layouts/landing-layout').then((m) => ({ default: m.LandingLayout })));
import { DashboardLayout } from './dashboard/layouts/dashboard-layout';

// Loading Component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

// Landing Pages (Lazy)
const HomePage = lazy(() => import('./landing/pages/home').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./landing/pages/about').then((m) => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./landing/pages/privacy').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./landing/pages/terms').then((m) => ({ default: m.TermsPage })));

// Auth Pages (Lazy)
const LoginPage = lazy(() => import('./features/auth/pages/login').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./features/auth/pages/signup').then((m) => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/forgot-password').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./features/auth/pages/reset-password').then((m) => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./features/auth/pages/verify-email').then((m) => ({ default: m.VerifyEmailPage })));
const AcceptInvitationPage = lazy(() => import('./features/auth/pages/accept-invitation').then((m) => ({ default: m.AcceptInvitationPage })));
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
const ExecutionPage = lazy(() => import('./dashboard/pages/execution')); // Default export handled automatically
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
                        <Route path="/dashboard/execution" element={<ExecutionPage />} />
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
