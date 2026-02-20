import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../services/auth.service';
import { isValidEmail } from '../types/auth.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Logo } from '@/shared/components/logo';
import type { ApiError } from '@/shared/lib/api-client';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setValidationError(null);

        if (!email.trim()) {
            setValidationError('Email is required');
            return;
        }

        if (!isValidEmail(email)) {
            setValidationError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword({ email: email.toLowerCase().trim() });
            setIsSuccess(true);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <Logo className="h-10 w-10" />
                        <span className="text-2xl font-bold text-white">GRVT MES</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
                    <p className="text-slate-400">No worries, we'll send you a reset code via email</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
                            <p className="text-slate-400 mb-6">
                                We've sent a 6-digit verification code to <span className="text-cyan-400">{email}</span>
                            </p>
                            <Link to="/reset-password" state={{ email }}>
                                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                    Enter verification code
                                </Button>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    setEmail('');
                                }}
                                className="mt-4 text-slate-400 hover:text-slate-300 text-sm transition-colors">
                                Didn't receive the email? Try again
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error */}
                            {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">{error}</div>}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setValidationError(null);
                                        }}
                                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                    />
                                </div>
                                {validationError && <p className="text-red-400 text-sm">{validationError}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Sending code...
                                    </>
                                ) : (
                                    'Send reset code'
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
