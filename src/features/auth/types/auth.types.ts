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

// ============================================
// User Types
// ============================================

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    factoryName?: string;
    phone?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// Authentication DTOs
// ============================================

export interface SignupDto {
    firstName: string; // NAME_PATTERN regex
    lastName: string; // NAME_PATTERN regex
    factoryName: string; // Min: 2, Max: 100 chars
    password: string; // Min: 8, Max: 50, must contain: 1 uppercase, 1 lowercase, 1 number
    email: string; // Valid email, trimmed & lowercased
    sendMail?: boolean; // Optional
}

export interface LoginDto {
    email: string; // Valid email, trimmed & lowercased
    password: string; // Min: 1 char (required)
}

export interface ChangePasswordDto {
    oldPassword: string; // Password pattern
    newPassword: string; // Min: 8, Max: 50, password pattern
}

export interface ForgotPasswordDto {
    email: string; // Valid email, trimmed & lowercased
}

export interface ValidateResetCodeDto {
    email: string; // Valid email
    code: string; // 6 numeric digits only
}

export interface ResetPasswordDto {
    email: string; // Valid email
    code: string; // 6 numeric digits
    newPassword: string; // Min: 8, Max: 50, password pattern
}

export interface ResendVerificationDto {
    email: string; // Valid email
}

// ============================================
// API Response Types
// ============================================

export interface LoginResponse {
    accessToken: string;
    user: User;
    settings?: Record<string, any>;
}

export interface SignupResponse {
    accessToken: string;
    email: string;
    message: string;
}

export interface AuthResponse extends LoginResponse {}

export interface MessageResponse {
    message: string;
}

export interface VerificationStatusResponse {
    canResend: boolean;
    cooldownRemaining?: number; // seconds
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
