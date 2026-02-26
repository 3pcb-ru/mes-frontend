import { apiClient } from '@/shared/lib/api-client';

export const productsService = {
    listProducts: async () => {
        return apiClient.get<any[]>('/products');
    },
    getProduct: async (id: string) => {
        return apiClient.get<any>(`/products/${id}`);
    },
    createProduct: async (payload: { sku: string; name: string; organizationId?: string }) => {
        return apiClient.post<any>('/products', payload);
    },
    updateProduct: async (id: string, payload: any) => {
        return apiClient.put<any>(`/products/${id}`, payload);
    },
    deleteProduct: async (id: string) => {
        return apiClient.delete<any>(`/products/${id}`);
    },
};
