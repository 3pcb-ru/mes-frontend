import { z } from 'zod';

/**
 * Shared API Schemas
 * Synchronized with mes-backend/src/models/zod-schemas
 */

export const OrganizationSchema = z.object({
    id: z.uuidv4(),
    name: z.string().min(2).max(100),
    timezone: z.string().optional().default('UTC'),
    logoId: z.uuidv4().nullable().optional(),
    logoUrl: z.string().url().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const PermissionSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    description: z.string(),
});

export const RoleSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    description: z.string().nullable().optional(),
    isDefault: z.boolean(),
    isAdmin: z.boolean(),
    organizationId: z.uuidv4().nullable().optional(),
    permissions: z.array(PermissionSchema).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const UserSchema = z.object({
    id: z.uuidv4(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().nullable().optional(),
    avatarId: z.uuidv4().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    isVerified: z.boolean().nullable().optional(),
    roleId: z.uuidv4(),
    role: RoleSchema,
    organizationId: z.uuidv4().nullable().optional(),
    organization: OrganizationSchema.nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Permission = z.infer<typeof PermissionSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
