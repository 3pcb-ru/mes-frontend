import { apiClient } from '@/shared/lib/api-client';
import { z } from 'zod';
import { ProductSchema, type Product, type CreateProductDto, type UpdateProductDto } from '../types/products.schema';
import { BomRevisionSchema, BomMaterialSchema, type BomRevision, type BomMaterial } from '../types/bom.schema';

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

    /**
     * List revisions for a product
     */
    listRevisions: async (productId: string): Promise<BomRevision[]> => {
        return apiClient.get<BomRevision[]>(`${PRODUCTS_BASE}/${productId}/revisions`, {}, z.array(BomRevisionSchema));
    },

    /**
     * Create a new revision
     */
    createRevision: async (productId: string, payload: { version?: string }): Promise<BomRevision> => {
        return apiClient.post<BomRevision>(`${PRODUCTS_BASE}/${productId}/revisions`, payload, {}, BomRevisionSchema);
    },

    /**
     * Duplicate an existing revision (creates an alternative with cloned materials)
     */
    duplicateRevision: async (productId: string, revisionId: string): Promise<BomRevision> => {
        return apiClient.post<BomRevision>(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/alternative`, {}, {}, BomRevisionSchema);
    },

    /**
     * Delete a revision
     */
    deleteRevision: async (productId: string, revisionId: string): Promise<void> => {
        return apiClient.delete(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}`);
    },

    /**
     * Submit a revision for approval
     */
    submitRevision: async (productId: string, revisionId: string): Promise<void> => {
        return apiClient.post(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/submit`, {}, {});
    },

    /**
     * Approve a revision
     */
    approveRevision: async (productId: string, revisionId: string): Promise<void> => {
        return apiClient.post(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/approve`, {}, {});
    },

    /**
     * Activate a revision
     */
    activateRevision: async (productId: string, revisionId: string): Promise<void> => {
        return apiClient.post(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/activate`, {}, {});
    },

    /**
     * List materials for a revision
     */
    listMaterials: async (productId: string, revisionId: string): Promise<BomMaterial[]> => {
        return apiClient.get<BomMaterial[]>(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/materials`, {}, z.array(BomMaterialSchema));
    },

    /**
     * Add a material to a revision
     */
    addMaterial: async (productId: string, revisionId: string, payload: any): Promise<BomMaterial> => {
        return apiClient.post<BomMaterial>(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/materials`, payload, {}, BomMaterialSchema);
    },

    /**
     * Update an existing material
     */
    updateMaterial: async (productId: string, revisionId: string, materialId: string, payload: any): Promise<BomMaterial> => {
        return apiClient.put<BomMaterial>(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/materials/${materialId}`, payload, {}, BomMaterialSchema);
    },

    /**
     * Delete a material from a revision
     */
    deleteMaterial: async (productId: string, revisionId: string, materialId: string): Promise<void> => {
        return apiClient.delete(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/materials/${materialId}`);
    },

    /**
     * Search for parts locally and on Octopart
     */
    searchParts: async (productId: string, revisionId: string, q: string): Promise<{ local: any[]; octopart: any[] }> => {
        return apiClient.get(`${PRODUCTS_BASE}/${productId}/revisions/${revisionId}/materials/search-parts?q=${encodeURIComponent(q)}`, {}, z.any());
    },
};
