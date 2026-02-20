import { apiClient } from '@/shared/lib/api-client';
import type { DetailedProfile, UpdateUserProfileDto, UserListItem } from '../types/users.types';

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
};
