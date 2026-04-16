import { z } from 'zod';
import { UserSchema, RoleSchema, OrganizationSchema } from '../../../shared/types/api.schema';

/**
 * Auth Schema synchronization with mes-backend
 */

// ============================================
// Authentication DTO Schemas
// ============================================

export const LoginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const SignupSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    code: z.string().length(6, 'Reset code must be exactly 6 digits'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
});

export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// ============================================
// API Response Schemas
// ============================================

export const MessageResponseSchema = z.object({
    message: z.string(),
});

export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: UserSchema,
    message: z.string().optional(),
});

export const RefreshResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    message: z.string().optional(),
});

// ============================================
// Inferred Types
// ============================================

export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type SignupDto = z.infer<typeof SignupSchema>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
