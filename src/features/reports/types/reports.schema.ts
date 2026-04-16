import { z } from 'zod';

export const ActivityLogSchema = z.object({
    id: z.uuid(),
    actionType: z.string(),
    organizationId: z.uuid().optional(),
    userId: z.uuid().optional(),
    jobId: z.uuid().optional().nullable(),
    nodeId: z.uuid().optional().nullable(),
    sourceContainerId: z.uuid().optional().nullable(),
    metadata: z.record(z.string(), z.any()).optional().nullable(),
    message: z.string().optional().nullable(),
    createdAt: z.string(),
});

export const TraceabilityLogSchema = z.object({
    id: z.uuid(),
    entityType: z.string(),
    entityId: z.uuid(),
    action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'RESTORE']),
    oldValue: z.record(z.string(), z.any()).optional().nullable(),
    newValue: z.record(z.string(), z.any()).optional().nullable(),
    organizationId: z.uuid(),
    userId: z.uuid().optional(),
    createdAt: z.string(),
});

export type ActivityLog = z.infer<typeof ActivityLogSchema>;
export type TraceabilityLog = z.infer<typeof TraceabilityLogSchema>;
