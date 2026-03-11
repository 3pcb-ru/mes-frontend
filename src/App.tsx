import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

// Layouts
import { LandingLayout } from './landing/layouts/landing-layout';
import { DashboardLayout } from './dashboard/layouts/dashboard-layout';

// Landing Pages
import { HomePage } from './landing/pages/home';
import { AboutPage } from './landing/pages/about';
import { PrivacyPage } from './landing/pages/privacy';
import { TermsPage } from './landing/pages/terms';

// Auth Pages
import { LoginPage } from './features/auth/pages/login';
import { SignupPage } from './features/auth/pages/signup';
import { ForgotPasswordPage } from './features/auth/pages/forgot-password';
import { ResetPasswordPage } from './features/auth/pages/reset-password';
import { VerifyEmailPage } from './features/auth/pages/verify-email';
import { ProtectedRoute } from './features/auth/components/protected-route';

// Dashboard Pages
import { DashboardHome } from './dashboard/pages/home';
import { ProfilePage } from './dashboard/pages/profile';
import { UsersPage } from './dashboard/pages/users';
import { ComingSoonPage } from './dashboard/pages/coming-soon';
import { ProductsPage } from './dashboard/pages/products';
import { FacilitiesPage } from './dashboard/pages/facilities';
import { TracePage } from './dashboard/pages/trace';
import { InventoryPage } from './dashboard/pages/inventory';
import { WorkOrdersPage } from './dashboard/pages/work-orders';

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

import { Toaster } from '@/shared/components/ui/sonner';

export default function App() {
    return (
        <Router>
            <Toaster />
            <SessionExpiredRedirector />
            <ScrollToHash />
            <Routes>
                {/* Landing Routes */}
                <Route element={<LandingLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                </Route>

                {/* Auth Routes (no layout wrapper) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify/:token" element={<VerifyEmailPage />} />

                {/* Dashboard Routes (protected) */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/dashboard/profile" element={<ProfilePage />} />
                    <Route path="/dashboard/users" element={<UsersPage />} />

                    {/* Coming Soon Pages */}
                    <Route path="/dashboard/products" element={<ProductsPage />} />
                    <Route path="/dashboard/facilities" element={<FacilitiesPage />} />
                    <Route path="/dashboard/trace" element={<TracePage />} />
                    <Route path="/dashboard/inventory" element={<InventoryPage />} />
                    <Route path="/dashboard/work-orders" element={<WorkOrdersPage />} />
                    <Route path="/dashboard/analytics" element={<ComingSoonPage />} />
                    <Route path="/dashboard/settings" element={<ComingSoonPage />} />
                    <Route path="/dashboard/reports" element={<ComingSoonPage />} />
                    <Route path="/dashboard/help" element={<ComingSoonPage />} />
                    <Route path="/dashboard/messages" element={<ComingSoonPage />} />
                    <Route path="/dashboard/integration" element={<ComingSoonPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
