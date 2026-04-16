import { z } from 'zod';

/**
 * Warehouse Schema synchronization with mes-backend
 */

export const ContainerListItemSchema = z.object({
    id: z.uuid(),
    lpn: z.string().min(1, 'LPN is required'),
    organizationId: z.uuid().optional(),
    locationNodeId: z.uuid().nullable().optional(),
    type: z.string().optional(),
    createdAt: z.string().optional(),
});

export const CreateContainerSchema = z.object({
    lpn: z.string().min(1, 'LPN is required'),
    item: z.string().min(1, 'Item is required'),
    quantity: z.number().min(0, 'Quantity cannot be negative'),
    source: z.string().min(1, 'Source is required'),
    expectedDate: z.string().optional(),
    actualDate: z.string().optional(),
    type: z.string().optional(),
    locationNodeId: z.uuid().optional(),
});

export const MoveContainerSchema = z.object({
    targetNodeId: z.uuid('Invalid target node ID'),
    userId: z.uuid().optional(),
});

// ============================================
// Inferred Types
// ============================================

export type ContainerListItem = z.infer<typeof ContainerListItemSchema>;
export type CreateContainerDto = z.infer<typeof CreateContainerSchema>;
export type MoveContainerDto = z.infer<typeof MoveContainerSchema>;
