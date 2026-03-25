import { useCallback, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    ConnectionLineType,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    Panel,
    MarkerType,
    BackgroundVariant,
    Position,
} from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';

import { CustomNode, type CustomNodeData } from './custom-node';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import { Button } from './button';
import { Maximize2, LayoutGrid } from 'lucide-react';

const nodeTypes = {
    custom: CustomNode,
};

type NodeDiagramViewProps = {
    nodes: FacilityListItem[];
    selectedNodeId?: string;
    onNodeSelect: (nodeId: string) => void;
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 240;
const nodeHeight = 84; // Adjusted for better card fit

const getLayoutedElements = (nodes: Node<CustomNodeData>[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });

    dagreGraph.nodes().forEach(n => dagreGraph.removeNode(n));
    dagreGraph.edges().forEach(e => dagreGraph.removeEdge(e.v, e.w));

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: newNodes, edges };
};

const getNodeType = (path?: string) => {
    const p = path?.toLowerCase() || '';
    if (p.includes('factory')) return 'factory';
    if (p.includes('area')) return 'area';
    if (p.includes('line')) return 'line';
    if (p.includes('station')) return 'station';
    return 'other';
};

export function NodeDiagramView({ nodes: rawNodes, selectedNodeId, onNodeSelect }: NodeDiagramViewProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        const flowNodes: Node<CustomNodeData>[] = rawNodes.map((n) => ({
            id: n.id,
            type: 'custom',
            data: {
                id: n.id,
                label: n.name,
                type: getNodeType(n.path),
                status: n.status || 'IDLE',
                selected: n.id === selectedNodeId,
            },
            position: { x: 0, y: 0 },
            selected: n.id === selectedNodeId,
        }));

        const flowEdges: Edge[] = rawNodes
            .filter((n) => n.parentId)
            .map((n) => ({
                id: `e-${n.parentId}-${n.id}`,
                source: n.parentId!,
                target: n.id,
                type: ConnectionLineType.SmoothStep,
                animated: true,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: '#06b6d4',
                },
                style: { stroke: '#06b6d4', strokeWidth: 2 },
            }));

        return getLayoutedElements(flowNodes, flowEdges);
    }, [rawNodes, selectedNodeId]);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    const onNodeClick = useCallback((_: any, node: Node) => {
        onNodeSelect(node.id);
    }, [onNodeSelect]);

    const onLayout = useCallback(
        (direction: string) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges, setNodes, setEdges]
    );

    return (
        <div className="w-full h-full bg-slate-950/20 rounded-xl overflow-hidden border border-slate-800/50 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                className="bg-slate-950/40"
                minZoom={0.2}
                maxZoom={2}
            >
                <Background color="#1e293b" variant={BackgroundVariant.Dots} gap={20} size={1} />
                <Controls className="bg-slate-900 border-slate-800 text-white fill-white" />
                <MiniMap 
                    className="bg-slate-900 border-slate-800" 
                    nodeColor="#334155"
                    maskColor="rgba(0, 0, 0, 0.7)"
                    maskStrokeColor="#06b6d4"
                />
                <Panel position="top-right" className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
                        onClick={() => onLayout('TB')}
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Top Down
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
                        onClick={() => onLayout('LR')}
                    >
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Left Right
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    );
}
