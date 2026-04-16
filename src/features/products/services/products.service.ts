import { apiClient } from '@/shared/lib/api-client';
import { z } from 'zod';
import { ProductSchema, type Product, type CreateProductDto, type UpdateProductDto } from '../types/products.schema';

const PRODUCTS_BASE = '/products';

export const productsService = {
    /**
     * List all products
     */
    listProducts: async (): Promise<Product[]> => {
        return apiClient.get<Product[]>(PRODUCTS_BASE, {}, z.array(ProductSchema));
    },

    /**
     * Get a specific product by ID
     */
    getProduct: async (id: string): Promise<Product> => {
        return apiClient.get<Product>(`${PRODUCTS_BASE}/${id}`, {}, ProductSchema);
    },

    /**
     * Create a new product
     */
    createProduct: async (payload: CreateProductDto): Promise<Product> => {
        return apiClient.post<Product>(PRODUCTS_BASE, payload, {}, ProductSchema);
    },

    /**
     * Update an existing product
     */
    updateProduct: async (id: string, payload: UpdateProductDto): Promise<Product> => {
        return apiClient.put<Product>(`${PRODUCTS_BASE}/${id}`, payload, {}, ProductSchema);
    },

    /**
     * Delete a product
     */
    deleteProduct: async (id: string): Promise<void> => {
        return apiClient.delete(`${PRODUCTS_BASE}/${id}`);
    },
};
