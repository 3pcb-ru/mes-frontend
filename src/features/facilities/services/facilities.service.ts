import { apiClient } from '@/shared/lib/api-client';
import type { NodeStatusChangeReason } from '../types/facilities.types';

export const facilitiesService = {
    listFacilities: async (params?: Record<string, any>) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiClient.get<any[]>(`/nodes${qs}`);
    },
    getFacility: async (id: string) => apiClient.get<any>(`/nodes/${id}`),
    createFacility: async (payload: any) => apiClient.post<any>('/nodes', payload),
    updateFacility: async (id: string, payload: any) => apiClient.put<any>(`/nodes/${id}`, payload),
    deleteFacility: async (id: string) => apiClient.delete<any>(`/nodes/${id}`),
    changeStatus: async (id: string, body: { status: string; reason: NodeStatusChangeReason }) =>
        apiClient.patch<any>(`/nodes/${id}/status`, body),
};
