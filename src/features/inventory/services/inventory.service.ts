import { apiClient } from '@/shared/lib/api-client';

export const inventoryService = {
  listContainers: async () => apiClient.get<any[]>('/inventory/containers'),
  getContainer: async (id: string) => apiClient.get<any>(`/inventory/containers/${id}`),
  createContainer: async (payload: any) => apiClient.post<any>('/inventory/containers', payload),
  updateContainer: async (id: string, payload: any) => apiClient.put<any>(`/inventory/containers/${id}`, payload),
  deleteContainer: async (id: string) => apiClient.delete<any>(`/inventory/containers/${id}`),
  moveContainer: async (id: string, body: { targetNodeId: string; userId?: string }) => apiClient.put<any>(`/inventory/containers/${id}/location`, body),
};
