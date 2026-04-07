import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SessionExpiredAlert } from '@/shared/components/session-expired-alert';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../store/auth.store';
import { isValidEmail } from '../types/auth.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Logo } from '@/shared/components/logo';
import { useFormValidation } from '@/shared/hooks/use-form-validation';
import { FormError } from '@/shared/components/ui/form-error';

export function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, clearError: authClearError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { validationErrors, handleApiError, clearError, resetErrors } = useFormValidation();

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!email.trim()) {
            errors.email = t('auth.login.errors.email_required');
        } else if (!isValidEmail(email)) {
            errors.email = t('auth.login.errors.email_invalid');
        }

        if (!password) {
            errors.password = t('auth.login.errors.password_required');
        }

        if (Object.keys(errors).length > 0) {
            handleApiError({ statusCode: 422, validationErrors: errors });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        authClearError();
        resetErrors();

        if (!validateForm()) return;

        try {
            await login({ email: email.toLowerCase().trim(), password });
            
            // Redirect to previous page (if user was redirected from a protected route)
            // or to dashboard if this is first login
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from);
        } catch (err: any) {
            // Try to map server validation errors to fields, else let the store handle the display
            handleApiError(err);
        }
    };

    // Show session expired alert if redirected due to token expiration
    const [showSessionExpired, setShowSessionExpired] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('session_expired')) {
            return true;
        }
        return false;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
            {showSessionExpired && <SessionExpiredAlert />}
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
                    <h1 className="text-3xl font-bold text-white mb-2">{t('auth.login.title')}</h1>
                    <p className="text-slate-400">{t('auth.login.subtitle')}</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Global Error */}
                        {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">{error}</div>}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">
                                {t('auth.login.email_label')}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('auth.login.email_placeholder')}
                                    value={email}
                                    aria-invalid={!!validationErrors.email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearError('email');
                                    }}
                                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                            <FormError message={validationErrors.email} />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-300">
                                    {t('auth.login.password_label')}
                                </Label>
                                <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                    {t('auth.login.forgot_password')}
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('auth.login.password_placeholder')}
                                    value={password}
                                    aria-invalid={!!validationErrors.password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        clearError('password');
                                    }}
                                    className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <FormError message={validationErrors.password} />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('auth.login.submitting')}
                                </>
                            ) : (
                                <>
                                    {t('auth.login.submit')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-700" />
                        <span className="text-slate-500 text-sm">{t('auth.login.divider')}</span>
                        <div className="flex-1 h-px bg-slate-700" />
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-slate-400">
                        {t('auth.login.no_account')}{' '}
                        <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            {t('auth.login.create_account')}
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    {t('auth.login.footer_agree')}{' '}
                    <Link to="/terms" className="text-slate-400 hover:text-slate-300">
                        {t('nav.terms_of_service', 'Terms of Service')}
                    </Link>{' '}
                    {t('auth.login.footer_and')}{' '}
                    <Link to="/privacy" className="text-slate-400 hover:text-slate-300">
                        {t('nav.privacy_policy', 'Privacy Policy')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
