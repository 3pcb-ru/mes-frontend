import { apiClient } from '../lib/api-client';

export const attachmentsService = {
    /**
     * Upload a file as an attachment
     * POST /attachments
     */
    async uploadAttachment(file: File): Promise<{ id: string; url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<{ id: string; url: string }>('/attachments', formData);
    },
};
