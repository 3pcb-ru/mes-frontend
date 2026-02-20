import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Construction, ChevronLeft, Package, BarChart3, Settings, FileText, HelpCircle, MessageSquare, Blocks, LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

// Map specific paths to specific icons and titles for a more tailored experience
const PAGE_CONFIG: Record<string, { title: string; description: string; icon: LucideIcon; color: string }> = {
    '/dashboard/products': {
        title: 'Products Management',
        description: 'Advanced product catalog and inventory management features are currently under development.',
        icon: Package,
        color: 'text-cyan-400',
    },
    '/dashboard/analytics': {
        title: 'Advanced Analytics',
        description: 'Deep dive insights, predictive analysis, and custom reporting tools are coming soon.',
        icon: BarChart3,
        color: 'text-purple-400',
    },
    '/dashboard/settings': {
        title: 'System Settings',
        description: 'Comprehensive system configuration and preference management controls are in the works.',
        icon: Settings,
        color: 'text-slate-400',
    },
    '/dashboard/reports': {
        title: 'Reports Center',
        description: 'Generate detailed production, quality, and performance reports with our upcoming reporting engine.',
        icon: FileText,
        color: 'text-orange-400',
    },
    '/dashboard/help': {
        title: 'Help & Support',
        description: 'A comprehensive knowledge base and support ticket system to assist you better.',
        icon: HelpCircle,
        color: 'text-green-400',
    },
    '/dashboard/messages': {
        title: 'Messages',
        description: 'Real-time team collaboration and messaging features are being built.',
        icon: MessageSquare,
        color: 'text-blue-400',
    },
    '/dashboard/integration': {
        title: 'Integrations',
        description: 'Connect with third-party tools and services seamlessly. Integration hub is coming soon.',
        icon: Blocks,
        color: 'text-pink-400',
    },
};

export function ComingSoonPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Default configuration if path not found in map
    const defaultConfig = {
        title: 'Coming Soon',
        description: "We're working hard to bring you this feature. Stay tuned for updates!",
        icon: Construction,
        color: 'text-cyan-400',
    };

    const config = PAGE_CONFIG[location.pathname] || defaultConfig;
    const Icon = config.icon;

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                    <CardContent className="pt-10 pb-8 px-8 text-center relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-slate-800/50 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl">
                            <Icon className={`w-10 h-10 ${config.color}`} />
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white mb-3">
                            {config.title}
                        </motion.h1>

                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-slate-400 mb-8 leading-relaxed">
                            {config.description}
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
                            {/* Progress bar simulation */}
                            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                                    initial={{ width: '5%' }}
                                    animate={{ width: '65%' }}
                                    transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Development in progress</p>

                            <div className="pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/dashboard')}
                                    className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-300">
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
