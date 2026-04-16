import { z } from 'zod';

export const ActivityLogSchema = z.object({
    id: z.uuidv4(),
    actionType: z.string(),
    organizationId: z.uuidv4().optional(),
    userId: z.uuidv4().optional(),
    jobId: z.uuidv4().optional().nullable(),
    nodeId: z.uuidv4().optional().nullable(),
    sourceContainerId: z.uuidv4().optional().nullable(),
    metadata: z.record(z.string(), z.any()).optional().nullable(),
    message: z.string().optional().nullable(),
    createdAt: z.string(),
});

export const TraceabilityLogSchema = z.object({
    id: z.uuidv4(),
    entityType: z.string(),
    entityId: z.uuidv4(),
    action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'RESTORE']),
    oldValue: z.record(z.string(), z.any()).optional().nullable(),
    newValue: z.record(z.string(), z.any()).optional().nullable(),
    organizationId: z.uuidv4(),
    userId: z.uuidv4().optional(),
    createdAt: z.string(),
});

export type ActivityLog = z.infer<typeof ActivityLogSchema>;
export type TraceabilityLog = z.infer<typeof TraceabilityLogSchema>;
