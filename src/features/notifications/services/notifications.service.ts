import { apiClient } from '@/shared/lib/api-client';
import type { NotificationListResponse, NotificationResponse, MarkAllReadResponse } from '../types/notifications.types';

const NOTIFICATIONS_BASE = '/notifications';

export const notificationsService = {
    async list(params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; filters?: string }): Promise<NotificationListResponse> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params?.filters) queryParams.append('filters', params.filters);

        const query = queryParams.toString();
        return apiClient.get<NotificationListResponse>(`${NOTIFICATIONS_BASE}${query ? `?${query}` : ''}`);
    },

    async markAsRead(id: string): Promise<NotificationResponse> {
        return apiClient.patch<NotificationResponse>(`${NOTIFICATIONS_BASE}/${id}/read`, {});
    },

    async markAllAsRead(): Promise<MarkAllReadResponse> {
        return apiClient.patch<MarkAllReadResponse>(`${NOTIFICATIONS_BASE}/read-all`, {});
    },

    async delete(id: string): Promise<NotificationResponse> {
        return apiClient.delete<NotificationResponse>(`${NOTIFICATIONS_BASE}/${id}`);
    },
};
