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
    id: z.uuidv4(),
    organizationId: z.uuidv4(),
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
    id: z.uuidv4(),
    organizationId: z.uuidv4(),
    parentId: z.uuidv4().nullable().optional(),
    path: z.string(), // LTree representation
    definitionId: z.uuidv4().nullable().optional(),
    name: z.string(),
    type: NodeTypeEnum.optional().nullable(),
    capabilities: z.array(z.string()).optional().nullable(),
    status: z.string().default('IDLE'),
    attributes: z.record(z.string(), z.any()).optional().nullable(),
    userId: z.uuidv4().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    // Relations (if expanded)
    definition: NodeDefinitionSchema.optional().nullable(),
});

export const CreateFacilityDtoSchema = z.object({
    name: z.string().min(2),
    parentId: z.uuidv4().nullable().optional(),
    definitionId: z.uuidv4(),
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
