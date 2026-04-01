import { useState, useEffect } from 'react';
import { Building2, Loader2, ShieldCheck, Factory, Globe, Plus, CheckCircle2, Save, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/features/auth/store/auth.store';
import { usersService } from '@/features/users/services/users.service';
import { attachmentsService } from '@/shared/services/attachments.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { FileCardUpload } from '@/shared/components/ui/file-card-upload';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';

export function SettingsPage() {
    const { detailedProfile, fetchProfile } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [newOrgName, setNewOrgName] = useState('');
    const [logoId, setLogoId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (!detailedProfile) {
            fetchProfile();
        }
    }, [detailedProfile, fetchProfile]);

    useEffect(() => {
        if (detailedProfile?.organization) {
            setOrgName(detailedProfile.organization.name || '');
            setLogoId(detailedProfile.organization.logoId || null);
        } else {
            setOrgName('');
            setLogoId(null);
        }
    }, [detailedProfile]);

    const handleCreateOrganization = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOrgName.trim()) {
            toast.error('Please enter an organization name');
            return;
        }

        setIsCreating(true);
        try {
            await usersService.createOrganization({ name: newOrgName.trim() });
            toast.success('Organization created successfully');
            setIsCreateModalOpen(false);
            await fetchProfile();
        } catch (err: any) {
            console.error('Create error:', err);
            toast.error(err?.message || 'Failed to create organization');
        } finally {
            setIsCreating(false);
        }
    };

    const handleSaveOrganization = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await usersService.updateOrganization({
                name: orgName,
                logoId: logoId,
            });
            await fetchProfile();
            toast.success('Organization settings updated successfully');
        } catch (err: any) {
            console.error('Update error:', err);
            toast.error(err?.message || 'Failed to update organization');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!detailedProfile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                    <p className="text-slate-500 text-sm animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    // STATE: No Organization (Check both nested object and flat ID)
    const hasOrganization = !!(detailedProfile.organization || detailedProfile.organizationId);

    if (!hasOrganization) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 py-12">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                        <Building2 className="h-10 w-10 text-cyan-400" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white">Setup Your Organization</h1>
                        <p className="text-slate-400 max-w-md mx-auto">To start managing your facility and production lines, you first need to create an organization profile.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    {[
                        { title: 'Identity', desc: 'Define your company name and branding.', icon: ShieldCheck },
                        { title: 'Global Layout', desc: 'Map out floors and workstations.', icon: Globe },
                        { title: 'Smart Tracking', desc: 'Monitor production in real-time.', icon: Factory },
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-3">
                            <feature.icon className="h-6 w-6 text-cyan-400" />
                            <h3 className="font-semibold text-white">{feature.title}</h3>
                            <p className="text-sm text-slate-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 pt-8">
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 h-12 text-lg shadow-xl shadow-cyan-500/20">
                                <Plus className="mr-2 h-5 w-5" />
                                Create My Organization
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                            <form onSubmit={handleCreateOrganization}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Initialize Identity</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Enter your company or facility name. You can manage logos and branding in the next step.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="createOrgName" className="text-slate-300">
                                            Organization Name
                                        </Label>
                                        <Input
                                            id="createOrgName"
                                            value={newOrgName}
                                            onChange={(e) => setNewOrgName(e.target.value)}
                                            placeholder="e.g. GRVT Manufacturing"
                                            className="bg-slate-950 border-slate-700 text-white h-12 text-lg transition-all focus:border-cyan-500"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={isCreating}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 text-lg font-bold shadow-lg shadow-cyan-600/20">
                                        {isCreating ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Creating...</span>
                                            </div>
                                        ) : (
                                            'Create and Link Organization'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="sm" onClick={() => fetchProfile()} className="text-slate-500 hover:text-white">
                        Already have an organization? Refresh Profile
                    </Button>
                </div>
            </div>
        );
    }

    // STATE: Organization Exists
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
                    <p className="text-slate-400">Manage your organization's legal identity, branding, and global rules.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Organization Active
                </div>
            </div>

            <div className="grid gap-8">
                {/* Organization Identity & Branding */}
                <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden shadow-xl">
                    <CardHeader className="border-b border-slate-700/50 bg-slate-900/40">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-400/10">
                                <Building2 className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Profile & Branding</CardTitle>
                                <CardDescription className="text-slate-400 text-xs">Identity settings visible across the platform.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSaveOrganization} className="space-y-12">
                            <div className="flex flex-col lg:flex-row gap-x-16 gap-y-10 items-start">
                                {/* Left Side: Logo (Shrink-0) */}
                                <FileCardUpload
                                    label="Corporate Logo"
                                    type="ORGANIZATION_LOGO"
                                    value={logoId}
                                    previewUrl={detailedProfile.organization?.logoUrl}
                                    onUploadSuccess={setLogoId}
                                    onRemove={() => setLogoId(null)}
                                    size="w-40 h-40"
                                    placeholderIcon={<Factory className="h-14 w-14" />}
                                    description="Recommended: 512x512px. SVG or PNG."
                                />

                                {/* Right Side: Identity Controls (Flex-1) */}
                                <div className="flex-1 w-full flex flex-col justify-between self-stretch py-2">
                                    <div className="space-y-4">
                                        <Label htmlFor="orgName" className="text-slate-300 font-semibold flex items-center justify-between">
                                            <span>Organization Name</span>
                                            <span className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">
                                                {detailedProfile.organization?.name ? 'Verified' : 'Required'}
                                            </span>
                                        </Label>
                                        <div className="relative group/input max-w-xl">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-hover/input:text-cyan-400" />
                                            <Input
                                                id="orgName"
                                                value={orgName}
                                                onChange={(e) => setOrgName(e.target.value)}
                                                className="bg-slate-950 border-slate-700 text-white focus:border-cyan-500 h-14 pl-12 text-lg font-medium transition-all"
                                                placeholder="Enter Company Name"
                                                required
                                            />
                                        </div>
                                        {!detailedProfile.organization?.name && (
                                            <p className="text-xs text-amber-500 italic pl-1 flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                Finish setting up your identity to unlock all features.
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Header: Save Button moved here */}
                                    <div className="pt-8 lg:pt-0 flex items-center gap-6">
                                        <Button
                                            type="submit"
                                            disabled={isUpdating || !orgName.trim()}
                                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 h-12 shadow-lg shadow-cyan-500/20 font-bold tracking-tight transition-all active:scale-95 disabled:opacity-50">
                                            {isUpdating ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Syncing Identity...</span>
                                                </div>
                                            ) : (
                                                'Save Platform Branding'
                                            )}
                                        </Button>
                                        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                            <Globe className="h-3.5 w-3.5 text-blue-400/50" />
                                            Live on Web
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Secondary Configs (Coming Soon) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40 grayscale pointer-events-none">
                    <Card className="bg-slate-800/10 border-slate-700/30 border-dashed">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-base">Global Work Hours</CardTitle>
                        </CardHeader>
                        <CardContent className="h-24 flex items-center justify-center">
                            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest italic">Upcoming Feature</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/10 border-slate-700/30 border-dashed">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-base">Compliance & Security</CardTitle>
                        </CardHeader>
                        <CardContent className="h-24 flex items-center justify-center">
                            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest italic">Upcoming Feature</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
