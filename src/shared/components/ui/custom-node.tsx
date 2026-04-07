import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Factory, Cpu, Box, Truck, ShieldCheck, Package } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { NodeType } from '@/features/facilities/types/facilities.types';
import { GeometricShape } from './geometric-shape';

export type CustomNodeData = {
    label: string;
    id: string;
    path?: string;
    type?: string | NodeType;
    status?: string;
    selected?: boolean;
};

const typeIcons: Record<string, any> = {
    FACILITY: Factory,
    PRODUCTION: Cpu,
    WAREHOUSE: Box,
    LOGISTICS: Truck,
    QUALITY: ShieldCheck,
    OTHER: Package,
};

export const CustomNode = React.memo(({ data, selected }: NodeProps<Node<CustomNodeData>>) => {
    const nodeType = (data.type as string)?.toUpperCase() || 'OTHER';
    const Icon = typeIcons[nodeType] || typeIcons.OTHER;
    
    return (
        <div className="group relative w-[240px] h-[84px] transition-all duration-200 hover:scale-[1.02]">
            {/* Connection Points - 4 Handles like draw.io */}
            <Handle 
                type="target" 
                position={Position.Top} 
                className="!w-4 !h-4 !bg-cyan-500 !border-2 !border-slate-100 !z-50 !rounded-full !opacity-0 group-hover:!opacity-100 transition-opacity !top-0 !left-1/2 !-translate-x-1/2 !-translate-y-1/2" 
            />
            
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="!w-4 !h-4 !bg-cyan-500 !border-2 !border-slate-100 !z-50 !rounded-full !opacity-0 group-hover:!opacity-100 transition-opacity !bottom-0 !left-1/2 !-translate-x-1/2 !translate-y-1/2" 
            />
            
            <Handle 
                type="source" 
                position={Position.Left} 
                className="!w-4 !h-4 !bg-cyan-500 !border-2 !border-slate-100 !z-50 !rounded-full !opacity-0 group-hover:!opacity-100 transition-opacity !left-0 !top-1/2 !-translate-y-1/2 !-translate-x-1/2" 
            />
            
            <Handle 
                type="target" 
                position={Position.Right} 
                className="!w-4 !h-4 !bg-cyan-500 !border-2 !border-slate-100 !z-50 !rounded-full !opacity-0 group-hover:!opacity-100 transition-opacity !right-0 !top-1/2 !-translate-y-1/2 !translate-x-1/2" 
            />

            <GeometricShape type={nodeType} selected={selected} className="w-full h-full">
                <div className="flex items-center gap-3 w-full px-4 overflow-hidden">
                    <div className={cn(
                        "p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 group-hover:bg-slate-700 transition-colors shrink-0",
                        selected ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300"
                    )}>
                        <Icon className="size-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate mb-0.5" title={data.label}>
                            {data.label}
                        </h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className={cn(
                                "size-1.5 rounded-full animate-pulse",
                                data.status === 'RUNNING' ? 'bg-green-500' : 'bg-slate-400'
                            )} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {data.status || 'IDLE'}
                            </span>
                        </div>
                    </div>
                </div>
            </GeometricShape>
        </div>
    );
});

CustomNode.displayName = 'CustomNode';
