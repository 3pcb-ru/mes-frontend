import { create } from 'zustand';
import { productsService } from '../services/products.service';
import type { Product, CreateProductDto, UpdateProductDto } from '../types/products.schema';
import type { ApiError } from '@/shared/lib/api-client';

/**
 * Products Store - Managed via useProducts() accessor hook
 * Protocols:
 * - No direct store consumption (use useProducts)
 * - Zero 'any' policy
 * - Strict error propagation
 */

interface ProductsState {
    items: Product[];
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    createProduct: (payload: CreateProductDto) => Promise<void>;
    updateProduct: (id: string, payload: UpdateProductDto) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    clearError: () => void;
}

const useProductsStore = create<ProductsState>((set, get) => ({
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

/**
 * useProducts() Accessor Hook
 * Centralized way to consume products state and actions.
 */
export const useProducts = () => {
    const store = useProductsStore();
    return {
        ...store,
        // Helper selectors can be added here
        getProductById: (id: string) => store.items.find((p) => p.id === id),
    };
};
