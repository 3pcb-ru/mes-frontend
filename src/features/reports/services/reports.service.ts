import { apiClient } from '@/shared/lib/api-client';

export const reportsService = {
  listActivities: async () => apiClient.get<any[]>('/reports/activities'),
  getActivity: async (id: string) => apiClient.get<any>(`/reports/activities/${id}`),
  createActivity: async (payload: any) => apiClient.post<any>('/reports/activities', payload),
  updateActivity: async (id: string, payload: any) => apiClient.put<any>(`/reports/activities/${id}`, payload),
  deleteActivity: async (id: string) => apiClient.delete<any>(`/reports/activities/${id}`),
};
