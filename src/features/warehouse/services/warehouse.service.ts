import { apiClient } from '@/shared/lib/api-client';
import { z } from 'zod';
import { ContainerListItemSchema, type ContainerListItem, type CreateContainerDto, type MoveContainerDto } from '../types/warehouse.schema';

const WAREHOUSE_BASE = '/inventory/containers';

export const warehouseService = {
    /**
     * List all containers
     */
    listContainers: async (params: Record<string, any> = { limit: '100' }): Promise<ContainerListItem[]> => {
        const queryParams = { limit: '100', ...params };
        const qs = new URLSearchParams(queryParams).toString() ? '?' + new URLSearchParams(queryParams).toString() : '';
        // Backend returns list via .data or as array. apiClient with array schema handles this.
        return apiClient.get<ContainerListItem[]>(`${WAREHOUSE_BASE}${qs}`, {}, z.array(ContainerListItemSchema));
    },

    /**
     * Get specific container by ID
     */
    getContainer: async (id: string): Promise<ContainerListItem> => {
        return apiClient.get<ContainerListItem>(`${WAREHOUSE_BASE}/${id}`, {}, ContainerListItemSchema);
    },

    /**
     * Create a new container
     */
    createContainer: async (payload: CreateContainerDto): Promise<ContainerListItem> => {
        return apiClient.post<ContainerListItem>(WAREHOUSE_BASE, payload, {}, ContainerListItemSchema);
    },

    /**
     * Update container info
     */
    updateContainer: async (id: string, payload: Partial<CreateContainerDto>): Promise<ContainerListItem> => {
        return apiClient.put<ContainerListItem>(`${WAREHOUSE_BASE}/${id}`, payload, {}, ContainerListItemSchema);
    },

    /**
     * Delete container
     */
    deleteContainer: async (id: string): Promise<void> => {
        return apiClient.delete(`${WAREHOUSE_BASE}/${id}`);
    },

    /**
     * Move container to a new location
     */
    moveContainer: async (id: string, body: MoveContainerDto): Promise<ContainerListItem> => {
        return apiClient.put<ContainerListItem>(`${WAREHOUSE_BASE}/${id}/location`, body, {}, ContainerListItemSchema);
    },
};
