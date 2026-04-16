import { useCallback, useMemo, useEffect, useState } from 'react';
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
    type OnConnectStart,
    type OnConnectEnd,
} from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';

import { CustomNode, type CustomNodeData } from './custom-node';
import type { FacilityListItem, NodeType } from '@/features/facilities/types/facilities.types';
import { Button } from './button';
import { Maximize2, LayoutGrid, Plus } from 'lucide-react';
import { getNodeType } from '@/shared/lib/node-utils';
import { useTranslation } from 'react-i18next';

const nodeTypes = {
    custom: CustomNode,
};

type NodeDiagramViewProps = {
    nodes: FacilityListItem[];
    selectedNodeId?: string;
    onNodeSelect: (nodeId: string) => void;
    onAdd?: (parentId?: string) => void;
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 240;
const nodeHeight = 84; // Adjusted for better card fit

const getLayOutedElements = (nodes: Node<CustomNodeData>[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });

    dagreGraph.nodes().forEach((n) => dagreGraph.removeNode(n));
    dagreGraph.edges().forEach((e) => dagreGraph.removeEdge(e.v, e.w));

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

    const newEdges = edges.map((edge) => ({
        ...edge,
        sourceHandle: isHorizontal ? 'right-source' : 'bottom-source',
        targetHandle: isHorizontal ? 'left-target' : 'top-target',
    }));

    return { nodes: newNodes, edges: newEdges };
};

export function NodeDiagramView({ nodes: rawNodes, selectedNodeId, onNodeSelect, onAdd }: NodeDiagramViewProps) {
    const { t } = useTranslation();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        const flowNodes: Node<CustomNodeData>[] = rawNodes.map((n) => ({
            id: n.id,
            type: 'custom',
            data: {
                id: n.id,
                label: n.name,
                type: n.type || getNodeType(`${n.name} ${n.path || ''}`),
                status: n.status || 'IDLE',
                path: n.path,
                selected: false,
            },
            position: { x: 0, y: 0 },
            selected: false,
        }));

        const flowEdges: Edge[] = rawNodes
            .filter((n) => n.parentId)
            .map((n) => ({
                id: `e-${n.parentId}-${n.id}`,
                source: n.parentId!,
                target: n.id,
                sourceHandle: 'bottom-source', // Default for TB layout
                targetHandle: 'top-target', // Default for TB layout
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

        return getLayOutedElements(flowNodes, flowEdges);
    }, [rawNodes]);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    // Synchronize selection state without resetting positions if the nodes already exist in state
    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                selected: node.id === selectedNodeId,
                data: {
                    ...node.data,
                    selected: node.id === selectedNodeId,
                },
            })),
        );
    }, [selectedNodeId, setNodes]);

    const [connectionStartNodeId, setConnectionStartNodeId] = useState<string | null>(null);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            onNodeSelect(node.id);
        },
        [onNodeSelect],
    );

    const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
        setConnectionStartNodeId(nodeId);
    }, []);

    const onConnectEnd: OnConnectEnd = useCallback(
        (event) => {
            if (!connectionStartNodeId || !onAdd) return;

            const target = event.target as HTMLElement;
            const targetIsPane = target.classList.contains('react-flow__pane');
            if (targetIsPane) {
                onAdd(connectionStartNodeId);
            }
            setConnectionStartNodeId(null);
        },
        [connectionStartNodeId, onAdd],
    );

    const onLayout = useCallback(
        (direction: string) => {
            const { nodes: layOutedNodes, edges: layOutedEdges } = getLayOutedElements(nodes, edges, direction);
            setNodes([...layOutedNodes]);
            setEdges([...layOutedEdges]);
        },
        [nodes, edges, setNodes, setEdges],
    );

    return (
        <div className="w-full h-full bg-slate-950/20 rounded-xl overflow-hidden border border-slate-800/50 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                className="bg-slate-950/40"
                minZoom={0.2}
                maxZoom={2}>
                <Background color="#1e293b" variant={BackgroundVariant.Dots} gap={20} size={1} />
                <Controls className="bg-slate-900 border-slate-800 text-white fill-white" />
                <MiniMap nodeColor="#334155" maskColor="rgba(0, 0, 0, 0.7)" maskStrokeColor="#06b6d4" />
                <Panel position="top-left">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-slate-900/80 backdrop-blur-sm border-slate-800 hover:bg-slate-800 text-cyan-400 font-bold shadow-lg"
                        onClick={() => onAdd?.()}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        {t('common.components.node_diagram.create_node')}
                    </Button>
                </Panel>
                <Panel position="top-right" className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => onLayout('TB')}>
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        {t('common.components.node_diagram.top_down')}
                    </Button>
                    <Button size="sm" variant="outline" className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => onLayout('LR')}>
                        <Maximize2 className="w-4 h-4 mr-2" />
                        {t('common.components.node_diagram.left_right')}
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    );
}
