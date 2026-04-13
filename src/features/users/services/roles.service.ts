import { apiClient } from '@/shared/lib/api-client';
import { type Role, type RoleWithPermissions, type Permission } from '../types/users.types';

const ROLES_BASE = '/roles';

export interface CreateRoleDto {
    name: string;
    description?: string;
    permissionIds: string[];
}

export interface UpdateRoleDto {
    name?: string;
    description?: string;
}

export interface UpdateRolePermissionsDto {
    permissionIds: string[];
}

export const rolesService = {
    /**
     * List all roles visible to the user
     * GET /roles/list
     */
    async listRoles(): Promise<any> {
        return apiClient.get(`${ROLES_BASE}/list`);
    },

    /**
     * Get lookup list of roles with permissions
     * GET /roles/lookup
     */
    async lookupRoles(): Promise<RoleWithPermissions[]> {
        return apiClient.get<RoleWithPermissions[]>(`${ROLES_BASE}/lookup`);
    },

    /**
     * Get specific role with details
     * GET /roles/:roleId
     */
    async getRole(roleId: string): Promise<RoleWithPermissions> {
        return apiClient.get<RoleWithPermissions>(`${ROLES_BASE}/${roleId}`);
    },

    /**
     * Create a new custom role
     * POST /roles/create
     */
    async createRole(data: CreateRoleDto): Promise<Role> {
        return apiClient.post<Role>(`${ROLES_BASE}/create`, data);
    },

    /**
     * Update role basic details
     * PUT /roles/update-details/:roleId
     */
    async updateRoleDetails(roleId: string, data: UpdateRoleDto): Promise<Role> {
        return apiClient.put<Role>(`${ROLES_BASE}/update-details/${roleId}`, data);
    },

    /**
     * Update role permissions
     * PUT /roles/update-permissions/:roleId
     */
    async updateRolePermissions(roleId: string, data: UpdateRolePermissionsDto): Promise<void> {
        return apiClient.put(`${ROLES_BASE}/update-permissions/${roleId}`, data);
    },

    /**
     * Duplicate an existing role
     * POST /roles/:roleId/duplicate
     */
    async duplicateRole(roleId: string): Promise<Role> {
        return apiClient.post<Role>(`${ROLES_BASE}/${roleId}/duplicate`, {});
    },

    /**
     * Delete a custom role
     * DELETE /roles/:roleId
     */
    async deleteRole(roleId: string): Promise<void> {
        return apiClient.delete(`${ROLES_BASE}/${roleId}`);
    },
};
