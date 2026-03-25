import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Factory, BoxSelect, SeparatorHorizontal, Box, Cpu, Package, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type CustomNodeData = {
    label: string;
    id: string;
    type?: string;
    status?: string;
    selected?: boolean;
};

const typeIcons: Record<string, any> = {
    factory: Factory,
    area: BoxSelect,
    line: SeparatorHorizontal,
    station: Box,
    other: Package,
};

export function CustomNode({ data, selected }: NodeProps<Node<CustomNodeData>>) {
    const Icon = typeIcons[data.type || 'other'] || Package;
    const statusColor = data.status === 'RUNNING' ? 'bg-green-500' : data.status === 'WARNING' ? 'bg-amber-500' : data.status === 'ERROR' ? 'bg-red-500' : 'bg-slate-500';

    return (
        <div className={cn(
            "group relative px-4 py-3 rounded-xl border-2 transition-all duration-200",
            "bg-slate-900/90 backdrop-blur-md",
            selected 
                ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105" 
                : "border-slate-700/50 hover:border-slate-600 hover:shadow-lg"
        )}>
            {/* Connection Points */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-cyan-500 border-2 border-slate-900" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan-500 border-2 border-slate-900" />

            <div className="flex items-start gap-3">
                <div className={cn(
                    "p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:bg-slate-800",
                    selected ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-[120px]">
                    <h4 className="text-sm font-bold text-white truncate mb-1">
                        {data.label}
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 truncate max-w-[80px]">
                            {data.id}
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", statusColor)} />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                {data.status || 'IDLE'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Decorator */}
            {!selected && (
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-cyan-500 rounded-full p-0.5">
                        <Info className="w-2.5 h-2.5 text-slate-950" />
                    </div>
                </div>
            )}
        </div>
    );
}
