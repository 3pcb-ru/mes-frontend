import { create } from 'zustand';
import { warehouseService } from '../services/warehouse.service';
import { facilitiesService } from '@/features/facilities/services/facilities.service';
import type { ContainerListItem, CreateContainerDto, MoveContainerDto } from '../types/warehouse.types';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import type { ApiError } from '@/shared/lib/api-client';

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

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
    allNodes: [],
    allContainers: [],
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [nodesResult, containersResult] = await Promise.all([
                facilitiesService.listFacilities(),
                warehouseService.listContainers()
            ]);
            
            const nodes = Array.isArray(nodesResult) ? nodesResult : (nodesResult as any)?.data || [];
            const containers = Array.isArray(containersResult) ? containersResult : (containersResult as any)?.data || [];

            set({ 
                allNodes: Array.isArray(nodes) ? nodes : [], 
                allContainers: Array.isArray(containers) ? containers : [] 
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
