import { create } from 'zustand';
import { warehouseService } from '../services/warehouse.service';
import { facilitiesService } from '@/features/facilities/services/facilities.service';
import type { ContainerListItem, CreateContainerDto, MoveContainerDto } from '../types/warehouse.types';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import type { ApiError } from '@/shared/lib/api-client';

/**
 * Warehouse Store - Managed via useWarehouse() accessor hook
 * Protocols:
 * - No direct store consumption (use useWarehouse)
 * - Zero 'any' policy
 * - Strict error propagation
 */

interface WarehouseState {
    allNodes: FacilityListItem[];
    allContainers: ContainerListItem[];
    isLoading: boolean;
    error: string | null;

    fetchData: () => Promise<void>;
    createContainer: (data: CreateContainerDto) => Promise<void>;
    moveContainer: (containerId: string, data: MoveContainerDto) => Promise<void>;
    clearError: () => void;
}

const useWarehouseStore = create<WarehouseState>((set, get) => ({
    allNodes: [],
    allContainers: [],
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Using Promise.all for optimized fetching
            const [nodesResult, containersResult] = await Promise.all([
                facilitiesService.listFacilities(),
                warehouseService.listContainers()
            ]);
            
            // Refactored: Services now use Zod and return strictly typed arrays
            set({ 
                allNodes: Array.isArray(nodesResult) ? nodesResult : [], 
                allContainers: Array.isArray(containersResult) ? containersResult : [] 
            });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch warehouse data' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    createContainer: async (data) => {
        try {
            await warehouseService.createContainer(data);
            await get().fetchData();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to create container' });
            throw err;
        }
    },

    moveContainer: async (containerId, data) => {
        try {
            await warehouseService.moveContainer(containerId, data);
            await get().fetchData();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to move container' });
            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));

/**
 * useWarehouse() Accessor Hook
 * Centralized way to consume warehouse state and actions.
 */
export const useWarehouse = () => {
    const store = useWarehouseStore();
    return {
        ...store,
        // Computed values can go here
        containersByNode: (nodeId: string) => store.allContainers.filter(c => c.locationNodeId === nodeId),
    };
};
