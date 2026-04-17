import { z } from 'zod';

/**
 * BOM Revisions Schemas
 */
export const BomRevisionSchema = z.object({
    id: z.uuid(),
    productId: z.uuid(),
    version: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * BOM Materials Schemas
 */
export const BomMaterialSchema = z.object({
    id: z.uuid(),
    bomRevisionId: z.uuid(),
    itemId: z.uuid(),
    quantity: z.number(),
    designators: z.array(z.string()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    // Joined fields
    mpn: z.string().optional(),
    manufacturer: z.string().nullable().optional(),
    alternatives: z.array(z.any()).optional(),
});

export type BomRevision = z.infer<typeof BomRevisionSchema>;
export type BomMaterial = z.infer<typeof BomMaterialSchema>;

/**
 * Material DTOs
 */
export const CreateMaterialDtoSchema = z.object({
    itemId: z.uuid(),
    quantity: z.number().positive(),
    unit: z.string().min(1),
    designators: z.array(z.string()).default([]),
    alternatives: z.array(z.uuid()).default([]),
});

export const UpdateMaterialDtoSchema = CreateMaterialDtoSchema.partial();

export type CreateMaterialDto = z.infer<typeof CreateMaterialDtoSchema>;
export type UpdateMaterialDto = z.infer<typeof UpdateMaterialDtoSchema>;
