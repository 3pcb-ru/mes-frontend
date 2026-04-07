import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { NodeType } from '@/features/facilities/types/facilities.types';

interface GeometricShapeProps {
    type: NodeType | string;
    className?: string;
    selected?: boolean;
    children?: React.ReactNode;
}

const SHAPE_CONFIGS: Record<string, { path: string; viewBox: string }> = {
    FACILITY: {
        path: "M25,0 L75,0 L100,50 L75,100 L25,100 L0,50 Z",
        viewBox: "0 0 100 100"
    },
    PRODUCTION: {
        path: "M4,0 H96 A4,4 0 0 1 100,4 V96 A4,4 0 0 1 96,100 H4 A4,4 0 0 1 0,96 V4 A4,4 0 0 1 4,0 Z",
        viewBox: "0 0 100 100"
    },
    WAREHOUSE: {
        path: "M50,0 L100,50 L50,100 L0,50 Z",
        viewBox: "0 0 100 100"
    },
    LOGISTICS: {
        path: "M50,0 L100,50 L50,100 L0,50 Z",
        viewBox: "0 0 100 100"
    },
    QUALITY: {
        path: "M50,50 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0",
        viewBox: "0 0 100 100"
    },
    OTHER: {
        path: "M10,0 H90 A10,10 0 0 1 100,10 V90 A10,10 0 0 1 90,100 H10 A10,10 0 0 1 0,90 V10 A10,10 0 0 1 10,0 Z",
        viewBox: "0 0 100 100"
    }
};

const COLOR_MAP: Record<string, { stroke: string; fill: string }> = {
    FACILITY: { stroke: "#22d3ee", fill: "rgba(34, 211, 238, 0.1)" }, // Cyan 400
    PRODUCTION: { stroke: "#34d399", fill: "rgba(52, 211, 153, 0.1)" }, // Emerald 400
    WAREHOUSE: { stroke: "#fbbf24", fill: "rgba(251, 191, 36, 0.1)" }, // Amber 400
    LOGISTICS: { stroke: "#818cf8", fill: "rgba(129, 140, 248, 0.1)" }, // Indigo 400
    QUALITY: { stroke: "#fb7185", fill: "rgba(251, 113, 133, 0.1)" }, // Rose 400
    OTHER: { stroke: "#94a3b8", fill: "rgba(148, 163, 184, 0.1)" } // Slate 400
};

// Aliases for robustness
const aliases: Record<string, string> = {
    'factory': 'FACILITY',
    'area': 'PRODUCTION',
    'line': 'PRODUCTION',
    'station': 'PRODUCTION',
    'other': 'OTHER'
};

export const GeometricShape: React.FC<GeometricShapeProps> = ({ 
    type, 
    className, 
    selected, 
    children 
}) => {
    const rawType = (type || 'OTHER').toString();
    const normalizedType = aliases[rawType.toLowerCase()] || rawType.toUpperCase();
    
    const config = SHAPE_CONFIGS[normalizedType] || SHAPE_CONFIGS.OTHER;
    const colorTheme = COLOR_MAP[normalizedType] || COLOR_MAP.OTHER;

    return (
        <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
            <svg 
                viewBox={config.viewBox} 
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
            >
                <path
                    d={config.path}
                    stroke={colorTheme.stroke}
                    fill={colorTheme.fill}
                    className={cn(
                        "transition-all duration-300",
                        selected ? "stroke-[3px] filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "stroke-[2px]"
                    )}
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
};
