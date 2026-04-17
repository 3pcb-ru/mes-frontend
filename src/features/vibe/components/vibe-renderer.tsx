import React, { useEffect } from 'react';
import Frame from 'react-frame-component';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Component Registry Mapping
const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
    StatCard: ({ title, value, trend, icon }: any) => {
        const { t } = useTranslation();
        return (
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
                    <div className="h-4 w-4 text-cyan-400">{icon}</div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{value}</div>
                    {trend && (
                        <p className={`text-xs ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {t('dashboard.vibe.general.labels.from_last_month', { trend: trend > 0 ? `+${trend}` : trend })}
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    },
    Sectionv1: ({ title, children }: any) => (
        <section className="space-y-4 p-4">
            {title && <h2 className="text-xl font-bold text-white mb-4">{title}</h2>}
            <div className="grid gap-4">{children}</div>
        </section>
    ),
    Gridv1: ({ columns = 1, children }: any) => (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {children}
        </div>
    ),
    StatusBadge: ({ label, type = 'info' }: any) => {
        const variants: Record<string, string> = {
            success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            danger: 'bg-red-500/10 text-red-500 border-red-500/20',
            info: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        };
        return (
            <Badge variant="outline" className={variants[type] || variants.info}>
                {label}
            </Badge>
        );
    },
};

interface VibeRendererProps {
    config: any;
}

export const VibeRenderer: React.FC<VibeRendererProps> = ({ config }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Event Bridge: Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'VIBE_NAVIGATE') {
                console.log('[Vibe Bridge] Navigating to:', event.data.path);
                navigate(event.data.path);
            }
            if (event.data?.type === 'VIBE_REFRESH') {
                console.log('[Vibe Bridge] Refreshing page');
                window.location.reload();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    const renderComponent = (item: any) => {
        const Component = COMPONENT_REGISTRY[item.component];
        if (!Component) {
            return (
                <div className="p-4 border border-dashed border-red-500 text-red-500">
                    {t('dashboard.vibe.general.errors.unknown_component', { name: item.component })}
                </div>
            );
        }

        // Recursive rendering for children if any
        let children = null;
        if (item.children && Array.isArray(item.children)) {
            children = item.children.map((child: any, idx: number) => <div key={child.id || idx}>{renderComponent(child)}</div>);
        }

        return <Component {...item.props}>{children}</Component>;
    };

    const sections = config?.sections || [];

    // Inject Tailwind Play CDN and base styles into the iframe
    const head = (
        <>
            <script src="https://cdn.tailwindcss.com"></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                tailwind.config = {
                    theme: {
                        extend: {
                            colors: {
                                slate: {
                                    950: '#020617',
                                    900: '#0f172a',
                                    800: '#1e293b',
                                    400: '#94a3b8',
                                },
                                cyan: { 400: '#22d3ee' },
                                emerald: { 400: '#34d399', 500: '#10b981' },
                                amber: { 500: '#f59e0b' },
                                red: { 400: '#f87171', 500: '#ef4444' },
                            }
                        }
                    }
                }
            `,
                }}
            />
            <style>{`
                body { 
                    background-color: transparent; 
                    margin: 0; 
                    font-family: ui-sans-serif, system-ui, sans-serif;
                    color: white;
                }
                .vibe-content { padding: 20px; }
            `}</style>
        </>
    );

    return (
        <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <Frame head={head} className="w-full h-full border-none">
                <div className="vibe-content">
                    {sections.map((section: any, idx: number) => (
                        <div key={section.id || idx} className="mb-8">
                            {section.layout === 'grid' ? (
                                <div
                                    className="grid gap-6"
                                    style={{
                                        gridTemplateColumns: `repeat(\${section.columns?.default || 1}, minmax(0, 1fr))`,
                                    }}>
                                    {section.columns?.map((col: any, cIdx: number) => (
                                        <div
                                            key={cIdx}
                                            className="col-span-1"
                                            onClick={() => {
                                                if (col.content?.actions?.find((a: any) => a.action === 'NAVIGATE')) {
                                                    const navAction = col.content.actions.find((a: any) => a.action === 'NAVIGATE');
                                                    window.parent.postMessage({ type: 'VIBE_NAVIGATE', path: navAction.target }, '*');
                                                }
                                            }}>
                                            {renderComponent(col.content)}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                renderComponent(section.content)
                            )}
                        </div>
                    ))}
                </div>
            </Frame>
        </div>
    );
};
