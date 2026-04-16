import { z } from 'zod';
import { OrganizationSchema } from '@/shared/types/api.schema';

export const WorkOrderStatusEnum = z.enum(['PLANNED', 'RELEASED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']);

export const WorkOrderSchema = z.object({
    id: z.uuid(),
    bomRevisionId: z.uuid(),
    targetQuantity: z.number().positive(),
    organizationId: z.uuid().optional(),
    status: WorkOrderStatusEnum.default('PLANNED'),
    plannedStartDate: z.string().optional().nullable(),
    plannedEndDate: z.string().optional().nullable(),
    actualStartDate: z.string().optional().nullable(),
    actualEndDate: z.string().optional().nullable(),
    organization: OrganizationSchema.optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().optional().nullable(),
});

export const CreateWorkOrderSchema = z.object({
    bomRevisionId: z.uuid('Please select a valid BOM revision'),
    targetQuantity: z.number().positive('Quantity must be greater than zero'),
    plannedStartDate: z.string().optional(),
});

export const UpdateWorkOrderSchema = CreateWorkOrderSchema.partial().extend({
    status: WorkOrderStatusEnum.optional(),
});

export type WorkOrder = z.infer<typeof WorkOrderSchema>;
export type CreateWorkOrderDto = z.infer<typeof CreateWorkOrderSchema>;
export type UpdateWorkOrderDto = z.infer<typeof UpdateWorkOrderSchema>;
export type WorkOrderStatus = z.infer<typeof WorkOrderStatusEnum>;
