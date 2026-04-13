import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, User, Shield, Loader2, AlertCircle } from 'lucide-react';
import { rolesService } from '../services/roles.service';
import { usersService } from '../services/users.service';
import { type RoleWithPermissions } from '../types/users.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useFormValidation } from '@/shared/hooks/use-form-validation';
import { FormError } from '@/shared/components/ui/form-error';
import { toast } from 'sonner';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteUserModal({ isOpen, onClose, onSuccess }: InviteUserModalProps) {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');

    const { validationErrors, handleApiError, clearError, resetErrors } = useFormValidation();

    useEffect(() => {
        if (isOpen) {
            const fetchRoles = async () => {
                setIsLoadingRoles(true);
                try {
                    const data = await rolesService.lookupRoles();
                    setRoles(data);
                } catch (err) {
                    console.error('Failed to fetch roles:', err);
                    toast.error(t('dashboard.users.invite.errors.fetch_roles_failed', 'Failed to load roles'));
                } finally {
                    setIsLoadingRoles(false);
                }
            };
            fetchRoles();
        } else {
            // Reset state on close
            setFirstName('');
            setLastName('');
            setEmail('');
            setRoleId('');
            resetErrors();
        }
    }, [isOpen, t, resetErrors]);

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!email.trim()) errors.email = t('auth.login.errors.email_required');
        if (!firstName.trim()) errors.firstName = t('dashboard.users.invite.errors.first_name_required', 'First name is required');
        if (!lastName.trim()) errors.lastName = t('dashboard.users.invite.errors.last_name_required', 'Last name is required');
        if (!roleId) errors.roleId = t('dashboard.users.invite.errors.role_required', 'Please select a role');

        if (Object.keys(errors).length > 0) {
            handleApiError({ statusCode: 422, validationErrors: errors });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        resetErrors();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await usersService.inviteUser({
                email: email.toLowerCase().trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                roleId
            });
            toast.success(t('dashboard.users.invite.success', 'Invitation sent successfully'));
            onSuccess();
            onClose();
        } catch (err: any) {
            handleApiError(err);
            if (err.statusCode !== 422) {
                toast.error(err.message || t('dashboard.users.invite.errors.failed', 'Failed to send invitation'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="h-5 w-5 text-cyan-400" />
                        {t('dashboard.users.invite.title', 'Invite New User')}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {t('dashboard.users.invite.description', 'Send an email invitation to a new team member.')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-slate-300">{t('dashboard.users.invite.first_name', 'First Name')}</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
                                placeholder="Jane"
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500"
                            />
                            <FormError message={validationErrors.firstName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-slate-300">{t('dashboard.users.invite.last_name', 'Last Name')}</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
                                placeholder="Doe"
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500"
                            />
                            <FormError message={validationErrors.lastName} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">{t('dashboard.users.invite.email', 'Email Address')}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                                placeholder="jane.doe@company.com"
                                className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500"
                            />
                        </div>
                        <FormError message={validationErrors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-slate-300">{t('dashboard.users.invite.role', 'Assign Role')}</Label>
                        <Select value={roleId} onValueChange={(value) => { setRoleId(value); clearError('roleId'); }}>
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white focus:border-cyan-500">
                                <SelectValue placeholder={t('dashboard.users.invite.role_placeholder', 'Select a role')} />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                {isLoadingRoles ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                                    </div>
                                ) : (
                                    roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{role.name}</span>
                                                {role.description && <span className="text-xs text-slate-500">{role.description}</span>}
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <FormError message={validationErrors.roleId} />
                    </div>

                    <div className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-3 flex items-start gap-3 mt-6">
                        <Shield className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {t('dashboard.users.invite.hint', 'The user will receive an invitation email with a link to set their password and activate their account.')}
                        </p>
                    </div>

                    <DialogFooter className="mt-8">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-white hover:bg-slate-800">
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/20">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {t('dashboard.users.invite.submit', 'Send Invitation')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
