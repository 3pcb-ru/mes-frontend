import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, BarChart3, ChevronLeft, ChevronRight, FileText, HelpCircle, MessageSquare, Blocks } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Logo } from '@/shared/components/logo';
import { Button } from '@/shared/components/ui/button';

interface DashboardSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Products', icon: Package, href: '/dashboard/products' },
    { name: 'Users', icon: Users, href: '/dashboard/users' },
    { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { name: 'Reports', icon: FileText, href: '/dashboard/reports' },
    { name: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
    { name: 'Integration', icon: Blocks, href: '/dashboard/integration' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    { name: 'Help & Support', icon: HelpCircle, href: '/dashboard/help' },
];

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
    const location = useLocation();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />}

            {/* Sidebar */}
            <aside className={cn('fixed top-0 left-0 z-50 h-full bg-slate-950 border-r border-slate-800 transition-all duration-300', isOpen ? 'w-64' : 'w-20', 'hidden lg:block')}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <Logo className="h-8 w-8 flex-shrink-0" />
                        {isOpen && <span className="text-lg font-bold text-white">GRVT MES</span>}
                    </Link>
                    <Button variant="ghost" size="icon" onClick={onToggle} className="text-slate-400 hover:text-white">
                        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                                    !isOpen && 'justify-center',
                                )}>
                                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-cyan-400')} />
                                {isOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 lg:hidden',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <Logo className="h-8 w-8" />
                        <span className="text-lg font-bold text-white">GRVT MES</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={onToggle}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                                )}>
                                <item.icon className={cn('h-5 w-5', isActive && 'text-cyan-400')} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
