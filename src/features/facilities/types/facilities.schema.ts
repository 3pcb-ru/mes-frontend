import { z } from 'zod';

/**
 * Facilities (Nodes) Schemas
 * Synchronized with mes-backend/src/models/schema/nodes.schema.ts
 */

export const NodeTypeEnum = z.enum(['PRODUCTION', 'WAREHOUSE', 'LOGISTICS', 'FACILITY', 'QUALITY', 'OTHER']);

export const NodeStatusChangeReasonEnum = z.enum([
    'NORMAL_OPERATION',
    'MAINTENANCE',
    'SETUP_TEARDOWN',
    'MATERIAL_SHORTAGE',
    'BREAKDOWN',
    'QUALITY_ISSUE',
    'OPERATOR_BREAK',
    'OTHER',
]);

export const NodeDefinitionSchema = z.object({
    id: z.uuid(),
    organizationId: z.uuid(),
    name: z.string().min(2),
    type: NodeTypeEnum,
    attributeSchema: z.record(z.string(), z.any()).optional().nullable(),
    supportedActions: z
        .array(
            z.object({
                action: z.string(),
                params: z.record(z.string(), z.any()).optional(),
            }),
        )
        .optional()
        .nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const FacilityListItemSchema = z.object({
    id: z.uuid(),
    organizationId: z.uuid(),
    parentId: z.uuid().nullable().optional(),
    path: z.string(), // LTree representation
    definitionId: z.uuid().nullable().optional(),
    name: z.string(),
    type: NodeTypeEnum.optional().nullable(),
    capabilities: z.array(z.string()).optional().nullable(),
    status: z.string().default('IDLE'),
    attributes: z.record(z.string(), z.any()).optional().nullable(),
    userId: z.uuid().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    // Relations (if expanded)
    definition: NodeDefinitionSchema.optional().nullable(),
});

export const CreateFacilityDtoSchema = z.object({
    name: z.string().min(2),
    parentId: z.uuid().nullable().optional(),
    definitionId: z.uuid(),
    type: NodeTypeEnum.optional(),
    capabilities: z.array(z.string()).optional(),
});

export const NodeStatusChangeSchema = z.object({
    status: z.string(),
    reason: NodeStatusChangeReasonEnum,
    comment: z.string().optional(),
});

export type FacilityListItem = z.infer<typeof FacilityListItemSchema>;
export type NodeDefinition = z.infer<typeof NodeDefinitionSchema>;
export type CreateFacilityDto = z.infer<typeof CreateFacilityDtoSchema>;
export type NodeStatusChange = z.infer<typeof NodeStatusChangeSchema>;
export type NodeStatusChangeReason = z.infer<typeof NodeStatusChangeReasonEnum>;
export type NodeType = z.infer<typeof NodeTypeEnum>;
