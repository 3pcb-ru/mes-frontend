import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const accessToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const location = useLocation();
    const [isReady, setIsReady] = useState(false);

    // On mount, check if tokens exist and store is ready
    useEffect(() => {
        setIsReady(true);
    }, []);

    // If not ready to render, wait
    if (!isReady) {
        return null;
    }

    // Check if user has valid authentication
    // Either from Zustand state or from localStorage tokens
    const hasValidAuth = isAuthenticated || (!!accessToken && !!refreshToken);

    if (!hasValidAuth) {
        // Redirect to login page with the return url so user can come back
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
