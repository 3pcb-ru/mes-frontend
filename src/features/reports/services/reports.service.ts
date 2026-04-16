import { apiClient } from '@/shared/lib/api-client';
import { z } from 'zod';
import { ActivityLogSchema, ActivityLog, TraceabilityLogSchema, TraceabilityLog } from '../types/reports.schema';

export const reportsService = {
    listActivities: async (): Promise<ActivityLog[]> => apiClient.get<ActivityLog[]>('/reports/activities', {}, z.array(ActivityLogSchema)),

    getActivity: async (id: string): Promise<ActivityLog> => apiClient.get<ActivityLog>(`/reports/activities/${id}`, {}, ActivityLogSchema),

    listTraceability: async (): Promise<TraceabilityLog[]> => apiClient.get<TraceabilityLog[]>('/reports/traceability', {}, z.array(TraceabilityLogSchema)),
};
