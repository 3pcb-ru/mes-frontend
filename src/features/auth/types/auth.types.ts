// ============================================
// Auth DTOs - Matching Backend Validation
// ============================================

// Regex patterns for validation
export const VALIDATION_PATTERNS = {
    // At least 1 uppercase, 1 lowercase, 1 number
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    // Exactly 6 numeric digits
    RESET_CODE: /^[0-9]{6}$/,
    // 7-20 digits, optional +, spaces, hyphens, parentheses
    PHONE: /^\+?[0-9\s\-()]{7,20}$/,
    // Latin letters, spaces, apostrophes, hyphens
    NAME: /^[\p{Script=Latin}\p{M}\p{Pd}\p{Zs}''.·.]+$/u,
    // Exactly 2 uppercase letters
    COUNTRY_CODE: /^[A-Z]{2}$/,
} as const;

import type {
    User as UserType,
    Role as RoleType,
    Organization as OrganizationType,
    LoginDto as LoginDtoType,
    SignupDto as SignupDtoType,
    LoginResponse as LoginResponseType,
    RefreshResponse as RefreshResponseType,
    ChangePasswordDto as ChangePasswordDtoType,
    ForgotPasswordDto as ForgotPasswordDtoType,
    ResetPasswordDto as ResetPasswordDtoType,
    MessageResponse as MessageResponseType,
} from './auth.schema';

// ============================================
// Re-exported Types from Zod Schema
// ============================================

export type User = UserType;
export type Role = RoleType;
export type Organization = OrganizationType;
export type LoginDto = LoginDtoType;
export type SignupDto = SignupDtoType;
export type LoginResponse = LoginResponseType;
export type RefreshTokenResponse = RefreshResponseType;
export type ChangePasswordDto = ChangePasswordDtoType;
export type ForgotPasswordDto = ForgotPasswordDtoType;
export type ResetPasswordDto = ResetPasswordDtoType;
export type MessageResponse = MessageResponseType;

// ============================================
// Auth DTOs & Support Types
// ============================================

export interface VerificationStatusResponse {
    canResend: boolean;
    cooldownRemaining?: number; // seconds
}

export interface SignupResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    message: string;
}

export interface LogoutResponse {
    message: string;
}

// ============================================
// Validation Helper Functions
// ============================================

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
    return password.length >= 8 && password.length <= 50 && VALIDATION_PATTERNS.PASSWORD.test(password);
}

export function isValidResetCode(code: string): boolean {
    return VALIDATION_PATTERNS.RESET_CODE.test(code);
}

export function isValidPhone(phone: string): boolean {
    return VALIDATION_PATTERNS.PHONE.test(phone);
}

export function isValidName(name: string): boolean {
    return VALIDATION_PATTERNS.NAME.test(name);
}

export function getPasswordRequirements(): string[] {
    return ['At least 8 characters', 'At least one uppercase letter', 'At least one lowercase letter', 'At least one number'];
}
