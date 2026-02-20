import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/features/notifications/store/notifications.store';
import type { NotificationType } from '@/features/notifications/types/notifications.types';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

const typeConfig: Record<NotificationType, { icon: any; color: string; bg: string }> = {
    system: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    alert: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    error: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
};

export function NotificationDropdown() {
    const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

    const handleOpenChange = (open: boolean) => {
        if (open) {
            fetchNotifications();
        }
    };

    return (
        <DropdownMenu onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800/50 relative">
                    <Bell className="size-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-900 animate-in fade-in zoom-in duration-300">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border-slate-700 p-0 shadow-2xl overflow-hidden">
                <DropdownMenuLabel className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider">{unreadCount} New</span>
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                markAllAsRead();
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 h-7 px-2">
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>

                <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-xs text-slate-500">Loading notifications...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="flex flex-col">
                            {notifications.map((n) => {
                                const cfg = typeConfig[n.type];
                                const Icon = cfg.icon;
                                const isUnread = n.status === 'unread';

                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => isUnread && markAsRead(n.id)}
                                        className={cn(
                                            'relative group flex items-start gap-3 p-4 border-b border-slate-800/50 cursor-pointer transition-all duration-200 hover:bg-slate-800/40',
                                            isUnread && 'bg-cyan-500/[0.02]',
                                        )}>
                                        {isUnread && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-full" />}

                                        <Avatar className="h-10 w-10 border border-slate-700 ring-offset-slate-900 group-hover:border-slate-500 transition-colors">
                                            <AvatarFallback className="bg-slate-800 text-slate-400 font-bold">
                                                {n.type === 'system' ? 'SY' : n.type.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{n.title}</span>
                                                    <span className={cn('p-1 rounded-sm', cfg.bg)}>
                                                        <Icon className={cn('size-3', cfg.color)} />
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed tracking-wide">{n.message}</p>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-[10px] text-slate-500 font-medium italic capitalize">{n.type}</span>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {isUnread && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(n.id);
                                                            }}
                                                            className="h-6 w-6 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10">
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(n.id);
                                                        }}
                                                        className="h-6 w-6 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10">
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                                <Bell className="size-8 text-slate-600" />
                            </div>
                            <h3 className="text-sm font-medium text-white mb-1">No notifications yet</h3>
                            <p className="text-xs text-slate-500 max-w-[200px]">When you receive notifications, they will appear here.</p>
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                        <Button variant="ghost" size="sm" onClick={clearAll} className="w-full text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 py-1">
                            Clear all history
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
