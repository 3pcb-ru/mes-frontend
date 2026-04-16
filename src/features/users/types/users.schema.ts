import z from 'zod';
import { UserSchema, RoleSchema, OrganizationSchema } from '../../../shared/types/api.schema';

/**
 * Users Schema synchronization with mes-backend
 */

export const UserListItemSchema = z.object({
    id: z.uuidv4(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.union([z.string(), RoleSchema]), // Backwards compatibility + Relation support
    isVerified: z.boolean(),
    createdAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    avatarId: z.uuidv4().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
});

export const DetailedProfileSchema = UserSchema.extend({
    // Additional frontend-only or extended fields if needed
});

export const InviteUserSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    roleId: z.uuidv4('Invalid role ID'),
});

export const UpdateUserStatusSchema = z.object({
    status: z.enum(['active', 'inactive']),
});

export const AcceptInvitationSchema = z.object({
    token: z.string().min(1, 'Invitation token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

// ============================================
// Inferred Types
// ============================================

export type UserListItem = z.infer<typeof UserListItemSchema>;
export type DetailedProfile = z.infer<typeof DetailedProfileSchema>;
export type InviteUserDto = z.infer<typeof InviteUserSchema>;
export type UpdateUserStatusDto = z.infer<typeof UpdateUserStatusSchema>;
export type AcceptInvitationDto = z.infer<typeof AcceptInvitationSchema>;
export type RoleWithPermissions = z.infer<typeof RoleSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
