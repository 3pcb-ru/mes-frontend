import { create } from 'zustand';
import { reportsService } from '../services/reports.service';
import type { ActivityListItem } from '../types/reports.types';
import type { ApiError } from '@/shared/lib/api-client';

interface ReportsState {
    items: ActivityListItem[];
    isLoading: boolean;
    error: string | null;

    fetchActivities: () => Promise<void>;
    clearError: () => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchActivities: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await reportsService.listActivities();
            set({ items: Array.isArray(data) ? data : [] });
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
