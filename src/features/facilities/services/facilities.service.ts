import { apiClient } from '@/shared/lib/api-client';

export const facilitiesService = {
  listFacilities: async () => apiClient.get<any[]>('/facilities'),
  getFacility: async (id: string) => apiClient.get<any>(`/facilities/${id}`),
  createFacility: async (payload: any) => apiClient.post<any>('/facilities', payload),
  updateFacility: async (id: string, payload: any) => apiClient.put<any>(`/facilities/${id}`, payload),
  changeStatus: async (id: string, body: { status: string; reason?: string }) => apiClient.post<any>(`/facilities/${id}/change-status`, body),
};
