import { useEffect, useState, useMemo } from 'react';
import { Loader2, Plus, Blocks } from 'lucide-react';
import { facilitiesService } from '@/features/facilities/services/facilities.service';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { NodeTreeView, type TreeNode } from '@/shared/components/ui/node-tree-view';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { SlideOutDrawer } from '@/shared/components/ui/slide-out-drawer';
import { Label } from '@/shared/components/ui/label';

export function FacilitiesPage() {
    const [nodes, setNodes] = useState<FacilityListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<FacilityListItem>>({});

    const fetchNodes = async () => {
        try {
            const data = await facilitiesService.listFacilities();
            setNodes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setNodes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNodes();
    }, []);

    const treeData = useMemo(() => {
        const map = new Map<string, TreeNode>();
        const roots: TreeNode[] = [];

        nodes.forEach((n) => {
            map.set(n.id, {
                id: n.id,
                label: n.name,
                type: n.path?.toLowerCase().includes('factory')
                    ? 'factory'
                    : n.path?.toLowerCase().includes('area')
                      ? 'area'
                      : n.path?.toLowerCase().includes('line')
                        ? 'line'
                        : n.path?.toLowerCase().includes('station')
                          ? 'station'
                          : 'other',
                children: [],
            });
        });

        nodes.forEach((n) => {
            const treeNode = map.get(n.id);
            if (treeNode) {
                if (n.parentId && map.has(n.parentId)) {
                    map.get(n.parentId)!.children!.push(treeNode);
                } else {
                    roots.push(treeNode);
                }
            }
        });

        const filterTree = (nodesList: TreeNode[]): TreeNode[] => {
            if (!search) return nodesList;
            return nodesList.reduce((acc: TreeNode[], node) => {
                const matches = node.label.toLowerCase().includes(search.toLowerCase());
                const filteredChildren = filterTree(node.children || []);
                if (matches || filteredChildren.length > 0) {
                    acc.push({ ...node, children: filteredChildren, isExpanded: true });
                }
                return acc;
            }, []);
        };

        return filterTree(roots);
    }, [nodes, search]);

    const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await facilitiesService.createFacility({ ...formData, parentId: selectedNodeId });
            setIsCreateOpen(false);
            setFormData({});
            await fetchNodes();
        } catch (err) {
            console.error('Error creating node', err);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Digital Twin</h1>
                    <p className="text-slate-400">Navigate the generic node hierarchy.</p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
                {/* Left Pane: Tree View */}
                <Card className="w-1/3 min-w-[300px] flex flex-col bg-slate-900/50 border-slate-700/50">
                    <CardHeader className="border-b border-slate-800 pb-4 shrink-0">
                        <div className="flex gap-2 mb-2">
                            <Input placeholder="Search nodes..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 bg-slate-800/50" />
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 shrink-0"
                                onClick={() => {
                                    setFormData({});
                                    setIsCreateOpen(true);
                                }}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin text-slate-500" />
                            </div>
                        ) : treeData.length === 0 ? (
                            <div className="text-center p-8 text-slate-500 text-sm">No nodes found.</div>
                        ) : (
                            <NodeTreeView data={treeData} selectedNodeId={selectedNodeId} onNodeSelect={(n) => setSelectedNodeId(n.id)} />
                        )}
                    </CardContent>
                </Card>

                {/* Right Pane: Detail View */}
                <Card className="flex-1 flex flex-col bg-slate-900/50 border-slate-700/50 overflow-hidden relative">
                    {selectedNode ? (
                        <>
                            <CardHeader className="border-b border-slate-800 pb-4 shrink-0 bg-slate-900/80 z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl text-white mb-2">{selectedNode.name}</CardTitle>
                                        <CardDescription className="text-slate-400 font-mono text-xs">{selectedNode.path || selectedNode.id}</CardDescription>
                                    </div>
                                    <StatusBadge status={selectedNode.status || 'IDLE'} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                                <Tabs defaultValue="overview" className="flex-1 flex flex-col w-full h-full">
                                    <div className="px-6 border-b border-slate-800 bg-slate-900/50 shrink-0">
                                        <TabsList className="bg-transparent border-0 mt-2">
                                            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
                                                Overview
                                            </TabsTrigger>
                                            <TabsTrigger value="contents" className="data-[state=active]:bg-slate-800">
                                                Contents
                                            </TabsTrigger>
                                            <TabsTrigger value="capabilities" className="data-[state=active]:bg-slate-800">
                                                Capabilities
                                            </TabsTrigger>
                                            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-800">
                                                Activity Log
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        <TabsContent value="overview" className="m-0 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                                                    <h3 className="text-sm font-medium text-slate-400 mb-1">Status</h3>
                                                    <p className="text-white">{selectedNode.status || 'Unknown'}</p>
                                                </div>
                                                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                                                    <h3 className="text-sm font-medium text-slate-400 mb-1">Path</h3>
                                                    <p className="text-white font-mono text-sm">{selectedNode.path || 'N/A'}</p>
                                                </div>
                                            </div>
                                            {selectedNode.attributes && Object.keys(selectedNode.attributes).length > 0 && (
                                                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                                                    <h3 className="text-sm font-medium text-slate-400 mb-3">Attributes</h3>
                                                    <pre className="text-xs text-green-400 font-mono overflow-x-auto">{JSON.stringify(selectedNode.attributes, null, 2)}</pre>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="contents" className="m-0">
                                            <div className="text-sm text-slate-400 text-center py-10 border border-dashed border-slate-700 rounded-lg">
                                                Inventory items or sub-nodes will appear here.
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="capabilities" className="m-0">
                                            <div className="space-y-2">
                                                {selectedNode.capabilities && selectedNode.capabilities.length > 0 ? (
                                                    selectedNode.capabilities.map((cap) => (
                                                        <div key={cap} className="bg-slate-800/50 p-3 rounded border border-slate-700/50 text-sm text-cyan-400 font-mono">
                                                            {cap}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-slate-500">No specific capabilities defined.</p>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="activity" className="m-0">
                                            <div className="space-y-4">
                                                <p className="text-sm text-slate-500">Traceability feed loads here...</p>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
                            <Blocks className="size-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium text-slate-300">No Node Selected</p>
                            <p className="max-w-xs mt-2 text-sm">Select a node from the tree to view its details, hierarchy contents, and capabilities.</p>
                        </div>
                    )}
                </Card>
            </div>

            <SlideOutDrawer
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create Node"
                description={selectedNodeId ? `Creating a child node under ${selectedNode?.name}` : 'Creating a root node.'}>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Node Name</Label>
                        <Input required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Assembly Station 1" />
                    </div>
                    <div className="space-y-2">
                        <Label>Definition ID (Optional)</Label>
                        <Input
                            value={formData.definitionId || ''}
                            onChange={(e) => setFormData({ ...formData, definitionId: e.target.value })}
                            placeholder="UUID of node definition"
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Node</Button>
                    </div>
                </form>
            </SlideOutDrawer>
        </div>
    );
}
