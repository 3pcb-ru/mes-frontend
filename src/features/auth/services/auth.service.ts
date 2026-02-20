import { apiClient } from '@/shared/lib/api-client';
import type {
    SignupDto,
    LoginDto,
    ChangePasswordDto,
    ForgotPasswordDto,
    ValidateResetCodeDto,
    ResetPasswordDto,
    ResendVerificationDto,
    AuthResponse,
    LoginResponse,
    SignupResponse,
    MessageResponse,
    VerificationStatusResponse,
} from '../types/auth.types';

const AUTH_BASE = '/auth';

export const authService = {
    /**
     * Register a new user
     * POST /auth/signup
     */
    async signup(data: SignupDto): Promise<SignupResponse> {
        return apiClient.post<SignupResponse>(`${AUTH_BASE}/signup`, data);
    },

    /**
     * Verify email with token
     * GET /auth/verify/:token
     */
    async verifyEmail(token: string): Promise<MessageResponse> {
        return apiClient.get<MessageResponse>(`${AUTH_BASE}/verify/${token}`);
    },

    /**
     * Login with email and password
     * POST /auth/login
     */
    async login(data: LoginDto): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(`${AUTH_BASE}/login`, data);
    },

    /**
     * Logout current user
     * DELETE /auth/logout
     */
    async logout(): Promise<MessageResponse> {
        return apiClient.delete<MessageResponse>(`${AUTH_BASE}/logout`);
    },

    /**
     * Change password for authenticated user
     * POST /auth/change-password
     */
    async changePassword(data: ChangePasswordDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/change-password`, data);
    },

    /**
     * Request password reset link
     * POST /auth/password/reset-link
     */
    async forgotPassword(data: ForgotPasswordDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/password/reset-link`, data);
    },

    /**
     * Validate reset code
     * POST /auth/validate-reset-code
     */
    async validateResetCode(data: ValidateResetCodeDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/validate-reset-code`, data);
    },

    /**
     * Reset password with code
     * POST /auth/password/reset-password
     */
    async resetPassword(data: ResetPasswordDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/password/reset-password`, data);
    },

    /**
     * Resend verification email
     * POST /auth/resend-verification
     */
    async resendVerification(data: ResendVerificationDto): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(`${AUTH_BASE}/resend-verification`, data);
    },

    /**
     * Get verification resend status
     * GET /auth/resend-verification/status/:email
     */
    async getVerificationStatus(email: string): Promise<VerificationStatusResponse> {
        return apiClient.get<VerificationStatusResponse>(`${AUTH_BASE}/resend-verification/status/${encodeURIComponent(email)}`);
    },
};
