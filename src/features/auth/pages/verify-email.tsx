import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { authService } from '../services/auth.service';
import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/logo';
import type { ApiError } from '@/shared/lib/api-client';

type VerificationState = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
    const { t } = useTranslation();
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [state, setState] = useState<VerificationState>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setState('error');
                setError(t('auth.verify_email.error.description'));
                return;
            }

            try {
                await authService.verifyEmail(token);
                setState('success');
            } catch (err) {
                const apiError = err as ApiError;
                setState('error');
                setError(apiError.message || t('auth.verify_email.error.description'));
            }
        };

        verifyEmail();
    }, [token]);

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
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <Logo className="h-10 w-10" />
                        <span className="text-2xl font-bold text-white">GRVT MES</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center">
                    {state === 'loading' && (
                        <>
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">{t('auth.verify_email.verifying.title')}</h2>
                            <p className="text-slate-400">{t('auth.verify_email.verifying.description')}</p>
                        </>
                    )}

                    {state === 'success' && (
                        <>
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">{t('auth.verify_email.success.title')}</h2>
                            <p className="text-slate-400 mb-6">{t('auth.verify_email.success.description')}</p>
                            <Link to="/login">
                                <Button className="w-full">{t('auth.verify_email.success.button')}</Button>
                            </Link>
                        </>
                    )}

                    {state === 'error' && (
                        <>
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle className="h-8 w-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">{t('auth.verify_email.error.title')}</h2>
                            <p className="text-slate-400 mb-6">{error || t('auth.verify_email.error.description')}</p>
                            <div className="space-y-3">
                                <Link to="/login">
                                    <Button className="w-full">{t('auth.verify_email.error.button')}</Button>
                                </Link>
                                <p className="text-slate-500 text-sm">{t('auth.verify_email.error.new_link_hint')}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
