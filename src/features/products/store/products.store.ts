import { create } from 'zustand';
import { productsService } from '../services/products.service';
import type { ProductListItem } from '../types/products.types';
import type { ApiError } from '@/shared/lib/api-client';

interface ProductsState {
    // State
    items: ProductListItem[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProducts: () => Promise<void>;
    createProduct: (payload: { sku: string; name: string }) => Promise<void>;
    updateProduct: (id: string, payload: Partial<ProductListItem>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await productsService.listProducts();
            set({ items: Array.isArray(data) ? data : [] });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch products' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    createProduct: async (payload) => {
        set({ error: null });
        try {
            await productsService.createProduct(payload);
            await get().fetchProducts();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to create product' });
            throw err;
        }
    },

    updateProduct: async (id, payload) => {
        set({ error: null });
        try {
            await productsService.updateProduct(id, payload);
            await get().fetchProducts();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to update product' });
            throw err;
        }
    },

    deleteProduct: async (id) => {
        set({ error: null });
        try {
            await productsService.deleteProduct(id);
            await get().fetchProducts();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to delete product' });
            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));
