import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Shield, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/store/auth.store';
import { Logo } from '@/shared/components/logo';
import { usersService } from '@/features/users/services/users.service';
import { FILE_TYPE } from '@/shared/services/attachments.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { FileCardUpload } from '@/shared/components/ui/file-card-upload';

export function ProfilePage() {
    const { t } = useTranslation();
    const { user, detailedProfile, fetchProfile, setDetailedProfile } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatarId, setAvatarId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    useEffect(() => {
        if (!detailedProfile) {
            fetchProfile();
        }
    }, [detailedProfile, fetchProfile]);

    useEffect(() => {
        if (detailedProfile) {
            setFormData({
                firstName: detailedProfile.firstName || '',
                lastName: detailedProfile.lastName || '',
                email: detailedProfile.email || '',
            });
            setAvatarId(detailedProfile.avatarId || null);
        } else if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
        }
    }, [detailedProfile, user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = detailedProfile?.id || user?.id;
        if (!userId) return;

        setIsUpdating(true);
        try {
            await usersService.updateProfile(userId, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                avatarId: avatarId || undefined,
            });
            await fetchProfile();
            toast.success(t('dashboard.profile.messages.update_success'));
        } catch (err: any) {
            toast.error(err?.message || t('dashboard.profile.messages.update_failed'));
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.profile.title')}</h1>
                    <p className="text-slate-400">{t('dashboard.profile.description')}</p>
                </div>
                {detailedProfile?.isVerified && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        {t('dashboard.profile.verified')}
                    </div>
                )}
            </div>

            <div className="grid gap-8">
                {/* Personal Information */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-cyan-400" />
                            {t('dashboard.profile.personal_info.title')}
                        </CardTitle>
                        <CardDescription className="text-slate-400">{t('dashboard.profile.personal_info.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="flex flex-col lg:flex-row gap-12 items-start">
                                {/* Avatar Section */}
                                <FileCardUpload
                                    label={t('dashboard.profile.personal_info.avatar_label')}
                                    type={FILE_TYPE.USER_AVATAR}
                                    value={avatarId}
                                    previewUrl={detailedProfile?.avatarUrl}
                                    onUploadSuccess={setAvatarId}
                                    onRemove={() => setAvatarId(null)}
                                    onPreviewChange={(url) => {
                                        if (detailedProfile) {
                                            setDetailedProfile({ ...detailedProfile, avatarUrl: url || undefined });
                                        }
                                    }}
                                    size="size-32"
                                    placeholderIcon={<Logo className="h-12 w-12 text-slate-500" />}
                                    description={t('dashboard.profile.personal_info.avatar_hint')}
                                />

                                <div className="flex-1 space-y-6 w-full lg:max-w-xl">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-slate-300">
                                                {t('dashboard.profile.personal_info.first_name')}
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="bg-slate-900 border-slate-700 text-white focus:border-cyan-500"
                                                placeholder={t('dashboard.profile.personal_info.first_name_placeholder')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-slate-300">
                                                {t('dashboard.profile.personal_info.last_name')}
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="bg-slate-900 border-slate-700 text-white focus:border-cyan-500"
                                                placeholder={t('dashboard.profile.personal_info.last_name_placeholder')}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-300">
                                            {t('dashboard.profile.personal_info.email')}
                                        </Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <div className="pl-9 py-2 bg-slate-900/40 border border-slate-700/50 rounded-md text-slate-400 text-sm flex items-center h-10 select-none">
                                                {formData.email || t('dashboard.profile.personal_info.email_empty')}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic">{t('dashboard.profile.personal_info.email_hint')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-700/50">
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-8"
                                >
                                    {isUpdating ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>{t('dashboard.profile.saving')}</span>
                                        </div>
                                    ) : (
                                        t('dashboard.profile.save_changes')
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Details */}
                {(detailedProfile?.role || detailedProfile?.organization) && (
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-400" />
                                {t('dashboard.profile.account_details.title')}
                            </CardTitle>
                            <CardDescription className="text-slate-400">{t('dashboard.profile.account_details.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {detailedProfile.role && (
                                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{detailedProfile.role.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{t('dashboard.profile.account_details.permissions', { count: detailedProfile.role.permissions?.length || 0 })}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">{t('dashboard.profile.account_details.active_status')}</span>
                                </div>
                            )}

                            {detailedProfile.organization && (
                                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{detailedProfile.organization.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{detailedProfile.organization.location || t('dashboard.profile.account_details.assigned_org')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
