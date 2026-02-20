export type NotificationType = 'system' | 'alert' | 'info' | 'success' | 'warning' | 'error';
export type NotificationStatus = 'read' | 'unread';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    readAt: string | null;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationListResponse {
    success: boolean;
    message: string;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: Notification[];
}

export interface NotificationResponse {
    success: boolean;
    message: string;
    data: Notification;
}

export interface MarkAllReadResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
    };
}
