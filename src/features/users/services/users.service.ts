import { apiClient } from '@/shared/lib/api-client';
import { OrganizationSchema, UserSchema } from '@/shared/types/api.schema';
import { z } from 'zod';
import { UserListItemSchema, type DetailedProfile, type UserListItem, type Organization, type InviteUserDto, type UpdateUserStatusDto } from '../types/users.schema';

const USERS_BASE = '/users';

export const usersService = {
    /**
     * Get current authenticated user profile
     */
    async getCurrentProfile(): Promise<DetailedProfile> {
        return apiClient.get<DetailedProfile>(`${USERS_BASE}/profile`, {}, UserSchema);
    },

    /**
     * Get specific user info by ID
     */
    async getUserById(userId: string): Promise<DetailedProfile> {
        return apiClient.get<DetailedProfile>(`${USERS_BASE}/${userId}`, {}, UserSchema);
    },

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: any): Promise<DetailedProfile> {
        return apiClient.put<DetailedProfile>(`${USERS_BASE}/profile/${userId}`, data, {}, UserSchema);
    },

    /**
     * List all users (Admin only)
     * Backend returns a list; we validate each if needed, but here we validate the array
     */
    async listUsers(): Promise<UserListItem[]> {
        return apiClient.get<UserListItem[]>(USERS_BASE, {}, z.array(UserListItemSchema));
    },

    /**
     * Invite a new user
     */
    async inviteUser(data: InviteUserDto): Promise<void> {
        return apiClient.post(`${USERS_BASE}/invite`, data);
    },

    /**
     * Update user status (Active/Inactive)
     */
    async updateStatus(userId: string, data: UpdateUserStatusDto): Promise<DetailedProfile> {
        return apiClient.patch<DetailedProfile>(`${USERS_BASE}/${userId}/status`, data, {}, UserSchema);
    },

    /**
     * Soft delete user
     */
    async deleteUser(userId: string): Promise<void> {
        return apiClient.delete(`${USERS_BASE}/${userId}`);
    },

    /**
     * Create a new organization and link it to the user
     */
    async createOrganization(data: { name: string }): Promise<Organization> {
        return apiClient.post<Organization>('/organization', data, {}, OrganizationSchema);
    },

    /**
     * Get organization branding/info
     */
    async getOrganization(): Promise<Organization> {
        return apiClient.get<Organization>('/organization', {}, OrganizationSchema);
    },

    /**
     * Update current organization branding/info
     */
    async updateOrganization(data: { name?: string; logoId?: string | null }): Promise<Organization> {
        return apiClient.patch<Organization>('/organization', data, {}, OrganizationSchema);
    },
};
