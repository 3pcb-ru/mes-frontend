import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { usersService } from '@/features/users/services/users.service';
import { useNotificationStore } from '@/features/notifications/store/notifications.store';
import type { User, LoginDto, SignupDto } from '../types/auth.types';
import type { DetailedProfile } from '@/features/users/types/users.types';
import type { ApiError } from '@/shared/lib/api-client';

interface AuthState {
    // State
    user: User | null;
    detailedProfile: DetailedProfile | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;

    // Computed
    isAuthenticated: boolean;

    // Actions
    login: (credentials: LoginDto) => Promise<void>;
    signup: (data: SignupDto) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    clearError: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
}

const AUTH_TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            detailedProfile: null,
            token: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,

            // Login action
            login: async (credentials: LoginDto) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(credentials);
                    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
                    set({
                        user: response.user,
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    // Fetch full profile and notifications in the background
                    get().fetchProfile();
                    useNotificationStore.getState().fetchNotifications();
                } catch (err) {
                    const apiError = err as ApiError;
                    set({
                        error: apiError.message || 'Login failed',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            // Signup action
            signup: async (data: SignupDto) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.signup(data);
                    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
                    // On signup, the backend returns email but not full user.
                    // We set a partial user so the UI can show the email.
                    set({
                        user: {
                            id: '', // Temporary
                            email: response.email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            isVerified: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    // Fetch full profile in the background
                    get().fetchProfile();
                } catch (err) {
                    const apiError = err as ApiError;
                    set({
                        error: apiError.message || 'Signup failed',
                        isLoading: false,
                    });
                    throw err;
                }
            },

            // Logout action
            logout: async () => {
                set({ isLoading: true });
                try {
                    await authService.logout();
                } catch {
                    // Ignore logout errors, proceed with local cleanup
                } finally {
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                    set({
                        user: null,
                        detailedProfile: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                }
            },

            // Fetch profile action
            fetchProfile: async () => {
                try {
                    const profile = await usersService.getCurrentProfile();
                    set({ detailedProfile: profile });
                } catch (err) {
                    const apiError = err as ApiError;
                    console.error('Failed to fetch profile:', err);

                    // If we get a 401 (Unauthorized), it means the token is likely invalid
                    // or malformed. We clear the session to allow the user to log in again.
                    if (apiError.statusCode === 401) {
                        get().logout();
                    }
                }
            },

            // Clear error
            clearError: () => set({ error: null }),

            // Set user (for profile updates)
            setUser: (user: User) => set({ user }),

            // Set token (for token refresh)
            setToken: (token: string) => {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                set({ token });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                detailedProfile: state.detailedProfile,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                // Sync token to localStorage on rehydrate
                if (state?.token) {
                    localStorage.setItem(AUTH_TOKEN_KEY, state.token);
                }
            },
        },
    ),
);

// Hook for easy auth state access
export const useAuth = () => {
    const store = useAuthStore();
    return {
        user: store.user,
        detailedProfile: store.detailedProfile,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.isLoading,
        error: store.error,
        login: store.login,
        signup: store.signup,
        logout: store.logout,
        fetchProfile: store.fetchProfile,
        clearError: store.clearError,
    };
};
