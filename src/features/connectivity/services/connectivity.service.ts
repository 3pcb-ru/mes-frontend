import { apiClient } from '@/shared/lib/api-client';

export const connectivityService = {
  ingestMqttEvent: async (payload: { nodeId: string; topic: string; payload: any; timestamp?: string }) =>
    apiClient.post<any>('/connectivity/mqtt/ingest', payload),
};
