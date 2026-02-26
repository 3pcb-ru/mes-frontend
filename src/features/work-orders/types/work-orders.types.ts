export type WorkOrderListItem = {
    id: string;
    bomRevisionId: string;
    targetQuantity: number;
    organizationId?: string;
    plannedStartDate?: string;
    createdAt?: string;
};
