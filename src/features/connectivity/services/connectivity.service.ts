import { apiClient } from '@/shared/lib/api-client';

export const connectivityService = {
    ingestMqttEvent: async (payload: { nodeId: string; topic: string; payload: unknown; timestamp?: string }) => apiClient.post<void>('/connectivity/mqtt/ingest', payload),
};
