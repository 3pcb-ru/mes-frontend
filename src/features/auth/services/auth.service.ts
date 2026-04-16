import { apiClient } from '@/shared/lib/api-client';
import {
    LoginResponseSchema,
    RefreshResponseSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    type SignupDto,
    type LoginDto,
    type ChangePasswordDto,
    type ForgotPasswordDto,
    type ResetPasswordDto,
    type LoginResponse,
    type MessageResponse,
    type RefreshResponse,
    MessageResponseSchema,
} from '../types/auth.schema';
import { type AcceptInvitationDto } from '@/features/users/types/users.schema';
import { z } from 'zod';

const AUTH_BASE = '/auth';

export const authService = {
    /**
     * Register a new user
     */
    async signup(data: SignupDto): Promise<{ accessToken: string; refreshToken: string; email: string; message: string }> {
        // Signup response structure is slightly different (includes email)
        const SignupResponseSchema = z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
            email: z.string(),
            message: z.string(),
        });
        return apiClient.post(`${AUTH_BASE}/signup`, data, {}, SignupResponseSchema);
    },

    /**
     * Verify email with token
     */
    async verifyEmail(token: string): Promise<MessageResponse> {
        return apiClient.get<MessageResponse>(`${AUTH_BASE}/verify/${token}`);
    },

    /**
     * Login with email and password
     */
    async login(data: LoginDto): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(`${AUTH_BASE}/login`, data, {}, LoginResponseSchema);
    },

    /**
     * Accept a user invitation and set password
     */
    async acceptInvitation(data: AcceptInvitationDto): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(`${AUTH_BASE}/accept-invitation`, data, {}, LoginResponseSchema);
    },

    /**
     * Logout current user
     */
    async logout(): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(`${AUTH_BASE}/logout`);
    },

    /**
     * Change password for authenticated user
     */
    async changePassword(data: ChangePasswordDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/change-password`, data);
    },

    /**
     * Request password reset link
     */
    async forgotPassword(data: ForgotPasswordDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/password/reset-link`, data, {}, MessageResponseSchema);
    },

    /**
     * Reset password with code
     */
    async resetPassword(data: ResetPasswordDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/password/reset-password`, data, {}, MessageResponseSchema);
    },

    /**
     * Resend verification email
     */
    async resendVerification(data: { email: string }): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/resend-verification`, data, {}, MessageResponseSchema);
    },

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken: string): Promise<RefreshResponse> {
        return apiClient.post<RefreshResponse>(`${AUTH_BASE}/refresh`, { refreshToken }, {}, RefreshResponseSchema);
    },
};
