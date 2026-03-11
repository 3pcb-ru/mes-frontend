export type WorkOrderListItem = {
    id: string;
    bomRevisionId: string;
    targetQuantity: number;
    organizationId?: string;
    status?: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'CLOSED';
    plannedStartDate?: string;
    createdAt?: string;
};
