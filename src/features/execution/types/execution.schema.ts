import { z } from 'zod';

export const ExecutionStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED']);

export const ExecutionJobSchema = z.object({
    id: z.uuid(),
    workOrderId: z.uuid(),
    nodeId: z.uuid(),
    status: ExecutionStatusEnum.default('PENDING'),
    operatorId: z.uuid().optional().nullable(),
    startedAt: z.string().optional().nullable(),
    completedAt: z.string().optional().nullable(),
    errorMessage: z.string().optional().nullable(),
    metadata: z.record(z.string(), z.any()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const CreateExecutionJobSchema = z.object({
    workOrderId: z.uuid('Please select a valid Work Order'),
    nodeId: z.uuid('Please select a valid Node/Station'),
});

export const UpdateExecutionStatusSchema = z.object({
    status: ExecutionStatusEnum,
    errorMessage: z.string().optional(),
});

export type ExecutionJob = z.infer<typeof ExecutionJobSchema>;
export type CreateExecutionJobDto = z.infer<typeof CreateExecutionJobSchema>;
export type UpdateExecutionStatusDto = z.infer<typeof UpdateExecutionStatusSchema>;
export type ExecutionStatus = z.infer<typeof ExecutionStatusEnum>;
