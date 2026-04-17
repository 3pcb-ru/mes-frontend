import { LucideIcon, LayoutGrid, BarChart3, Table as TableIcon, Info, AlertTriangle } from 'lucide-react';

/**
 * VIBE_STYLE_TOKENS defines the mandatory visual constraints for AI-generated components.
 * This ensures the "Premium Dark Mode" aesthetic is maintained regardless of AI input.
 */
export const VIBE_STYLE_TOKENS = {
    colors: {
        background: 'bg-slate-950',
        card: 'bg-slate-900/50',
        border: 'border-slate-800',
        text: {
            primary: 'text-white',
            muted: 'text-slate-400',
            accent: 'text-cyan-400',
        },
        accents: {
            cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
            emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
            amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
            red: 'text-red-400 border-red-500/20 bg-red-500/5',
        },
    },
    animations: {
        fadeIn: 'animate-in fade-in duration-500',
        slideIn: 'animate-in slide-in-from-bottom-2 duration-300',
    },
    layout: {
        radius: 'rounded-xl',
        padding: 'p-6',
        gridGap: 'gap-6',
    },
} as const;

/**
 * Maps common AI-suggested icon names to Lucide equivalents.
 */
export const getVibeIcon = (name?: string): any => {
    const lower = name?.toLowerCase() || '';
    if (lower.includes('chart') || lower.includes('graph')) return BarChart3;
    if (lower.includes('table') || lower.includes('grid') || lower.includes('list')) return TableIcon;
    if (lower.includes('layout') || lower.includes('dashboard')) return LayoutGrid;
    if (lower.includes('alert') || lower.includes('warning')) return AlertTriangle;
    return Info;
};

/**
 * Vibe Protocol Enforcer: Rectifies AI-generated configurations.
 * Enforces column limits, naming conventions, and style overrides.
 */
export const enforceVibeProtocol = (config: any) => {
    if (!config || typeof config !== 'object') return config;

    // 1. Title Normalization
    if (!config.pageTitle && config.name) config.pageTitle = config.name;

    // 2. Section Rectification
    if (Array.isArray(config.sections)) {
        config.sections = config.sections.map((section: any) => {
            // Apply 10-column cap to grids/tables
            if (section.layout === 'grid' && Array.isArray(section.columns)) {
                if (section.columns.length > 10) {
                    console.warn(`[Vibe Protocol] Column count (${section.columns.length}) exceeded cap. Stripping to 10.`);
                    section.columns = section.columns.slice(0, 10);
                }
            }
            return section;
        });
    }

    return config;
};
