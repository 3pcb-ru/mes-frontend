import { apiClient } from '@/shared/lib/api-client';
import { type DetailedProfile, type UserListItem, type Organization, type UpdateUserProfileDto } from '../types/users.types';

const USERS_BASE = '/users';

export const usersService = {
    /**
     * Get current authenticated user profile
     * GET /users/profile
     */
    async getCurrentProfile(): Promise<DetailedProfile> {
        return apiClient.get<DetailedProfile>(`${USERS_BASE}/profile`);
    },

    /**
     * Get specific user info by ID
     * GET /users/:userId
     */
    async getUserById(userId: string): Promise<DetailedProfile> {
        return apiClient.get<DetailedProfile>(`${USERS_BASE}/${userId}`);
    },

    /**
     * Update user profile
     * PUT /users/profile/:userId
     */
    async updateProfile(userId: string, data: UpdateUserProfileDto): Promise<DetailedProfile> {
        return apiClient.put<DetailedProfile>(`${USERS_BASE}/profile/${userId}`, data);
    },

    /**
     * List all users (Admin only)
     * GET /users
     */
    async listUsers(): Promise<UserListItem[]> {
        return apiClient.get<UserListItem[]>(USERS_BASE);
    },
    /**
     * Create a new organization and link it to the user
     * POST /organization
     */
    async createOrganization(data: { name: string }): Promise<any> {
        return apiClient.post<any>('/organization', data);
    },
    /**
     * Get organization branding/info
     * GET /organization
     */
    async getOrganization(): Promise<Organization> {
        return apiClient.get<Organization>('/organization');
    },
    /**
     * Update current organization branding/info
     * PATCH /organization
     */
    async updateOrganization(data: { name?: string; logoId?: string | null }): Promise<any> {
        return apiClient.patch<any>('/organization', data);
    },
};
