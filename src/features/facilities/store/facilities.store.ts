import { create } from 'zustand';
import { facilitiesService } from '../services/facilities.service';
import type { FacilityListItem, CreateFacilityDto, NodeStatusChange, NodeDefinition } from '../types/facilities.schema';
import type { ApiError } from '@/shared/lib/api-client';

/**
 * Facilities Store - Managed via useFacilities() accessor hook
 * Protocols:
 * - No direct store consumption (use useFacilities)
 * - Zero 'any' policy
 * - Strict error propagation
 */

interface FacilitiesState {
    nodes: FacilityListItem[];
    definitions: NodeDefinition[];
    selectedNodeId: string | undefined;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchNodes: () => Promise<void>;
    fetchDefinitions: () => Promise<void>;
    setSelectedNodeId: (id: string | undefined) => void;

    createFacility: (data: CreateFacilityDto) => Promise<void>;
    updateFacility: (id: string, data: Partial<CreateFacilityDto>) => Promise<void>;
    moveFacility: (id: string, parentId: string | null) => Promise<void>;
    deleteFacility: (id: string) => Promise<void>;
    changeStatus: (id: string, data: NodeStatusChange) => Promise<void>;

    clearError: () => void;
}

const useFacilitiesStore = create<FacilitiesState>((set, get) => ({
    nodes: [],
    definitions: [],
    selectedNodeId: undefined,
    isLoading: false,
    error: null,

    fetchNodes: async () => {
        set({ isLoading: true, error: null });
        try {
            const nodes = await facilitiesService.listFacilities();
            set({ nodes });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch facilities' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    fetchDefinitions: async () => {
        try {
            const definitions = await facilitiesService.listDefinitions();
            set({ definitions });
        } catch (err) {
            console.error('Failed to fetch node definitions', err);
        }
    },

    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    createFacility: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await facilitiesService.createFacility(data);
            await get().fetchNodes();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to create facility' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    updateFacility: async (id, data) => {
        try {
            await facilitiesService.updateFacility(id, data);
            await get().fetchNodes();
        } catch (err) {
            const apiError = err as ApiError;
            throw apiError;
        }
    },

    moveFacility: async (id, parentId) => {
        try {
            await facilitiesService.moveFacility(id, parentId);
            await get().fetchNodes();
        } catch (err) {
            const apiError = err as ApiError;
            throw apiError;
        }
    },

    deleteFacility: async (id) => {
        try {
            await facilitiesService.deleteFacility(id);
            if (get().selectedNodeId === id) {
                set({ selectedNodeId: undefined });
            }
            await get().fetchNodes();
        } catch (err) {
            const apiError = err as ApiError;
            throw apiError;
        }
    },

    changeStatus: async (id, data) => {
        try {
            await facilitiesService.changeStatus(id, data);
            await get().fetchNodes();
        } catch (err) {
            const apiError = err as ApiError;
            throw apiError;
        }
    },

    clearError: () => set({ error: null }),
}));

/**
 * useFacilities() Accessor Hook
 * Centralized way to consume facilities state and actions.
 */
export const useFacilities = () => {
    const store = useFacilitiesStore();

    // Selectors
    const selectedNode = store.nodes.find((n) => n.id === store.selectedNodeId);

    return {
        ...store,
        selectedNode,
        // Helper to find a node by ID
        getNodeById: (id: string) => store.nodes.find((n) => n.id === id),
    };
};
