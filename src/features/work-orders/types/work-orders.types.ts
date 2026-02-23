export type WorkOrderListItem = {
  id: string;
  bomRevisionId: string;
  targetQuantity: number;
  tenantId?: string;
  plannedStartDate?: string;
  createdAt?: string;
};
