import { useState, useEffect } from 'react';
import { Users, Search, Filter, UserPlus, Mail, ShieldCheck, CheckCircle2, XCircle, Loader2, Plus, Copy, Edit, Trash2, Power, PowerOff, Eye, Shield, Inbox } from 'lucide-react';
import { useUsers } from '@/features/users/store/users.store';
import type { UserListItem, RoleWithPermissions } from '@/features/users/types/users.types';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { InviteUserModal } from '@/features/users/components/invite-user-modal';
import { RoleManagementModal } from '@/features/users/components/role-management-modal';
import { ConfirmDeleteDialog } from '@/shared/components/ui/confirm-delete-dialog';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';

export function UsersPage() {
    const { t } = useTranslation();
    const {
        users,
        roles,
        isUsersLoading,
        isRolesLoading,
        fetchUsers,
        fetchRoles,
        updateUserStatus,
        duplicateRole,
        deleteRole,
    } = useUsers();

    const [activeTab, setActiveTab] = useState('users');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // Roles state (UI only)
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers().catch(() => {});
        } else if (activeTab === 'roles') {
            fetchRoles().catch(() => {});
        }
    }, [activeTab, fetchUsers, fetchRoles]);

    const handleToggleUserStatus = async (user: UserListItem) => {
        const newStatus = user.deletedAt ? 'active' : 'inactive';
        try {
            await updateUserStatus(user.id, { status: newStatus });
            if (newStatus === 'inactive') {
                toast.warning(t('dashboard.users.status.update_inactive_success', 'User deactivated successfully'));
            } else {
                toast.success(t('dashboard.users.status.update_active_success', 'User reactivated successfully'));
            }
        } catch (err: any) {
            toast.error(err.message || t('dashboard.users.errors.status_update_failed', 'Failed to update user status'));
        }
    };

    const handleDuplicateRole = async (roleId: string) => {
        try {
            await duplicateRole(roleId);
            toast.success(t('dashboard.roles.duplicate_success', 'Role duplicated successfully'));
        } catch (err: any) {
            toast.error(err.message || t('dashboard.roles.errors.duplicate_failed', 'Failed to duplicate role'));
        }
    };

    const handleDeleteRole = (roleId: string) => {
        setRoleToDelete(roleId);
    };

    const confirmDeleteRole = async () => {
        if (!roleToDelete) return;
        try {
            await deleteRole(roleToDelete);
            toast.warning(t('dashboard.roles.delete_success', 'Role deleted successfully'));
        } catch (err: any) {
            toast.error(err.message || t('dashboard.roles.errors.delete_failed', 'Failed to delete role'));
        } finally {
            setRoleToDelete(null);
        }
    };

    const filteredUsers = (Array.isArray(users) ? users : []).filter(
        (user) =>
            user?.firstName?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            user?.lastName?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
            user?.email?.toLowerCase().includes(userSearchQuery.toLowerCase()),
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
                        <Button
                            id="invite-user-button"
                            className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/20"
                            onClick={() => setIsInviteModalOpen(true)}>
                            <UserPlus className="h-4 w-4" />
                            <span>{t('dashboard.users.add_user', 'Invite User')}</span>
                        </Button>
                    ) : (
                        <Button
                            id="create-role-button"
                            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-0 shadow-lg shadow-purple-500/20"
                            onClick={() => {
                                setSelectedRole(null);
                                setIsRoleModalOpen(true);
                            }}>
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
                                        id="user-search-input"
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
                                <div className="divide-y divide-slate-700/30">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-48" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-8 w-24 hidden sm:block" />
                                            <Skeleton className="h-6 w-16" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">
                                                    {t('dashboard.users.table.user', 'User')}
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left hidden sm:table-cell">
                                                    {t('dashboard.users.table.role', 'Role')}
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">
                                                    {t('dashboard.users.table.status', 'Status')}
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left hidden lg:table-cell">
                                                    {t('dashboard.users.table.joined', 'Joined')}
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                                                    {t('dashboard.users.actions.title', 'Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/30">
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className={cn('hover:bg-slate-800/30 transition-colors group', user.deletedAt && 'opacity-60')}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/50 transition-all shrink-0">
                                                                {user.avatarUrl ? (
                                                                    <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-cyan-400 uppercase">
                                                                        {user.firstName?.[0]}
                                                                        {user.lastName?.[0]}
                                                                        {!user.firstName && !user.lastName && <Users className="h-5 w-5" />}
                                                                    </div>
                                                                )}
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
                                                    <td className="px-6 py-4 hidden sm:table-cell">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-sm text-slate-300 capitalize">
                                                                {typeof user.role === 'string' ? user.role : (user.role as any)?.name || t('common.unknown', 'Unknown')}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.deletedAt ? (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700">
                                                                <XCircle className="h-3 w-3" />
                                                                {t('dashboard.users.status.inactive', 'Inactive')}
                                                            </span>
                                                        ) : user.isVerified === true || (user as any).is_verified === true ? (
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
                                                    <td className="px-6 py-4 hidden lg:table-cell">
                                                        <div className="space-y-0.5">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                                {user.isVerified
                                                                    ? t('dashboard.users.table.joined_label', 'Joined')
                                                                    : t('dashboard.users.table.invited_label', 'Invited')}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {new Date(user.createdAt).toLocaleString(undefined, {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
                                                                title={t('dashboard.users.actions.view_profile')}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10"
                                                                title={t('dashboard.users.actions.change_role')}
                                                            >
                                                                <ShieldCheck className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleToggleUserStatus(user)}
                                                                className={cn(
                                                                    "h-8 w-8 transition-colors",
                                                                    user.deletedAt
                                                                        ? "text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                                                        : "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                                                                )}
                                                                title={user.deletedAt ? t('dashboard.users.actions.activate') : t('dashboard.users.actions.deactivate')}
                                                            >
                                                                {user.deletedAt ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 gap-4 px-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700">
                                        <Inbox className="h-8 w-8" />
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
                                <div className="divide-y divide-slate-700/30">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="px-6 py-6 flex items-center justify-between">
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-40" />
                                                <Skeleton className="h-3 w-64" />
                                            </div>
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-7 w-24" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : roles.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    {t('dashboard.roles.table.name', 'Role Name')}
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    {t('dashboard.roles.table.type', 'Type')}
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    {t('dashboard.roles.table.permissions', 'Permissions')}
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                                                    {t('dashboard.roles.table.actions', 'Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/30">
                                            {roles.map((role) => (
                                                <tr key={role.id} className="hover:bg-slate-800/30 transition-colors group text-right">
                                                    <td className="px-6 py-4 text-left">
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-medium">{role.name}</span>
                                                            <span className="text-xs text-slate-500">
                                                                {role.description || t('dashboard.roles.no_description', 'No description')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-left">
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
                                                    <td className="px-6 py-4 text-left">
                                                        <span className="text-sm text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded">
                                                            {role.permissions?.length || 0} {t('dashboard.roles.perms_count', 'permissions')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-10 disabled:cursor-not-allowed"
                                                                onClick={() => handleDuplicateRole(role.id)}
                                                                title={t('common.duplicate', 'Duplicate')}>
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-[0.15] disabled:cursor-not-allowed"
                                                                onClick={() => {
                                                                    setSelectedRole(role);
                                                                    setIsRoleModalOpen(true);
                                                                }}
                                                                title={t('common.edit', 'Edit')}
                                                                disabled={!role.organizationId}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-red-400 disabled:opacity-[0.15] disabled:cursor-not-allowed"
                                                                onClick={() => handleDeleteRole(role.id)}
                                                                title={t('common.delete', 'Delete')}
                                                                disabled={!role.organizationId}
                                                                id={`delete-role-${role.id}`}>
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

            <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} onSuccess={fetchUsers} />

            <RoleManagementModal
                isOpen={isRoleModalOpen}
                onClose={() => {
                    setIsRoleModalOpen(false);
                    setSelectedRole(null);
                }}
                onSuccess={fetchRoles}
                role={selectedRole}
            />

            <ConfirmDeleteDialog
                open={!!roleToDelete}
                onOpenChange={(open) => !open && setRoleToDelete(null)}
                onConfirm={confirmDeleteRole}
                title={t('dashboard.roles.delete_confirm_title', 'Delete Role')}
                description={t('dashboard.roles.delete_confirm', 'Are you sure you want to delete this role? This action cannot be undone.')}
                isDeleting={isRolesLoading}
            />
        </div>
    );
}
