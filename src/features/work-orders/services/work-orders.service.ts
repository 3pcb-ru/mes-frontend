import { apiClient } from '@/shared/lib/api-client';
import { z } from 'zod';
import { 
    WorkOrderSchema, 
    WorkOrder, 
    CreateWorkOrderDto, 
    UpdateWorkOrderDto 
} from '../types/work-orders.schema';

export const workOrdersService = {
    listWorkOrders: async (): Promise<WorkOrder[]> => 
        apiClient.get<WorkOrder[]>('/work-orders', {}, z.array(WorkOrderSchema)),

    getWorkOrder: async (id: string): Promise<WorkOrder> => 
        apiClient.get<WorkOrder>(`/work-orders/${id}`, {}, WorkOrderSchema),

    createWorkOrder: async (payload: CreateWorkOrderDto): Promise<WorkOrder> => 
        apiClient.post<WorkOrder>('/work-orders', payload, {}, WorkOrderSchema),

    updateWorkOrder: async (id: string, payload: UpdateWorkOrderDto): Promise<WorkOrder> => 
        apiClient.put<WorkOrder>(`/work-orders/${id}`, payload, {}, WorkOrderSchema),

    deleteWorkOrder: async (id: string): Promise<void> => 
        apiClient.delete<void>(`/work-orders/${id}`),
};
