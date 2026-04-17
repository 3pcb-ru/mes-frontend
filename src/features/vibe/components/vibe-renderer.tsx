import React, { useEffect, useMemo, Suspense, useState } from 'react';
import * as FrameModule from 'react-frame-component';

// Extreme robustness for react-frame-component ESM/CJS interop
const Frame: any = (FrameModule as any).default?.default || (FrameModule as any).default || FrameModule;

import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { DataTableGrid } from '@/shared/components/ui/data-table-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line } from 'recharts';
import { useVibeData } from '../hooks/vibe-hooks';
import { VIBE_STYLE_TOKENS, getVibeIcon, enforceVibeProtocol } from '../lib/vibe-protocol';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { AlertTriangle, CloudOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * FrameStabilizer: Monitors content height and relays it to the parent VibeRenderer.
 * This eliminates double scrollbars by ensuring the iframe always matches its content.
 */
const FrameStabilizer = () => {
    const lastHeight = React.useRef(0);
    const timer = React.useRef<any>(null);

    useEffect(() => {
        const target = document.getElementById('vibe-content-stable');
        if (!target) return;

        const obs = new ResizeObserver(() => {
            if (timer.current) clearTimeout(timer.current);
            
            timer.current = setTimeout(() => {
                const innerTarget = document.getElementById('vibe-content-stable');
                if (!innerTarget) return;

                const height = Math.ceil(innerTarget.offsetHeight);
                
                // Absolute Loop Kill: Only relay if the inner stable wrapper actually changed
                if (Math.abs(height - lastHeight.current) > 5) {
                    lastHeight.current = height;
                    window.parent.postMessage({ type: 'VIBE_RESIZE', height }, '*');
                }
            }, 100);
        });
        
        obs.observe(target);
        return () => {
            obs.disconnect();
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    return null;
};

/**
 * BaseVibeMetric: Standardized KPI/Stat card for Vibe pages.
 */
const BaseVibeMetric = ({ title, value, trend, icon, className }: any) => {
    const { t } = useTranslation();
    const Icon = getVibeIcon(icon);

    return (
        <Card className={`${VIBE_STYLE_TOKENS.colors.card} ${VIBE_STYLE_TOKENS.colors.border} backdrop-blur-sm ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${VIBE_STYLE_TOKENS.colors.text.muted}`}>{title}</CardTitle>
                <div className={`h-4 w-4 ${VIBE_STYLE_TOKENS.colors.text.accent}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${VIBE_STYLE_TOKENS.colors.text.primary}`}>{value}</div>
                {trend !== undefined && (
                    <p className={`text-xs mt-1 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t('dashboard.vibe.general.labels.from_last_month', { trend: trend > 0 ? `+${trend}` : trend })}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

/**
 * BaseVibeTable: Wraps DataTableGrid with auto-discovery and protocol N/A fallback.
 */
const BaseVibeTable = ({ dataSource, columns: aiColumns, title, onError }: any) => {
    const { t } = useTranslation();
    const { data, isLoading, error, detectedFields } = useVibeData(dataSource);

    useEffect(() => {
        if (error && onError) onError();
    }, [error, onError]);

    // Protocol: Auto-discover columns if AI provides none, capped at 10.
    const columns = useMemo(() => {
        const source =
            aiColumns && Array.isArray(aiColumns) && aiColumns.length > 0 ? aiColumns : detectedFields.slice(0, 10).map((field) => ({ header: field, accessorKey: field }));

        return source.map((col: any) => ({
            header: col.header,
            accessorKey: col.accessorKey,
            cell: (item: any) => {
                const val = item[col.accessorKey];
                if (val === undefined || val === null) {
                    return (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <span className="text-slate-600 italic cursor-help">N/A</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{t('dashboard.vibe.general.errors.property_not_found', { name: col.accessorKey })}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                }
                return String(val);
            },
        }));
    }, [aiColumns, detectedFields, t]);

    return (
        <div className="space-y-4 relative">
            <div className="flex items-center justify-between">
                {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
                {error && (
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 font-bold uppercase tracking-tighter animate-pulse">
                        <CloudOff className="h-2.5 w-2.5" /> {t('dashboard.sidebar.vibe.general.errors.data_fetch_failed', 'Connectivity Issue')}
                    </div>
                )}
            </div>

            <div className={cn('transition-all duration-500', error && 'opacity-30 grayscale blur-[1px] pointer-events-none')}>
                <DataTableGrid data={data || []} columns={columns} isLoading={isLoading} className="border-none bg-transparent" />
            </div>

            {error && (
                <div className="absolute inset-0 top-10 flex flex-col items-center justify-center p-8 text-center bg-slate-950/20 backdrop-blur-[1px] rounded-xl border border-dashed border-red-500/20 m-2">
                    <p className="text-[10px] font-bold text-red-200/60 uppercase tracking-[0.2em] mb-2">Protocol Feed Interrupted</p>
                    <p className="text-[9px] text-slate-500 max-w-[200px] leading-relaxed">
                        The manufacturing endpoint returned a 404 or timed out. Axes and headers preserved for architectural reference.
                    </p>
                </div>
            )}
        </div>
    );
};

/**
 * BaseVibeChart: Universal charting component supporting Bar, Area, and Line.
 * Features Auto-Discovery of data keys and dynamic styling.
 */
const BaseVibeChart = ({ dataSource, type = 'bar', title, xAxis = 'name', chartColor, onError }: any) => {
    const { t } = useTranslation();

    const { data, isLoading, error } = useVibeData(dataSource);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (error && onError) onError();
    }, [error, onError]);

    // Recharts Dimension Stabilization: Delay rendering until iframe layout is finalized
    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 250); // Increased delay for slower iframe resolving
        return () => clearTimeout(timer);
    }, []);

    const primaryColor = chartColor || '#22d3ee';

    const { chartConfig, finalData, dataKeys } = useMemo(() => {
        const hasData = data && data.length > 0;

        // If data is missing (404), provide a 2-point "Mock Axis" config to force coordinate system rendering
        if (!hasData) {
            const mockKey = 'Source Feed';
            return {
                chartConfig: { [mockKey]: { label: t('dashboard.sidebar.vibe.general.labels.no_data', 'Missing Feed'), color: primaryColor } },
                // 2 points are required for most Recharts axes to resolve correctly
                finalData: [
                    { [xAxis]: t('dashboard.sidebar.vibe.general.labels.n_a', 'N/A'), [mockKey]: 0 },
                    { [xAxis]: t('dashboard.sidebar.vibe.general.labels.n_a', 'N/A') + ' ', [mockKey]: 0 }
                ],
                dataKeys: [mockKey],
            };
        }

        const firstItem = data[0] as Record<string, any>;
        const keys = Object.keys(firstItem).filter((k) => typeof firstItem[k] === 'number' && k !== 'id');

        const config: any = {};
        keys.forEach((key) => {
            config[key] = {
                label: capitalize(key.replace(/_/g, ' ')),
                color: primaryColor,
            };
        });

        return { chartConfig: config, finalData: data, dataKeys: Object.keys(config) };
    }, [data, primaryColor, xAxis, t]);

    if (isLoading) return <Skeleton className="w-full h-[350px] bg-slate-900/50 rounded-xl" />;

    return (
        <Card className={cn(VIBE_STYLE_TOKENS.colors.card, VIBE_STYLE_TOKENS.colors.border, 'p-6 overflow-hidden relative group transition-all duration-500')}>
            {title && (
                <div className="flex items-center justify-between mb-8">
                    <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</CardTitle>
                    {error && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 font-bold uppercase tracking-widest">
                            <CloudOff className="h-3 w-3" /> Link Down
                        </div>
                    )}
                </div>
            )}

            <div className={cn('h-[300px] w-full min-w-0 min-h-0 mt-4 transition-all duration-700', error && 'opacity-20 grayscale pointer-events-none')}>
                {isReady && (
                    <ChartContainer config={chartConfig} className="w-full h-full aspect-auto !aspect-auto">
                        {type === 'area' ? (
                            <AreaChart data={finalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    {dataKeys.map((key) => (
                                        <linearGradient key={key} id={`fill_${key}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.4} />
                                            <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                                <XAxis dataKey={xAxis} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                {dataKeys.map((key) => (
                                    <Area key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} fillOpacity={1} fill={`url(#fill_${key})`} />
                                ))}
                            </AreaChart>
                        ) : type === 'line' ? (
                            <LineChart data={finalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                                <XAxis dataKey={xAxis} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                {dataKeys.map((key) => (
                                    <Line
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={`var(--color-${key})`}
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: `var(--color-${key})`, strokeWidth: 2, stroke: '#020617' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                ))}
                            </LineChart>
                        ) : (
                            <BarChart data={finalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                                <XAxis dataKey={xAxis} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                {dataKeys.map((key) => (
                                    <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} barSize={32} />
                                ))}
                            </BarChart>
                        )}
                    </ChartContainer>
                )}
            </div>

            {error && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] flex flex-col items-center justify-center p-12 text-center">
                    <div className="p-4 rounded-full bg-slate-900/80 border border-slate-800 shadow-2xl mb-4 animate-bounce duration-[2000ms]">
                        <CloudOff className="h-8 w-8 text-red-500/40" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Architectural Frame Only</p>
                    <p className="text-[9px] text-slate-500 max-w-[280px] leading-relaxed">
                        Data stream for <span className="text-red-400/60 font-mono">{dataSource}</span> failed to resolve (404). Visualization logic is active but waiting for
                        manufacturing telemetries.
                    </p>
                </div>
            )}
        </Card>
    );
};

