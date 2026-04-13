import { useState, useEffect, useCallback } from 'react';
import { Users, Search, Filter, MoreHorizontal, UserPlus, Mail, Shield, CheckCircle2, XCircle, Loader2, Plus, Copy, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { usersService } from '@/features/users/services/users.service';
import { rolesService } from '@/features/users/services/roles.service';
import type { UserListItem, RoleWithPermissions } from '@/features/users/types/users.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { InviteUserModal } from '@/features/users/components/invite-user-modal';
import { RoleManagementModal } from '@/features/users/components/role-management-modal';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

export function UsersPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('users');
    
    // Users state
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // Roles state
    const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
    const [isRolesLoading, setIsRolesLoading] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsUsersLoading(true);
        try {
            const data = await usersService.listUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            toast.error(t('dashboard.users.errors.fetch_failed', 'Failed to load users'));
        } finally {
            setIsUsersLoading(false);
        }
    }, [t]);

    const fetchRoles = useCallback(async () => {
        setIsRolesLoading(true);
        try {
            const data = await rolesService.lookupRoles();
            setRoles(data);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
            toast.error(t('dashboard.roles.errors.fetch_failed', 'Failed to load roles'));
        } finally {
            setIsRolesLoading(false);
        }
    }, [t]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'roles') {
            fetchRoles();
        }
    }, [activeTab, fetchUsers, fetchRoles]);

    const handleToggleUserStatus = async (user: UserListItem) => {
        const newStatus = user.deletedAt ? 'active' : 'inactive';
        try {
            await usersService.updateStatus(user.id, { status: newStatus });
            if (newStatus === 'inactive') {
                toast.warning(t('dashboard.users.status.update_inactive_success', 'User deactivated successfully'));
            } else {
                toast.success(t('dashboard.users.status.update_active_success', 'User reactivated successfully'));
            }
            fetchUsers();
        } catch (err: any) {
            toast.error(err.message || t('dashboard.users.errors.status_update_failed', 'Failed to update user status'));
        }
    };

    const handleDuplicateRole = async (roleId: string) => {
        try {
            await rolesService.duplicateRole(roleId);
            toast.success(t('dashboard.roles.duplicate_success', 'Role duplicated successfully'));
            fetchRoles();
        } catch (err: any) {
            toast.error(err.message || t('dashboard.roles.errors.duplicate_failed', 'Failed to duplicate role'));
        }
    };

    const handleDeleteRole = async (roleId: string) => {
        if (!window.confirm(t('dashboard.roles.delete_confirm', 'Are you sure you want to delete this role?'))) return;
        try {
            await rolesService.deleteRole(roleId);
            toast.warning(t('dashboard.roles.delete_success', 'Role deleted successfully'));
            fetchRoles();
        } catch (err: any) {
            toast.error(err.message || t('dashboard.roles.errors.delete_failed', 'Failed to delete role'));
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.firstName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.users.title', 'Users & Roles')}</h1>
                    <p className="text-slate-400">{t('dashboard.users.description', 'Manage your team members and their access levels.')}</p>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab === 'users' ? (
                        <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/20" onClick={() => setIsInviteModalOpen(true)}>
                            <UserPlus className="h-4 w-4" />
                            <span>{t('dashboard.users.add_user', 'Invite User')}</span>
                        </Button>
                    ) : (
                        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-0 shadow-lg shadow-purple-500/20" onClick={() => { setSelectedRole(null); setIsRoleModalOpen(true); }}>
                            <Plus className="h-4 w-4" />
                            <span>{t('dashboard.roles.add_role', 'Create Role')}</span>
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-900/50 border border-slate-800 p-1 rounded-xl mb-6">
                    <TabsTrigger value="users" className="text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg px-6">
                        <Users className="h-4 w-4 mr-2" />
                        {t('dashboard.users.tabs.users', 'Users')}
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg px-6">
                        <Shield className="h-4 w-4 mr-2" />
                        {t('dashboard.users.tabs.roles', 'Roles')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="mt-0">
                    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-slate-700/50 pb-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <Input
                                        placeholder={t('dashboard.users.search_placeholder', 'Search users...')}
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        className="pl-9 bg-slate-950/50 border-slate-700 text-white focus:border-cyan-500 w-full"
                                    />
                                </div>
                                <Button variant="outline" className="gap-2 bg-slate-900 border-slate-700 text-slate-400">
                                    <Filter className="h-4 w-4" />
                                    <span>{t('dashboard.users.filters', 'Filters')}</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isUsersLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                                    <p className="text-slate-400">{t('common.loading', 'Loading users...')}</p>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.user', 'User')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.role', 'Role')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.status', 'Status')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.joined', 'Joined')}</th>
                                                <th className="px-6 py-4 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/30">
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className={cn("hover:bg-slate-800/30 transition-colors group", user.deletedAt && "opacity-60")}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-all">
                                                                <Users className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium">
                                                                    {user.firstName} {user.lastName}
                                                                </p>
                                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                    <Mail className="h-3 w-3" />
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="h-4 w-4 text-brand-secondary" />
                                                            <span className="text-sm text-slate-300 capitalize">{user.role}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.deletedAt ? (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700">
                                                                <XCircle className="h-3 w-3" />
                                                                {t('dashboard.users.status.inactive', 'Inactive')}
                                                            </span>
                                                        ) : user.isVerified ? (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                {t('dashboard.users.status.active', 'Active')}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                                                                <Loader2 className="h-3 w-3 animate-pulse" />
                                                                {t('dashboard.users.status.pending', 'Pending')}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-slate-700/50">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300 w-48 shadow-2xl">
                                                                <DropdownMenuLabel className="text-xs text-slate-500">{t('dashboard.users.actions.title', 'User Actions')}</DropdownMenuLabel>
                                                                <DropdownMenuSeparator className="bg-slate-800" />
                                                                <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer text-sm">
                                                                    {t('dashboard.users.actions.view_profile', 'View Profile')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer text-sm">
                                                                    {t('dashboard.users.actions.edit_role', 'Change Role')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-slate-800" />
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleToggleUserStatus(user)}
                                                                    className={cn(
                                                                        "focus:bg-slate-800 cursor-pointer text-sm font-medium",
                                                                        user.deletedAt ? "text-emerald-400" : "text-amber-400"
                                                                    )}
                                                                >
                                                                    {user.deletedAt ? (
                                                                        <><Power className="h-4 w-4 mr-2" /> {t('dashboard.users.actions.activate', 'Activate Account')}</>
                                                                    ) : (
                                                                        <><PowerOff className="h-4 w-4 mr-2" /> {t('dashboard.users.actions.deactivate', 'Deactivate Account')}</>
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <p className="text-slate-500 font-medium">{t('dashboard.users.no_users_found', 'No users found matching your search.')}</p>
                                    <Button variant="link" className="text-cyan-500 hover:text-cyan-400" onClick={() => setUserSearchQuery('')}>
                                        {t('dashboard.users.clear_filters', 'Clear search')}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="roles" className="mt-0">
                    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                            {isRolesLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                                    <p className="text-slate-400">{t('common.loading', 'Loading roles...')}</p>
                                </div>
                            ) : roles.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.roles.table.name', 'Role Name')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.roles.table.type', 'Type')}</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.roles.table.permissions', 'Permissions')}</th>
                                                <th className="px-6 py-4 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/30">
                                            {roles.map((role) => (
                                                <tr key={role.id} className="hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-medium">{role.name}</span>
                                                            <span className="text-xs text-slate-500">{role.description || t('dashboard.roles.no_description', 'No description')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {role.organizationId ? (
                                                            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                                                {t('dashboard.roles.type.custom', 'Custom')}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                                                {t('dashboard.roles.type.system', 'System')}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded">
                                                            {role.permissions?.length || 0} {t('dashboard.roles.perms_count', 'permissions')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-slate-400 hover:text-white"
                                                                onClick={() => handleDuplicateRole(role.id)}
                                                                title={t('common.duplicate', 'Duplicate')}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-slate-400 hover:text-white"
                                                                onClick={() => { setSelectedRole(role); setIsRoleModalOpen(true); }}
                                                                title={t('common.edit', 'Edit')}
                                                                disabled={!role.organizationId}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-slate-400 hover:text-red-400"
                                                                onClick={() => handleDeleteRole(role.id)}
                                                                title={t('common.delete', 'Delete')}
                                                                disabled={!role.organizationId}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 gap-4">
                                    <Shield className="h-12 w-12 text-slate-800" />
                                    <p className="text-slate-500">{t('dashboard.roles.no_roles_found', 'No custom roles found.')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <InviteUserModal 
                isOpen={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)} 
                onSuccess={fetchUsers} 
            />

            <RoleManagementModal 
                isOpen={isRoleModalOpen} 
                onClose={() => { setIsRoleModalOpen(false); setSelectedRole(null); }} 
                onSuccess={fetchRoles}
                role={selectedRole}
            />
        </div>
    );
}
