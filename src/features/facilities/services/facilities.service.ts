import { apiClient } from '@/shared/lib/api-client';
import { z } from 'zod';
import {
    FacilityListItemSchema,
    NodeDefinitionSchema,
    type FacilityListItem,
    type NodeDefinition,
    type CreateFacilityDto,
    type NodeStatusChange,
} from '../types/facilities.schema';

const NODES_BASE = '/nodes';

export const facilitiesService = {
    /**
     * List all facilities (nodes)
     */
    listFacilities: async (params: Record<string, any> = { limit: '100' }): Promise<FacilityListItem[]> => {
        const queryParams = { limit: '100', ...params };
        const qs = new URLSearchParams(queryParams).toString() ? '?' + new URLSearchParams(queryParams).toString() : '';
        return apiClient.get<FacilityListItem[]>(`${NODES_BASE}${qs}`, {}, z.array(FacilityListItemSchema));
    },

    /**
     * Get a single facility by ID
     */
    getFacility: async (id: string): Promise<FacilityListItem> => {
        return apiClient.get<FacilityListItem>(`${NODES_BASE}/${id}`, {}, FacilityListItemSchema);
    },

    /**
     * Create a new facility/node
     */
    createFacility: async (payload: CreateFacilityDto): Promise<FacilityListItem> => {
        return apiClient.post<FacilityListItem>(NODES_BASE, payload, {}, FacilityListItemSchema);
    },

    /**
     * Update an existing facility
     */
    updateFacility: async (id: string, payload: Partial<CreateFacilityDto>): Promise<FacilityListItem> => {
        return apiClient.put<FacilityListItem>(`${NODES_BASE}/${id}`, payload, {}, FacilityListItemSchema);
    },

    /**
     * Move a facility to a new parent
     */
    moveFacility: async (id: string, parentId: string | null): Promise<FacilityListItem> => {
        return apiClient.patch<FacilityListItem>(`${NODES_BASE}/${id}/move`, { parentId }, {}, FacilityListItemSchema);
    },

    /**
     * Delete a facility
     */
    deleteFacility: async (id: string): Promise<void> => {
        return apiClient.delete(`${NODES_BASE}/${id}`);
    },

    /**
     * Change node status with reason
     */
    changeStatus: async (id: string, body: NodeStatusChange): Promise<FacilityListItem> => {
        return apiClient.patch<FacilityListItem>(`${NODES_BASE}/${id}/status`, body, {}, FacilityListItemSchema);
    },

    /**
     * List node definitions (templates)
     */
    listDefinitions: async (): Promise<NodeDefinition[]> => {
        return apiClient.get<NodeDefinition[]>(`${NODES_BASE}/definitions`, {}, z.array(NodeDefinitionSchema));
    },
};
