import { create } from 'zustand';
import type { Notification } from '../types/notifications.types';
import { notificationsService } from '../services/notifications.service';

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;

    // Actions
    fetchNotifications: (page?: number, limit?: number) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    removeNotification: (id: string) => Promise<void>;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationsState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    pagination: null,

    fetchNotifications: async (page = 1, limit = 50) => {
        set({ isLoading: true });
        try {
            const response = await notificationsService.list({
                page,
                limit,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            });

            set({
                notifications: response.data,
                unreadCount: response.data.filter((n) => n.status === 'unread').length,
                pagination: response.pagination,
                isLoading: false,
            });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            set({ isLoading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            await notificationsService.markAsRead(id);

            set((state) => {
                const newNotifications = state.notifications.map((n) => (n.id === id ? { ...n, status: 'read' as const, readAt: new Date().toISOString() } : n));
                return {
                    notifications: newNotifications,
                    unreadCount: newNotifications.filter((n) => n.status === 'unread').length,
                };
            });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationsService.markAllAsRead();

            set((state) => {
                const newNotifications = state.notifications.map((n) => ({
                    ...n,
                    status: 'read' as const,
                    readAt: n.readAt || new Date().toISOString(),
                }));
                return {
                    notifications: newNotifications,
                    unreadCount: 0,
                };
            });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    },

    removeNotification: async (id) => {
        try {
            await notificationsService.delete(id);

            set((state) => {
                const newNotifications = state.notifications.filter((n) => n.id !== id);
                return {
                    notifications: newNotifications,
                    unreadCount: newNotifications.filter((n) => n.status === 'unread').length,
                };
            });
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    },

    clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

export const useNotifications = () => {
    const store = useNotificationStore();
    return {
        notifications: store.notifications,
        unreadCount: store.unreadCount,
        isLoading: store.isLoading,
        pagination: store.pagination,
        fetchNotifications: store.fetchNotifications,
        markAsRead: store.markAsRead,
        markAllAsRead: store.markAllAsRead,
        removeNotification: store.removeNotification,
        clearAll: store.clearAll,
    };
};
