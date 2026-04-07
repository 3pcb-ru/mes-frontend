import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building2, Loader2, ArrowRight, Check, X } from 'lucide-react';
import { useAuth } from '../store/auth.store';
import { isValidEmail, isValidPassword, isValidName, getPasswordRequirements } from '../types/auth.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Logo } from '@/shared/components/logo';

interface FormData {
    firstName: string;
    lastName: string;
    organizationName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    organizationName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export function SignupPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signup, isLoading, error, clearError } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        organizationName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const passwordRequirements = getPasswordRequirements();

    const getPasswordStrength = (password: string): { met: boolean; label: string }[] => {
        return [
            { met: password.length >= 8, label: t('auth.signup.password_requirements.min_length') },
            { met: /[A-Z]/.test(password), label: t('auth.signup.password_requirements.uppercase') },
            { met: /[a-z]/.test(password), label: t('auth.signup.password_requirements.lowercase') },
            { met: /\d/.test(password), label: t('auth.signup.password_requirements.number') },
        ];
    };

    const updateField = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = t('auth.signup.errors.first_name_required');
        } else if (!isValidName(formData.firstName)) {
            errors.firstName = t('auth.signup.errors.first_name_invalid');
        }

        if (!formData.lastName.trim()) {
            errors.lastName = t('auth.signup.errors.last_name_required');
        } else if (!isValidName(formData.lastName)) {
            errors.lastName = t('auth.signup.errors.last_name_invalid');
        }

        if (!formData.organizationName.trim()) {
            errors.organizationName = t('auth.signup.errors.org_name_required');
        } else if (formData.organizationName.length < 2) {
            errors.organizationName = t('auth.signup.errors.org_name_min');
        } else if (formData.organizationName.length > 100) {
            errors.organizationName = t('auth.signup.errors.org_name_max');
        }

        if (!formData.email.trim()) {
            errors.email = t('auth.signup.errors.email_required');
        } else if (!isValidEmail(formData.email)) {
            errors.email = t('auth.signup.errors.email_invalid');
        }

        if (!formData.password) {
            errors.password = t('auth.signup.errors.password_required');
        } else if (!isValidPassword(formData.password)) {
            errors.password = t('auth.signup.errors.password_requirements');
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = t('auth.signup.errors.confirm_password_required');
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = t('auth.signup.errors.passwords_dont_match');
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) return;

        try {
            await signup({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                organizationName: formData.organizationName.trim(),
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                sendMail: true,
            });
            navigate('/dashboard');
        } catch (err) {
            // Map backend validation errors (422) into form fields when present
            const apiErr = err as any;
            if (apiErr?.statusCode === 422 && apiErr.body?.errors) {
                const fieldErrors: Array<any> = apiErr.body.errors;
                const mapped: ValidationErrors = {};
                for (const e of fieldErrors) {
                    const field = e.path?.[0] as keyof ValidationErrors | undefined;
                    if (field) mapped[field] = e.message || 'Invalid value';
                }
                setValidationErrors((prev) => ({ ...prev, ...mapped }));
                return;
            }

            // Fallback: let store/UI show generic error
        }
    };

    const strength = getPasswordStrength(formData.password);

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

            <div className="relative z-10 w-full max-w-lg my-8">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <Logo className="h-10 w-10" />
                        <span className="text-2xl font-bold text-white">GRVT MES</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('auth.signup.title')}</h1>
                    <p className="text-slate-400">{t('auth.signup.subtitle')}</p>
                </div>

                {/* Signup Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Global Error */}
                        {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">{error}</div>}

                        {/* Name Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-slate-300">
                                    {t('auth.signup.first_name_label')}
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder={t('auth.signup.first_name_placeholder')}
                                        value={formData.firstName}
                                        onChange={(e) => updateField('firstName', e.target.value)}
                                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                    />
                                </div>
                                {validationErrors.firstName && <p className="text-red-400 text-sm">{validationErrors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-slate-300">
                                    {t('auth.signup.last_name_label')}
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder={t('auth.signup.last_name_placeholder')}
                                    value={formData.lastName}
                                    onChange={(e) => updateField('lastName', e.target.value)}
                                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                                {validationErrors.lastName && <p className="text-red-400 text-sm">{validationErrors.lastName}</p>}
                            </div>
                        </div>

                        {/* Organization Name */}
                        <div className="space-y-2">
                            <Label htmlFor="organizationName" className="text-slate-300">
                                {t('auth.signup.org_name_label')}
                            </Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="organizationName"
                                    type="text"
                                    placeholder={t('auth.signup.org_name_placeholder')}
                                    value={formData.organizationName}
                                    onChange={(e) => updateField('organizationName', e.target.value)}
                                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                            {validationErrors.organizationName && <p className="text-red-400 text-sm">{validationErrors.organizationName}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">
                                {t('auth.signup.email_label')}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('auth.signup.email_placeholder')}
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                            {validationErrors.email && <p className="text-red-400 text-sm">{validationErrors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">
                                {t('auth.signup.password_label')}
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('auth.signup.password_placeholder')}
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
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
                                {t('auth.signup.confirm_password_label')}
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder={t('auth.signup.confirm_password_placeholder')}
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                                    className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors">
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && <p className="text-red-400 text-sm">{validationErrors.confirmPassword}</p>}
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
                                    {t('auth.signup.submitting')}
                                </>
                            ) : (
                                <>
                                    {t('auth.signup.submit')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-700" />
                        <span className="text-slate-500 text-sm">{t('auth.signup.divider')}</span>
                        <div className="flex-1 h-px bg-slate-700" />
                    </div>

                    {/* Sign In Link */}
                    <p className="text-center text-slate-400">
                        {t('auth.signup.have_account')}{' '}
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            {t('auth.signup.sign_in')}
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    {t('auth.signup.footer_agree')}{' '}
                    <Link to="/terms" className="text-slate-400 hover:text-slate-300">
                        {t('nav.terms_of_service')}
                    </Link>{' '}
                    {t('auth.signup.footer_and')}{' '}
                    <Link to="/privacy" className="text-slate-400 hover:text-slate-300">
                        {t('nav.privacy_policy')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