// Component Factory: Maps any AI-suggested name to a Base Vibe Component
const resolveVibeComponent = (name: string) => {
    const k = name.toLowerCase();
    if (k.includes('chart') || k.includes('graph') || k.includes('plot')) return BaseVibeChart;
    if (k.includes('table') || k.includes('grid') || k.includes('list')) return BaseVibeTable;
    if (k.includes('stat') || k.includes('metric') || k.includes('card') || k.includes('numeric')) return BaseVibeMetric;
    if (k.includes('badge') || k.includes('status'))
        return ({ label, type }: any) => (
            <Badge variant="outline" className="protocol-badge">
                {label}
            </Badge>
        );
    return null;
};

interface VibeRendererProps {
    config: any;
}

export const VibeRenderer: React.FC<VibeRendererProps> = ({ config: rawConfig }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Protocol Enforcement: Rectify AI config before rendering
    const config = useMemo(() => enforceVibeProtocol(rawConfig), [rawConfig]);
    const [errorCount, setErrorCount] = React.useState(0);
    const [frameHeight, setFrameHeight] = React.useState(600);
    const reportError = React.useCallback(() => setErrorCount((prev) => prev + 1), []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'VIBE_NAVIGATE') {
                navigate(event.data.path);
            }
            if (event.data?.type === 'VIBE_REFRESH') {
                window.location.reload();
            }
            if (event.data?.type === 'VIBE_RESIZE') {
                setFrameHeight(event.data.height);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    const renderComponent = (item: any) => {
        if (!item || typeof item !== 'object') return null;

        const componentKey = item.component || 'Unknown';
        let Component = resolveVibeComponent(componentKey);

        // Security/Type check: Ensure Component is actually renderable
        if (Component && typeof Component !== 'function' && typeof Component !== 'string') {
            console.warn(`[Vibe Agent] ${componentKey} resolved to invalid type: ${typeof Component}`, Component);
            Component = null;
        }

        if (!Component) {
            console.warn(`[Vibe Agent] Component resolution failed for: "${componentKey}"`, { item });
            return (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs shadow-inner">
                    <span className="font-bold">Protocol Error:</span> {t('dashboard.sidebar.vibe.general.errors.unknown_component', { name: componentKey })}
                </div>
            );
        }

        // Recursive rendering for children
        let children = null;
        if (item.children && Array.isArray(item.children)) {
            children = item.children.map((child: any, idx: number) => <div key={child.id || idx}>{renderComponent(child)}</div>);
        }

        try {
            return <Component {...item.props} dataSource={item.dataSource} children={children} onError={reportError} />;
        } catch (error) {
            console.error(`[Vibe Agent] Runtime crash in component "${componentKey}":`, error);
            return <div className="p-2 text-red-400 text-[10px] uppercase border border-red-500/20 rounded">Protocol Error: {componentKey}</div>;
        }
    };

    const sections = config?.sections || [];

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
                html, body { 
                    background-color: transparent; 
                    margin: 0; 
                    padding: 0;
                    height: auto !important;
                    min-height: 0 !important;
                    width: 100%;
                    font-family: ui-sans-serif, system-ui, sans-serif;
                    color: white;
                    overflow-y: hidden; /* Prevent double scroll; Parent handles overflow via viewport cap */
                }
                .vibe-content { padding: 20px; padding-bottom: 20px; min-height: fit-content; }
                .protocol-badge { background: rgba(34, 211, 238, 0.1); border-color: rgba(34, 211, 238, 0.2); color: #22d3ee; }

                /* Custom Premium Scrollbar for Vibe Pages */
                ::-webkit-scrollbar { width: 5px; height: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { 
                    background: rgba(30, 41, 59, 0.5); 
                    border-radius: 10px; 
                    border: 1px solid rgba(51, 65, 85, 0.2);
                }
                ::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.2); }
            `}</style>
        </>
    );

    return (
        <div className="w-full h-full min-h-[500px] max-h-[85vh] overflow-y-auto bg-slate-950 rounded-xl border border-slate-800 shadow-2xl transition-all duration-500 custom-vibe-scrollbar">
            <style>{`
                .custom-vibe-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-vibe-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-vibe-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(51, 65, 85, 0.5); 
                    border-radius: 20px; 
                }
                .custom-vibe-scrollbar::-webkit-scrollbar-thumb:hover { 
                    background: rgba(34, 211, 238, 0.4); 
                }
            `}</style>
            <Frame head={head} className="w-full border-none transition-all duration-300" style={{ height: frameHeight }} scrolling="no">
                <div id="vibe-content-stable" className="vibe-content animate-in fade-in duration-700">
                    <FrameStabilizer />
                    <Suspense fallback={<Skeleton className="w-full h-[500px] bg-slate-900/50" />}>
                        <div className="pb-20">
                            {sections.map((section: any, idx: number) => (
                                <div
                                    key={section.id || idx}
                                    className="mb-8 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                                    style={{ animationDelay: `${idx * 100}ms` }}>
                                    {section.layout === 'grid' ? (
                                        <div
                                            className="grid gap-6"
                                            style={{
                                                gridTemplateColumns: `repeat(${Array.isArray(section.columns) ? section.columns.length : 1}, minmax(0, 1fr))`,
                                            }}>
                                            {section.columns?.map((col: any, cIdx: number) => (
                                                <div key={cIdx} className="col-span-1">
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

                        {errorCount > 0 && (
                            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-500 translate-y-[-20px]">
                                <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md px-3 py-2 rounded-full flex items-center gap-2 pr-4 shadow-xl">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    <AlertTriangle className="h-3 w-3 text-red-400" />
                                    <span className="text-[9px] font-bold text-red-200 uppercase tracking-widest text-nowrap">Data connectivity: {errorCount} issues</span>
                                </div>
                            </div>
                        )}
                    </Suspense>
                    <footer className="mt-12 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 uppercase tracking-widest pb-8">
                        {t('dashboard.sidebar.vibe.general.labels.protocol_version')}
                    </footer>
                </div>
            </Frame>
        </div>
    );
};
