import { Menu, Bell, Search, User, Power } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/store/auth.store';
import { Link } from 'react-router-dom';
import { NotificationDropdown } from './notification-dropdown';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-4 px-6">
                {/* Menu Toggle */}
                <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800/50">
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Search */}
                <div className="max-w-md flex-1 md:flex-none">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search..." className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500" />
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 text-slate-300 hover:text-white hover:bg-slate-800/50">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-900">
                                    <User className="size-5 text-white" />
                                </div>
                                <span className="hidden md:block font-medium">{user?.firstName || 'User'}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-slate-900/95 backdrop-blur-xl border-slate-700 p-2">
                            <DropdownMenuLabel className="p-2 mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white">
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                        <span className="text-xs text-slate-400 font-normal">{user?.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800 mx-2" />
                            <div className="p-1">
                                <Link to="/dashboard/profile">
                                    <DropdownMenuItem className="flex items-center gap-2 text-slate-300 focus:text-white focus:bg-slate-800/50 rounded-md cursor-pointer transition-colors px-3 py-2">
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="flex items-center gap-2 text-slate-300 focus:text-white focus:bg-slate-800/50 rounded-md cursor-pointer transition-colors px-3 py-2">
                                    <Bell className="h-4 w-4" />
                                    <span>Notifications</span>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator className="bg-slate-800 mx-2" />
                            <div className="p-1">
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-400 focus:text-red-300 focus:bg-red-400/10 rounded-md cursor-pointer transition-colors px-3 py-2 text-sm font-medium">
                                    <Power className="size-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
