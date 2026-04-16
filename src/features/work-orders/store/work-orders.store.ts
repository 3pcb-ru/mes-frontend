import { create } from 'zustand';
import { workOrdersService } from '../services/work-orders.service';
import type { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto } from '../types/work-orders.schema';
import type { ApiError } from '@/shared/lib/api-client';

/**
 * Work Orders Store - Managed via useWorkOrders() accessor hook
 * Protocols:
 * - No direct store consumption (use useWorkOrders)
 * - Zero 'any' policy
 * - Strict error propagation
 */

interface WorkOrdersState {
    workOrders: WorkOrder[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchWorkOrders: () => Promise<void>;
    createWorkOrder: (data: CreateWorkOrderDto) => Promise<void>;
    updateWorkOrder: (id: string, data: UpdateWorkOrderDto) => Promise<void>;
    deleteWorkOrder: (id: string) => Promise<void>;
    clearError: () => void;
}

const useWorkOrdersStore = create<WorkOrdersState>((set, get) => ({
    workOrders: [],
    isLoading: false,
    error: null,

    fetchWorkOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await workOrdersService.listWorkOrders();
            set({ workOrders: Array.isArray(data) ? data : [] });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch work orders' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    createWorkOrder: async (data: CreateWorkOrderDto) => {
        set({ isLoading: true, error: null });
        try {
            await workOrdersService.createWorkOrder(data);
            await get().fetchWorkOrders();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to create work order' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    updateWorkOrder: async (id: string, data: UpdateWorkOrderDto) => {
        try {
            await workOrdersService.updateWorkOrder(id, data);
            await get().fetchWorkOrders();
        } catch (err) {
            const apiError = err as ApiError;
            throw apiError;
        }
    },

    deleteWorkOrder: async (id: string) => {
        try {
            await workOrdersService.deleteWorkOrder(id);
            await get().fetchWorkOrders();
        } catch (err) {
            const apiError = err as ApiError;
            throw apiError;
        }
    },

    clearError: () => set({ error: null }),
}));

/**
 * useWorkOrders() Accessor Hook
 * Centralized way to consume work orders state and actions.
 */
export const useWorkOrders = () => {
    const store = useWorkOrdersStore();
    return {
        ...store,
        // Computed/Selectors
        ordersByStatus: (status: string) => store.workOrders.filter((w) => w.status === status),
    };
};
