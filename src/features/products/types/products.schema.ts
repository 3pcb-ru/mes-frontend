import { z } from 'zod';

/**
 * Products Schemas
 * Synchronized with mes-backend/src/models/schema/product.schema.ts
 */

export const ProductSchema = z.object({
    id: z.uuid(),
    organizationId: z.uuid(),
    name: z.string().min(2),
    sku: z.string().min(2),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
});

export const CreateProductDtoSchema = z.object({
    name: z.string().min(2),
    sku: z.string().min(2),
    organizationId: z.uuid().optional(),
});

export const UpdateProductDtoSchema = CreateProductDtoSchema.partial();

export type Product = z.infer<typeof ProductSchema>;
export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;
