import { apiClient } from '@/shared/lib/api-client';

export const productsService = {
  listProducts: async () => {
    return apiClient.get<any[]>('/products');
  },
  getProduct: async (id: string) => {
    return apiClient.get<any>(`/products/${id}`);
  },
  createProduct: async (payload: { sku: string; name: string; tenantId?: string }) => {
    return apiClient.post<any>('/products', payload);
  },
};
