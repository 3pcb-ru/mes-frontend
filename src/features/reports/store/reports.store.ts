import { create } from 'zustand';
import { reportsService } from '../services/reports.service';
import type { ActivityLog } from '../types/reports.schema';
import type { ApiError } from '@/shared/lib/api-client';

interface ReportsState {
    activities: ActivityLog[];
    isLoading: boolean;
    error: string | null;

    fetchActivities: () => Promise<void>;
    clearError: () => void;
}

const useReportsStore = create<ReportsState>((set) => ({
    activities: [],
    isLoading: false,
    error: null,

    fetchActivities: async () => {
        set({ isLoading: true, error: null });
        try {
            const activities = await reportsService.listActivities();
            set({ activities });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch activities' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));

/**
 * useReports() Accessor Hook
 * Centralized way to consume traceability/reports state.
 */
export const useReports = () => {
    const store = useReportsStore();
    return {
        ...store,
        // Helper to get latest activities
        latestActivities: [...store.activities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
};
