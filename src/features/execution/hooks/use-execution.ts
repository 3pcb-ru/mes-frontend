import { create } from 'zustand';
import { executionService } from '../services/execution.service';
import { ExecutionJob, CreateExecutionJobDto } from '../types/execution.schema';
import { ApiError } from '@/shared/lib/api-client';

interface ExecutionState {
    jobs: ExecutionJob[];
    isLoading: boolean;
    error: string | null;

    fetchJobs: () => Promise<void>;
    startJob: (id: string) => Promise<void>;
    completeJob: (id: string) => Promise<void>;
    createJob: (payload: CreateExecutionJobDto) => Promise<void>;
    clearError: () => void;
}

const useExecutionStore = create<ExecutionState>((set, get) => ({
    jobs: [],
    isLoading: false,
    error: null,

    fetchJobs: async () => {
        set({ isLoading: true, error: null });
        try {
            const jobs = await executionService.listJobs();
            set({ jobs });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch jobs' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    startJob: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await executionService.startJob(id);
            await get().fetchJobs();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to start job' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    completeJob: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await executionService.completeJob(id);
            await get().fetchJobs();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to complete job' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    createJob: async (payload: CreateExecutionJobDto) => {
        set({ isLoading: true, error: null });
        try {
            await executionService.createJob(payload);
            await get().fetchJobs();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to create job' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));

/**
 * useExecution() Accessor Hook
 * Centralized way to consume execution state and actions.
 */
export const useExecution = () => {
    const store = useExecutionStore();
    return {
        ...store,
        inProgressJobs: store.jobs.filter((j) => j.status === 'IN_PROGRESS'),
        pendingJobs: store.jobs.filter((j) => j.status === 'PENDING'),
    };
};
