import { useState } from 'react';
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
    factoryName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    factoryName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export function SignupPage() {
    const navigate = useNavigate();
    const { signup, isLoading, error, clearError } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        factoryName: '',
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
            { met: password.length >= 8, label: 'At least 8 characters' },
            { met: /[A-Z]/.test(password), label: 'One uppercase letter' },
            { met: /[a-z]/.test(password), label: 'One lowercase letter' },
            { met: /\d/.test(password), label: 'One number' },
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
            errors.firstName = 'First name is required';
        } else if (!isValidName(formData.firstName)) {
            errors.firstName = 'Please enter a valid name';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        } else if (!isValidName(formData.lastName)) {
            errors.lastName = 'Please enter a valid name';
        }

        if (!formData.factoryName.trim()) {
            errors.factoryName = 'Factory/Company name is required';
        } else if (formData.factoryName.length < 2) {
            errors.factoryName = 'Factory name must be at least 2 characters';
        } else if (formData.factoryName.length > 100) {
            errors.factoryName = 'Factory name must be less than 100 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (!isValidPassword(formData.password)) {
            errors.password = 'Password does not meet requirements';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
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
                factoryName: formData.factoryName.trim(),
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                sendMail: true,
            });
            navigate('/dashboard');
        } catch {
            // Error is handled by the store
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
                    <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-slate-400">Get started with GRVT MES Platform</p>
                </div>

                {/* Signup Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Global Error */}
                        {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">{error}</div>}

                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* First Name */}
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-slate-300">
                                    First Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
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
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => updateField('lastName', e.target.value)}
                                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                                {validationErrors.lastName && <p className="text-red-400 text-sm">{validationErrors.lastName}</p>}
                            </div>
                        </div>

                        {/* Factory Name */}
                        <div className="space-y-2">
                            <Label htmlFor="factoryName" className="text-slate-300">
                                Factory / Company Name
                            </Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="factoryName"
                                    type="text"
                                    placeholder="Acme Manufacturing Inc."
                                    value={formData.factoryName}
                                    onChange={(e) => updateField('factoryName', e.target.value)}
                                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                            {validationErrors.factoryName && <p className="text-red-400 text-sm">{validationErrors.factoryName}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@company.com"
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
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
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
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
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
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-700" />
                        <span className="text-slate-500 text-sm">or</span>
                        <div className="flex-1 h-px bg-slate-700" />
                    </div>

                    {/* Sign In Link */}
                    <p className="text-center text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-slate-400 hover:text-slate-300">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-slate-400 hover:text-slate-300">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
