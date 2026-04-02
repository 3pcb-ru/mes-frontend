import { useState, useEffect } from 'react';
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
            toast.success('Profile updated successfully');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                    <p className="text-slate-400">Manage your personal information and account preferences.</p>
                </div>
                {detailedProfile?.isVerified && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified Account
                    </div>
                )}
            </div>

            <div className="grid gap-8">
                {/* Personal Information */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-cyan-400" />
                            Personal Information
                        </CardTitle>
                        <CardDescription className="text-slate-400">Update your basic profile information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="flex flex-col lg:flex-row gap-12 items-start">
                                {/* Avatar Section */}
                                <FileCardUpload
                                    label="Profile Picture"
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
                                    size="w-32 h-32"
                                    placeholderIcon={<Logo className="h-12 w-12 text-slate-500" />}
                                    description="Recommended: 256x256px. PNG or JPG."
                                />

                                <div className="flex-1 space-y-6 w-full lg:max-w-xl">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-slate-300">
                                                First Name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="bg-slate-900 border-slate-700 text-white focus:border-cyan-500"
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-slate-300">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="bg-slate-900 border-slate-700 text-white focus:border-cyan-500"
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-300">
                                            Email Address
                                        </Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <div className="pl-9 py-2 bg-slate-900/40 border border-slate-700/50 rounded-md text-slate-400 text-sm flex items-center h-10 select-none">
                                                {formData.email || 'No email provided'}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic">Email is used for account identification and cannot be changed.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-700/50">
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 shadow-lg shadow-cyan-500/20">
                                    {isUpdating ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        'Save Changes'
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
                                Account Role & Organization
                            </CardTitle>
                            <CardDescription className="text-slate-400">View your assigned role and organization information.</CardDescription>
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
                                            <p className="text-xs text-slate-500 mt-0.5">{detailedProfile.role.permissions?.length || 0} active permissions</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Active</span>
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
                                            <p className="text-xs text-slate-500 mt-0.5">{detailedProfile.organization.location || 'Assigned Organization'}</p>
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
