import { apiClient } from '@/shared/lib/api-client';

export const inventoryService = {
  listContainers: async () => apiClient.get<any[]>('/inventory/containers'),
  getContainer: async (id: string) => apiClient.get<any>(`/inventory/containers/${id}`),
  createContainer: async (payload: any) => apiClient.post<any>('/inventory/containers', payload),
  moveContainer: async (id: string, body: { targetNodeId: string; userId?: string }) => apiClient.put<any>(`/inventory/containers/${id}/location`, body),
};
