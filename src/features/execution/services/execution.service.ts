import { apiClient } from '@/shared/lib/api-client';
import { z } from 'zod';
import {
    ExecutionJobSchema,
    ExecutionJob,
    CreateExecutionJobDto,
    UpdateExecutionStatusDto,
} from '../types/execution.schema';

const BASE_URL = '/execution';

export const executionService = {
    listJobs: async (): Promise<ExecutionJob[]> =>
        apiClient.get<ExecutionJob[]>(`${BASE_URL}/jobs`, {}, z.array(ExecutionJobSchema)),

    getJob: async (id: string): Promise<ExecutionJob> =>
        apiClient.get<ExecutionJob>(`${BASE_URL}/jobs/${id}`, {}, ExecutionJobSchema),

    createJob: async (payload: CreateExecutionJobDto): Promise<ExecutionJob> =>
        apiClient.post<ExecutionJob>(`${BASE_URL}/jobs`, payload, {}, ExecutionJobSchema),

    updateStatus: async (id: string, payload: UpdateExecutionStatusDto): Promise<ExecutionJob> =>
        apiClient.patch<ExecutionJob>(`${BASE_URL}/jobs/${id}/status`, payload, {}, ExecutionJobSchema),

    startJob: async (id: string): Promise<ExecutionJob> =>
        apiClient.post<ExecutionJob>(`${BASE_URL}/jobs/${id}/start`, {}, {}, ExecutionJobSchema),

    completeJob: async (id: string): Promise<ExecutionJob> =>
        apiClient.post<ExecutionJob>(`${BASE_URL}/jobs/${id}/complete`, {}, {}, ExecutionJobSchema),
};
