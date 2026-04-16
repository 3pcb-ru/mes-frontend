import * as React from 'react';
import { ChevronRight, ChevronDown, Factory, Cpu, Box, Truck, ShieldCheck, Package } from 'lucide-react';
import { cn } from './utils';

export interface TreeNode {
    id: string;
    label: string;
    type?: string;
    children?: TreeNode[];
    isExpanded?: boolean;
}

interface NodeTreeViewProps {
    data: TreeNode[];
    onNodeSelect?: (node: TreeNode) => void;
    selectedNodeId?: string;
    className?: string;
}

interface TreeNodeItemProps {
    node: TreeNode;
    level: number;
    onSelect?: (node: TreeNode) => void;
    selectedNodeId?: string;
}

function getNodeIcon(type?: string) {
    const t = type?.toUpperCase() || 'OTHER';
    switch (t) {
        case 'FACILITY':
            return <Factory className="size-4 text-cyan-400" />;
        case 'PRODUCTION':
            return <Cpu className="size-4 text-emerald-400" />;
        case 'WAREHOUSE':
            return <Box className="size-4 text-amber-400" />;
        case 'LOGISTICS':
            return <Truck className="size-4 text-indigo-400" />;
        case 'QUALITY':
            return <ShieldCheck className="size-4 text-rose-400" />;
        default:
            return <Package className="size-4 text-slate-400" />;
    }
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({ node, level, onSelect, selectedNodeId }) => {
    const [isExpanded, setIsExpanded] = React.useState(node.isExpanded || false);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeId === node.id;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSelect) {
            onSelect(node);
        }
    };

    return (
        <div className="flex flex-col select-none">
            <div
                className={cn(
                    'flex items-center gap-2 py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm transition-colors',
                    isSelected ? 'bg-accent text-accent-foreground font-medium' : 'text-foreground',
                )}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={handleSelect}>
                <div
                    className={cn(
                        'flex items-center justify-center size-5 shrink-0 text-muted-foreground hover:text-foreground transition-colors',
                        !hasChildren && 'opacity-0 pointer-events-none',
                    )}
                    onClick={hasChildren ? handleToggle : undefined}>
                    {hasChildren && (isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />)}
                </div>
                {getNodeIcon(node.type)}
                <span className="truncate">{node.label}</span>
            </div>
            {hasChildren && isExpanded && (
                <div className="flex flex-col">
                    {node.children?.map((child) => (
                        <TreeNodeItem key={child.id} node={child} level={level + 1} onSelect={onSelect} selectedNodeId={selectedNodeId} />
                    ))}
                </div>
            )}
        </div>
    );
};

export function NodeTreeView({ data, onNodeSelect, selectedNodeId, className }: NodeTreeViewProps) {
    return (
        <div className={cn('flex flex-col w-full overflow-y-auto', className)}>
            {data.map((node) => (
                <TreeNodeItem key={node.id} node={node} level={0} onSelect={onNodeSelect} selectedNodeId={selectedNodeId} />
            ))}
        </div>
    );
}
