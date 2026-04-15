import { create } from 'zustand';
import { usersService } from '../services/users.service';
import { rolesService } from '../services/roles.service';
import type { UserListItem, RoleWithPermissions, UpdateUserStatusDto } from '../types/users.types';
import type { ApiError } from '@/shared/lib/api-client';

interface UsersState {
    // State
    users: UserListItem[];
    roles: RoleWithPermissions[];
    isUsersLoading: boolean;
    isRolesLoading: boolean;
    error: string | null;

    // Actions
    fetchUsers: () => Promise<void>;
    fetchRoles: () => Promise<void>;
    updateUserStatus: (userId: string, data: UpdateUserStatusDto) => Promise<void>;
    duplicateRole: (roleId: string) => Promise<void>;
    deleteRole: (roleId: string) => Promise<void>;
    clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    roles: [],
    isUsersLoading: false,
    isRolesLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isUsersLoading: true, error: null });
        try {
            const response = await usersService.listUsers();
            // Handle various backend response structures as identified in audit
            let userList: UserListItem[] = [];
            if (Array.isArray(response)) {
                userList = response;
            } else if (response && typeof response === 'object') {
                userList = (response as any).data || (response as any).users || (response as any).items || [];
            }
            set({ users: userList });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch users' });
            throw err;
        } finally {
            set({ isUsersLoading: false });
        }
    },

    fetchRoles: async () => {
        set({ isRolesLoading: true, error: null });
        try {
            const data = await rolesService.lookupRoles();
            const roleList = Array.isArray(data) ? data : (data as any)?.roles || [];
            set({ roles: roleList });
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to fetch roles' });
            throw err;
        } finally {
            set({ isRolesLoading: false });
        }
    },

    updateUserStatus: async (userId: string, data: UpdateUserStatusDto) => {
        try {
            await usersService.updateStatus(userId, data);
            await get().fetchUsers();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to update user status' });
            throw err;
        }
    },

    duplicateRole: async (roleId: string) => {
        try {
            await rolesService.duplicateRole(roleId);
            await get().fetchRoles();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to duplicate role' });
            throw err;
        }
    },

    deleteRole: async (roleId: string) => {
        try {
            await rolesService.deleteRole(roleId);
            await get().fetchRoles();
        } catch (err) {
            const apiError = err as ApiError;
            set({ error: apiError.message || 'Failed to delete role' });
            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));
