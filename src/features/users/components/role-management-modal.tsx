import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Loader2, Save } from 'lucide-react';
import { rolesService } from '../services/roles.service';
import { type RoleWithPermissions } from '../types/users.types';
import { Permissions, PermissionDescriptions } from '@/shared/constants/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/ui/badge';
import { ApiError } from '@/shared/lib/api-client';

interface RoleManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role?: RoleWithPermissions | null; // If provided, we are editing
}

export function RoleManagementModal({ isOpen, onClose, onSuccess, role }: RoleManagementModalProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!role;

    useEffect(() => {
        if (isOpen) {
            if (role) {
                setName(role.name);
                setDescription(role.description || '');
                setSelectedPermissions(role?.permissions?.map((p) => p.name) || []);
            } else {
                setName('');
                setDescription('');
                setSelectedPermissions([]);
            }
        }
    }, [isOpen, role]);

    const handleTogglePermission = (permissionId: string) => {
        setSelectedPermissions((prev) => (prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]));
    };

    const isModuleAllSelected = (category: keyof typeof Permissions) => {
        const modulePermissions = Object.values(Permissions[category]) as string[];
        return modulePermissions.every((slug) => selectedPermissions.includes(slug));
    };

    const handleToggleModule = (category: keyof typeof Permissions) => {
        const modulePermissions = Object.values(Permissions[category]) as string[];
        const allSelected = isModuleAllSelected(category);

        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((slug) => !modulePermissions.includes(slug)));
        } else {
            setSelectedPermissions((prev) => {
                const newOnes = modulePermissions.filter((slug) => !prev.includes(slug));
                return [...prev, ...newOnes];
            });
        }
    };

    const getModuleSelectedCount = (category: keyof typeof Permissions) => {
        const modulePermissions = Object.values(Permissions[category]) as string[];
        return modulePermissions.filter((slug) => selectedPermissions.includes(slug)).length;
    };

    const handleToggleCategory = (categoryKeys: string[]) => {
        // ... (skipping for now)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error(t('dashboard.roles.errors.name_required', 'Role name is required'));
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error(t('dashboard.roles.errors.no_permissions', 'Select at least one permission'));
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditing) {
                // Update logic
                await rolesService.updateRoleDetails(role!.id, { name, description });
                await rolesService.updateRolePermissions(role!.id, { permissionIds: selectedPermissions });
                toast.success(t('dashboard.roles.update_success', 'Role updated successfully'));
            } else {
                // Create logic
                await rolesService.createRole({
                    name,
                    description,
                    permissionIds: selectedPermissions,
                });
                toast.success(t('dashboard.roles.create_success', 'Role created successfully'));
            }
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const apiError = err as ApiError;
            console.error('Failed to save role:', apiError);
            toast.error(apiError.message || t('dashboard.roles.errors.failed', 'Failed to save role'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Group permissions by category for the UI
    const categories = Object.keys(Permissions) as Array<keyof typeof Permissions>;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-800 text-white p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Shield className="h-5 w-5 text-cyan-400" />
                        {isEditing ? t('dashboard.roles.edit_title', 'Edit Role') : t('dashboard.roles.create_title', 'Create New Role')}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {t('dashboard.roles.description', 'Define roles and assign specific permissions for your team members.')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 pt-4 space-y-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="roleName" className="text-slate-300">
                                    {t('dashboard.roles.name', 'Role Name')}
                                </Label>
                                <Input
                                    id="roleName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Warehouse Supervisor"
                                    className="bg-slate-950 border-slate-800 text-white focus:border-cyan-500"
                                    disabled={role?.isAdmin || role?.isDefault}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="roleDesc" className="text-slate-300">
                                    {t('dashboard.roles.description_label', 'Description')}
                                </Label>
                                <Input
                                    id="roleDesc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe this role's purpose"
                                    className="bg-slate-950 border-slate-800 text-white focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-300 font-semibold">{t('dashboard.roles.permissions', 'Permissions')}</Label>
                                <span className="text-xs text-slate-500">{selectedPermissions.length} selected</span>
                            </div>

                            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/30">
                                <Tabs defaultValue={categories[0]} orientation="vertical" className="w-full flex flex-row h-[400px] gap-0">
                                    <div className="w-[200px] bg-slate-950/50 border-r border-slate-800 flex flex-col">
                                        <TabsList className="bg-transparent w-full h-full p-0 flex flex-col justify-start items-stretch rounded-none">
                                            <ScrollArea className="h-full">
                                                {categories.map((category) => (
                                                    <TabsTrigger
                                                        key={category}
                                                        value={category}
                                                        className="data-[state=active]:bg-slate-800/80 data-[state=active]:text-cyan-400 text-slate-400 px-4 py-3.5 text-xs capitalize rounded-none border-l-2 border-transparent data-[state=active]:border-cyan-500 justify-start transition-all hover:bg-slate-800/40 w-full whitespace-normal text-left">
                                                        {category.replace('_', ' ')}
                                                    </TabsTrigger>
                                                ))}
                                            </ScrollArea>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 bg-slate-900/10 flex flex-col min-h-0 overflow-hidden">
                                        {categories.map((category) => (
                                            <TabsContent key={category} value={category} className="mt-0 flex-1 flex flex-col focus-visible:outline-none min-h-0 overflow-hidden">
                                                <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between shrink-0">
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            id={`select-all-${category}`}
                                                            checked={isModuleAllSelected(category)}
                                                            onCheckedChange={() => handleToggleModule(category)}
                                                            className="border-slate-700 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600 h-4 w-4"
                                                        />
                                                        <label
                                                            htmlFor={`select-all-${category}`}
                                                            className="text-xs font-bold text-slate-300 cursor-pointer hover:text-cyan-400 transition-colors uppercase tracking-wider">
                                                            Select All in {category.replace('_', ' ')}
                                                        </label>
                                                    </div>
                                                    <Badge variant="outline" className="bg-slate-900 border-slate-800 text-[10px] px-2 py-0 text-slate-400">
                                                        {getModuleSelectedCount(category)} / {Object.keys(Permissions[category]).length}
                                                    </Badge>
                                                </div>

                                                <ScrollArea className="flex-1 min-h-0">
                                                    <div className="p-4 grid grid-cols-1 gap-3">
                                                        {Object.entries(Permissions[category]).map(([key, slug]) => (
                                                            <div
                                                                key={slug as string}
                                                                className="flex items-start space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                                                <Checkbox
                                                                    id={slug as string}
                                                                    checked={selectedPermissions.includes(slug as string)}
                                                                    onCheckedChange={() => handleTogglePermission(slug as string)}
                                                                    className="mt-1 border-slate-700 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                                                />
                                                                <div className="grid gap-1.5 leading-none">
                                                                    <label
                                                                        htmlFor={slug as string}
                                                                        className="text-sm font-medium leading-none text-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                    </label>
                                                                    <p className="text-xs text-slate-500">{PermissionDescriptions[slug as string] || 'No description available'}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </TabsContent>
                                        ))}
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-slate-800 bg-slate-900/50">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-white">
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || role?.isAdmin}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white min-w-[120px]">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {isEditing ? t('common.save_changes', 'Save Changes') : t('common.create', 'Create Role')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
