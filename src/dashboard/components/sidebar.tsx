import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, FileBarChart, ChevronLeft, ChevronRight, FileText, HelpCircle, MessageSquare, Blocks, Factory, Activity, Warehouse, Network } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/features/auth/store/auth.store';
import { Logo } from '@/shared/components/logo';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from 'react-i18next';

interface DashboardSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
    const location = useLocation();
    const { user, detailedProfile } = useAuth();
    const { t } = useTranslation();

    const navSections = [
        {
            title: t('dashboard.sidebar.nav.main'),
            items: [
                { name: t('dashboard.sidebar.nav.dashboard'), icon: LayoutDashboard, href: '/dashboard' },
            ]
        },
        {
            title: t('dashboard.sidebar.nav.operations'),
            items: [
                { name: t('dashboard.sidebar.nav.production'), icon: Activity, href: '/dashboard/work-orders' },
                { name: t('dashboard.sidebar.nav.warehouse'), icon: Warehouse, href: '/dashboard/warehouse' },
            ]
        },
        {
            title: t('dashboard.sidebar.nav.analytics'),
            items: [
                { name: t('dashboard.sidebar.nav.reports'), icon: FileBarChart, href: '/dashboard/reports' },
            ]
        },
        {
            title: t('dashboard.sidebar.nav.configuration'),
            items: [
                { name: t('dashboard.sidebar.nav.products'), icon: Package, href: '/dashboard/products' },
                { name: t('dashboard.sidebar.nav.users'), icon: Users, href: '/dashboard/users' },
                { name: t('dashboard.sidebar.nav.facilities'), icon: Network, href: '/dashboard/facilities' },
                { name: t('dashboard.sidebar.nav.settings'), icon: Settings, href: '/dashboard/settings' },
            ]
        }
    ];
    const organization = detailedProfile?.organization;
    const orgName = organization?.name || user?.organizationName || 'GRVT MES';
    const orgLogo = organization?.logoUrl;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />}

            {/* Sidebar */}
            <aside className={cn('fixed top-0 left-0 z-50 h-full bg-slate-950 border-r border-slate-800 transition-all duration-300', isOpen ? 'w-64' : 'w-20', 'hidden lg:block')}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                    <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
                        {orgLogo ? (
                            <img src={orgLogo} alt={orgName} className="h-8 w-8 rounded-lg object-contain bg-slate-900/50 flex-shrink-0" />
                        ) : (
                            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                                <Factory className="h-5 w-5 text-cyan-400" />
                            </div>
                        )}
                        {isOpen && <span className="text-lg font-bold text-white truncate antialiased">{orgName}</span>}
                    </Link>
                    <Button variant="ghost" size="icon" onClick={onToggle} className="text-slate-400 hover:text-white shrink-0 ml-1">
                        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
                    {navSections.map((section, idx) => (
                        <div key={section.title} className="space-y-2">
                            {idx > 0 && <div className="border-t border-slate-800/50 my-4 mx-2" />}
                            {isOpen && (
                                <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                    {section.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                                                isActive
                                                    ? 'bg-gradient-to-r from-brand-primary-start/20 to-brand-primary-end/20 text-cyan-400 border border-brand-primary-start/30 shadow-lg shadow-brand-primary-start/5'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                                                !isOpen && 'justify-center',
                                            )}>
                                            <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-cyan-400')} />
                                            {isOpen && <span className="text-sm font-medium">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
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
                    <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
                        {orgLogo ? (
                            <img src={orgLogo} alt={orgName} className="h-8 w-8 rounded-lg object-contain bg-slate-900/50 flex-shrink-0" />
                        ) : (
                            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                                <Factory className="h-5 w-5 text-cyan-400" />
                            </div>
                        )}
                        <span className="text-lg font-bold text-white truncate antialiased">{orgName}</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-6">
                    {navSections.map((section, idx) => (
                        <div key={section.title} className="space-y-2">
                            {idx > 0 && <div className="border-t border-slate-800/50 my-4 mx-2" />}
                            <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            onClick={onToggle}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                                isActive
                                                    ? 'bg-gradient-to-r from-brand-primary-start/20 to-brand-primary-end/20 text-cyan-400 border border-brand-primary-start/30'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                                            )}>
                                            <item.icon className={cn('h-5 w-5', isActive && 'text-cyan-400')} />
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
