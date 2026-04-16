import type { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderStatus } from './work-orders.schema';

export type { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderStatus };

// Legacy compatibility - mapped to new WorkOrder type
export type WorkOrderListItem = WorkOrder;
