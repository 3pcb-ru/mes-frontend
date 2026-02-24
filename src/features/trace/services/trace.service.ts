import { apiClient } from '@/shared/lib/api-client';

export const traceService = {
  listActivities: async () => apiClient.get<any[]>('/trace/activities'),
  getActivity: async (id: string) => apiClient.get<any>(`/trace/activities/${id}`),
  createActivity: async (payload: any) => apiClient.post<any>('/trace/activities', payload),
  updateActivity: async (id: string, payload: any) => apiClient.put<any>(`/trace/activities/${id}`, payload),
  deleteActivity: async (id: string) => apiClient.delete<any>(`/trace/activities/${id}`),
};
