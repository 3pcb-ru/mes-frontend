import React, { useEffect, useMemo, Suspense } from 'react';
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

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
const BaseVibeTable = ({ dataSource, columns: aiColumns, title }: any) => {
    const { t } = useTranslation();
    const { data, isLoading, detectedFields } = useVibeData(dataSource);

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
        <div className="space-y-4">
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            <DataTableGrid data={data} columns={columns} isLoading={isLoading} className="border-none bg-transparent" />
        </div>
    );
};

/**
 * BaseVibeChart: Universal charting component supporting Bar, Area, and Line.
 * Features Auto-Discovery of data keys and dynamic styling.
 */
const BaseVibeChart = ({ dataSource, type = 'bar', title, xAxis = 'name', chartColor }: any) => {
    const { data, isLoading } = useVibeData(dataSource);
    const primaryColor = chartColor || '#22d3ee';

    const chartConfig = useMemo(() => {
        if (!data || data.length === 0) return {};
        const firstItem = data[0] as Record<string, any>;
        const keys = Object.keys(firstItem).filter((k) => typeof firstItem[k] === 'number' && k !== 'id');

        const config: any = {};
        keys.forEach((key) => {
            config[key] = {
                label: capitalize(key.replace(/_/g, ' ')),
                color: primaryColor,
            };
        });
        return config;
    }, [data, primaryColor]);

    const dataKeys = Object.keys(chartConfig);

    if (isLoading) return <Skeleton className="w-full h-[350px] bg-slate-900/50 rounded-xl" />;

    return (
        <Card className={`${VIBE_STYLE_TOKENS.colors.card} ${VIBE_STYLE_TOKENS.colors.border} p-6 overflow-hidden`}>
            {title && <CardTitle className="text-sm font-medium mb-8 text-slate-400 uppercase tracking-wider">{title}</CardTitle>}

            <div className="h-[300px] w-full mt-4">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    {type === 'area' ? (
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            </div>
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

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'VIBE_NAVIGATE') {
                navigate(event.data.path);
            }
            if (event.data?.type === 'VIBE_REFRESH') {
                window.location.reload();
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
                <div className="p-4 border border-dashed border-red-500 text-red-500 rounded-lg bg-red-500/5 text-xs font-mono">
                    {t('dashboard.vibe.general.errors.unknown_component', { name: componentKey })}
                </div>
            );
        }

        // Recursive rendering for children
        let children = null;
        if (item.children && Array.isArray(item.children)) {
            children = item.children.map((child: any, idx: number) => <div key={child.id || idx}>{renderComponent(child)}</div>);
        }

        try {
            return <Component {...item.props} dataSource={item.dataSource} children={children} />;
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
                body { 
                    background-color: transparent; 
                    margin: 0; 
                    font-family: ui-sans-serif, system-ui, sans-serif;
                    color: white;
                }
                .vibe-content { padding: 20px; }
                .protocol-badge { background: rgba(34, 211, 238, 0.1); border-color: rgba(34, 211, 238, 0.2); color: #22d3ee; }
            `}</style>
        </>
    );

    return (
        <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <Frame head={head} className="w-full h-full border-none">
                <div className="vibe-content animate-in fade-in duration-700">
                    <Suspense fallback={<Skeleton className="w-full h-[500px] bg-slate-900/50" />}>
                        {sections.map((section: any, idx: number) => (
                            <div key={section.id || idx} className="mb-8">
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
                    </Suspense>
                    <footer className="mt-12 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 uppercase tracking-widest">
                        {t('dashboard.vibe.general.labels.protocol_version')}
                    </footer>
                </div>
            </Frame>
        </div>
    );
};
