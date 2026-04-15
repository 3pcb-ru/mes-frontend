import { apiClient } from '@/shared/lib/api-client';
import type { CreateContainerDto, MoveContainerDto } from '../types/warehouse.types';

export const warehouseService = {
  listContainers: async (params: Record<string, any> = { limit: '100' }) => {
    const queryParams = { limit: '100', ...params };
    const qs = new URLSearchParams(queryParams).toString() ? '?' + new URLSearchParams(queryParams).toString() : '';
    return apiClient.get<any[]>(`/inventory/containers${qs}`);
  },
  getContainer: async (id: string) => apiClient.get<any>(`/inventory/containers/${id}`),
  createContainer: async (payload: CreateContainerDto) => apiClient.post<any>('/inventory/containers', payload),
  updateContainer: async (id: string, payload: any) => apiClient.put<any>(`/inventory/containers/${id}`, payload),
  deleteContainer: async (id: string) => apiClient.delete<any>(`/inventory/containers/${id}`),
  moveContainer: async (id: string, body: MoveContainerDto) => apiClient.put<any>(`/inventory/containers/${id}/location`, body),
};
