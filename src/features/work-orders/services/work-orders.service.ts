import { apiClient } from '@/shared/lib/api-client';

export const workOrdersService = {
  listWorkOrders: async () => apiClient.get<any[]>('/work-orders'),
  getWorkOrder: async (id: string) => apiClient.get<any>(`/work-orders/${id}`),
  createWorkOrder: async (payload: any) => apiClient.post<any>('/work-orders', payload),
};
