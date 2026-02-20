import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Loader2, ArrowLeft, CheckCircle, Check, X } from 'lucide-react';
import { authService } from '../services/auth.service';
import { isValidEmail, isValidPassword, isValidResetCode } from '../types/auth.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { Logo } from '@/shared/components/logo';
import type { ApiError } from '@/shared/lib/api-client';

type Step = 'code' | 'password';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = (location.state as { email?: string })?.email || '';

    const [step, setStep] = useState<Step>('code');
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        code?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const getPasswordStrength = (password: string): { met: boolean; label: string }[] => {
        return [
            { met: password.length >= 8, label: 'At least 8 characters' },
            { met: /[A-Z]/.test(password), label: 'One uppercase letter' },
            { met: /[a-z]/.test(password), label: 'One lowercase letter' },
            { met: /\d/.test(password), label: 'One number' },
        ];
    };

    const handleValidateCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const errors: typeof validationErrors = {};

        if (!email.trim() || !isValidEmail(email)) {
            errors.email = 'Please enter a valid email';
        }
        if (!code || !isValidResetCode(code)) {
            errors.code = 'Please enter a valid 6-digit code';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setIsLoading(true);
        try {
            await authService.validateResetCode({
                email: email.toLowerCase().trim(),
                code,
            });
            setStep('password');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Invalid code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const errors: typeof validationErrors = {};

        if (!isValidPassword(newPassword)) {
            errors.password = 'Password does not meet requirements';
        }
        if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({
                email: email.toLowerCase().trim(),
                code,
                newPassword,
            });
            setIsSuccess(true);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const strength = getPasswordStrength(newPassword);

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-md text-center">
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Password reset successful!</h2>
                        <p className="text-slate-400 mb-6">Your password has been reset. You can now sign in with your new password.</p>
                        <Link to="/login">
                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">Sign in</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <Logo className="h-10 w-10" />
                        <span className="text-2xl font-bold text-white">GRVT MES</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">{step === 'code' ? 'Enter verification code' : 'Create new password'}</h1>
                    <p className="text-slate-400">
                        {step === 'code' ? 'Enter the 6-digit code we sent to your email' : 'Your new password must be different from previous passwords'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    {step === 'code' ? (
                        <form onSubmit={handleValidateCode} className="space-y-6">
                            {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">{error}</div>}

                            {/* Email (if not pre-filled) */}
                            {!initialEmail && (
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setValidationErrors({});
                                        }}
                                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                                    />
                                    {validationErrors.email && <p className="text-red-400 text-sm">{validationErrors.email}</p>}
                                </div>
                            )}

                            {/* OTP Input */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Verification Code</Label>
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={code}
                                        onChange={(value) => {
                                            setCode(value);
                                            setValidationErrors({});
                                        }}>
                                        <InputOTPGroup>
                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                <InputOTPSlot key={i} index={i} className="bg-slate-900/50 border-slate-600 text-white text-lg w-12 h-14" />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                {validationErrors.code && <p className="text-red-400 text-sm text-center">{validationErrors.code}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || code.length !== 6}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify code'
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">{error}</div>}

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-slate-300">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setValidationErrors({});
                                        }}
                                        className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {newPassword && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {strength.map((req, idx) => (
                                            <div key={idx} className={`flex items-center gap-1.5 text-xs ${req.met ? 'text-green-400' : 'text-slate-500'}`}>
                                                {req.met ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                {req.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {validationErrors.password && <p className="text-red-400 text-sm">{validationErrors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-300">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setValidationErrors({});
                                        }}
                                        className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {validationErrors.confirmPassword && <p className="text-red-400 text-sm">{validationErrors.confirmPassword}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
