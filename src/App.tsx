import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
                    <Route path="/dashboard/products" element={<ComingSoonPage />} />
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
