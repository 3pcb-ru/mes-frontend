import { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreHorizontal, UserPlus, Mail, Shield, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { usersService } from '@/features/users/services/users.service';
import type { UserListItem } from '@/features/users/types/users.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

export function UsersPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await usersService.listUsers();
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.users.title')}</h1>
                    <p className="text-slate-400">{t('dashboard.users.description')}</p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>{t('dashboard.users.add_user')}</span>
                </Button>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder={t('dashboard.users.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-900 border-slate-700 text-white focus:border-cyan-500 w-full"
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            <span>{t('dashboard.users.filters')}</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                            <p className="text-slate-400">{t('common.loading', { defaultValue: 'Loading users...' })}</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.user')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.role')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.status')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.users.table.joined')}</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 border border-slate-600 group-hover:border-cyan-500/50 transition-colors">
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
                                                    <Shield className="h-4 w-4 text-purple-400" />
                                                    <span className="text-sm text-slate-300 capitalize">{user.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isVerified ? (
                                                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        {t('dashboard.users.status.verified')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        {t('dashboard.users.status.pending')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-300">
                                                        <DropdownMenuLabel>{t('dashboard.users.actions.title')}</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-slate-700" />
                                                        <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">{t('dashboard.users.actions.view_profile')}</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">{t('dashboard.users.actions.edit_permissions')}</DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-slate-800 text-red-400 cursor-pointer">{t('dashboard.users.actions.disable_account')}</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Users className="h-12 w-12 text-slate-700" />
                            <p className="text-slate-400">{t('dashboard.users.no_users_found')}</p>
                            <Button variant="link" className="text-cyan-500 hover:text-cyan-400" onClick={() => setSearchQuery('')}>
                                {t('dashboard.users.clear_filters')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
