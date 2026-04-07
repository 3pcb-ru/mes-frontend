import { useEffect, useState, useMemo } from 'react';
import { Loader2, Plus, Blocks, BoxSelect } from 'lucide-react';
import { toast } from 'sonner';
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
import { useFormValidation } from '@/shared/hooks/use-form-validation';
import { FormError } from '@/shared/components/ui/form-error';
import { TableView } from '@/shared/components/ui/table-view';
import { NodeDiagramView } from '@/shared/components/ui/node-diagram-view';
import { cn } from '@/shared/lib/utils';
import { LayoutGrid, AlertTriangle, Trash2, ArrowRightLeft, Pencil, ArrowUpToLine } from 'lucide-react';
import { NODE_STATUS_CHANGE_REASONS, NODE_TYPES, type NodeType, type NodeStatusChangeReason } from '@/features/facilities/types/facilities.types';
import { getNodeType } from '@/shared/lib/node-utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/shared/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

export function FacilitiesPage() {
    const [nodes, setNodes] = useState<FacilityListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<FacilityListItem>>({});
    const { validationErrors, handleApiError, clearError, resetErrors } = useFormValidation();
    const [viewMode, setViewMode] = useState<'tree' | 'diagram'>('tree');

    // Deletion states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Status Change states
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<string>('');
    const [editName, setEditName] = useState<string>('');
    const [editType, setEditType] = useState<NodeType>('OTHER');
    const [statusReason, setStatusReason] = useState<NodeStatusChangeReason>('MAINTENANCE');

    // Move states
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [newParentId, setNewParentId] = useState<string | null>(null);
    const fetchNodes = async () => {
        try {
            const result = await facilitiesService.listFacilities();
            // Fallback for paginated or wrapped responses
            const data = Array.isArray(result) ? result : (result as any)?.data || [];
            setNodes(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Failed to load nodes');
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
                type: (n.type || getNodeType(`${n.name} ${n.path || ''}`)) as any,
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

    const handleDelete = async () => {
        if (!selectedNodeId) return;
        setIsDeleting(true);
        try {
            const result = await facilitiesService.deleteFacility(selectedNodeId);
            toast.success(result?.message || 'Node deleted successfully');
            setSelectedNodeId(undefined);
            setIsDeleteDialogOpen(false);
            await fetchNodes();
        } catch (err: any) {
            console.error('Error deleting node', err);
            toast.error(err?.message || 'Failed to delete node. Check for active children or Work Orders.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateNode = async () => {
        if (!selectedNodeId) return;
        try {
            // Update name or type if changed
            if (editName !== (selectedNode?.name || '') || editType !== (selectedNode?.type || 'OTHER')) {
                await facilitiesService.updateFacility(selectedNodeId, {
                    name: editName,
                    type: editType,
                });
            }
            
            // Update status if changed or if reason provided
            if (newStatus !== (selectedNode?.status || 'IDLE')) {
                await facilitiesService.changeStatus(selectedNodeId, {
                    status: newStatus,
                    reason: statusReason,
                });
            }
            
            toast.success('Node updated successfully');
            setIsStatusDialogOpen(false);
            await fetchNodes();
        } catch (err: any) {
            console.error('Error updating node', err);
            toast.error(err?.message || 'Failed to update node');
        }
    };

    const handleMove = async (overrideParentId?: string | null) => {
        if (!selectedNodeId) return;
        try {
            const pId = overrideParentId !== undefined ? overrideParentId : newParentId;
            await facilitiesService.moveFacility(selectedNodeId, pId);
            toast.success('Node moved successfully');
            setIsMoveDialogOpen(false);
            await fetchNodes();
        } catch (err: any) {
            console.error('Error moving node', err);
            toast.error(err?.message || 'Failed to move node');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        resetErrors();
        try {
            const payload = { 
                ...formData, 
                parentId: formData.parentId || selectedNodeId || undefined,
                definitionId: formData.definitionId || undefined
            };

            await facilitiesService.createFacility(payload);
            toast.success('Node created successfully');
            setIsCreateOpen(false);
            setFormData({});
            await fetchNodes();
        } catch (err: any) {
            console.error('Error creating node', err);
            if (!handleApiError(err)) {
                toast.error(err?.message || 'Failed to create node');
            }
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Layout</h1>
                    <p className="text-slate-400">Map out your facility structure and manage production lines, from factory floors to individual workstations.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    <Button
                        variant={viewMode === 'tree' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn("h-8 gap-2", viewMode === 'tree' ? "bg-slate-800 text-white" : "text-slate-400")}
                        onClick={() => setViewMode('tree')}
                    >
                        <Blocks className="h-4 w-4" />
                        Hierarchy
                    </Button>
                    <Button
                        variant={viewMode === 'diagram' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn("h-8 gap-2", viewMode === 'diagram' ? "bg-slate-800 text-white" : "text-slate-400")}
                        onClick={() => setViewMode('diagram')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Layout Mode
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
                {viewMode === 'tree' ? (
                    <Card className="w-1/3 min-w-[300px] flex flex-col bg-slate-900/50 border-slate-700/50 dark text-slate-300">
                        <CardHeader className="border-b border-slate-800 pb-4 shrink-0">
                            <div className="flex gap-2 mb-2">
                                <Input placeholder="Search nodes..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 bg-slate-800/50 text-slate-200" />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-9 w-9 shrink-0 border-slate-700 hover:bg-slate-800 text-slate-300"
                                    onClick={() => {
                                        setFormData({});
                                        resetErrors();
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
                ) : (
                    <div className="flex-1 min-h-0 dark">
                        <NodeDiagramView 
                            nodes={nodes} 
                            selectedNodeId={selectedNodeId} 
                            onNodeSelect={(id: string) => setSelectedNodeId(id)}
                            onAdd={(parentId) => {
                                setFormData({ parentId });
                                resetErrors();
                                setIsCreateOpen(true);
                            }}
                        />
                    </div>
                )}

                {/* Right Pane: Detail View */}
                <Card className={cn(
                    "flex flex-col bg-slate-900/50 border-slate-700/50 overflow-hidden relative dark text-slate-300",
                    viewMode === 'tree' ? "flex-1" : "w-[400px]"
                )}>
                    {selectedNode ? (
                        <>
                            <CardHeader className="border-b border-slate-800 pb-4 shrink-0 bg-slate-900/80 z-10">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CardTitle className="text-xl text-white truncate max-w-full" title={selectedNode.name}>
                                                {selectedNode.name}
                                            </CardTitle>
                                        </div>
                                        <div className="mt-1">
                                            <StatusBadge status={selectedNode.status || 'IDLE'} className="text-[10px] px-1.5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-slate-400 hover:text-cyan-400"
                                                title="Update Node"
                                                onClick={() => {
                                                    setEditName(selectedNode.name);
                                                    setNewStatus(selectedNode.status || 'IDLE');
                                                    setEditType((selectedNode.type as NodeType) || 'OTHER');
                                                    setIsStatusDialogOpen(true);
                                                }}>
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-slate-400 hover:text-amber-400"
                                                title="Move Node"
                                                onClick={() => {
                                                    setNewParentId(selectedNode.parentId || null);
                                                    setIsMoveDialogOpen(true);
                                                }}>
                                                <ArrowRightLeft className="size-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-slate-400 hover:text-red-400"
                                                title="Delete Node"
                                                onClick={() => setIsDeleteDialogOpen(true)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Move Node Dialog */}
                            <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <DialogHeader>
                                        <DialogTitle>Move Node</DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Select a new parent for "{selectedNode.name}". This will recalculate the hierarchical path.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label className="text-slate-400 text-xs mb-2 block">New Parent Node</Label>
                                        <TableView
                                            value={newParentId || ''}
                                            initialLabel={nodes.find(n => n.id === newParentId)?.name}
                                            onChange={(val) => setNewParentId(val || null)}
                                            fetchData={async () => {
                                                if (!selectedNodeId || !selectedNode) return nodes;
                                                // Filter out the node itself and its descendants to prevent circularity
                                                return nodes.filter(n => n.id !== selectedNodeId && (n.path === selectedNode.path || !n.path.startsWith(selectedNode.path + '.')));
                                            }}
                                            placeholder="Select new parent (or leave empty for Root)..."
                                        />
                                    </div>
                                    <DialogFooter className="sm:justify-between gap-4 flex-col sm:flex-row">
                                        <div className="flex-1">
                                            {selectedNode.parentId && (
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full sm:w-auto h-9 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 gap-2"
                                                    onClick={() => {
                                                        setNewParentId(null);
                                                        // Execute move immediately with null override
                                                        handleMove(null);
                                                    }}
                                                >
                                                    <ArrowUpToLine className="size-4 text-amber-400" />
                                                    Make Independent (Set as Root)
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <DialogClose asChild>
                                                <Button variant="outline" className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button onClick={() => handleMove()} className="bg-cyan-600 hover:bg-cyan-700 text-white">Move Node</Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Edit Node Dialog */}
                            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <DialogHeader>
                                        <DialogTitle>Update Node</DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Modify identification and status for "{selectedNode.name}"
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs">Node Name</Label>
                                            <Input 
                                                value={editName} 
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="bg-slate-800/50 border-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs">Node Type</Label>
                                            <Select value={editType} onValueChange={(val: any) => setEditType(val)}>
                                                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                                                    <SelectValue placeholder="Select type..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-800">
                                                    {NODE_TYPES.map((t) => (
                                                        <SelectItem key={t.value} value={t.value} className="text-slate-200 focus:bg-slate-800">
                                                            {t.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs">Status</Label>
                                            <Input 
                                                value={newStatus} 
                                                onChange={(e) => setNewStatus(e.target.value.toUpperCase())}
                                                className="bg-slate-800/50 border-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs">Reason for Update</Label>
                                            <Select value={statusReason} onValueChange={(val: any) => setStatusReason(val)}>
                                                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                                                    <SelectValue placeholder="Select reason..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-800">
                                                    {NODE_STATUS_CHANGE_REASONS.map((r) => (
                                                        <SelectItem key={r.value} value={r.value} className="text-slate-200 focus:bg-slate-800">
                                                            {r.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button onClick={handleUpdateNode} className="bg-cyan-600 hover:bg-cyan-700 text-white">Save Changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <AlertTriangle className="text-red-500 size-5" />
                                            Delete Node
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Are you sure you want to delete "{selectedNode.name}"?
                                            <br/><br/>
                                            If the node has history, it will be archived. If it has no history, it will be permanently removed.
                                            <strong> Deletion will fail if the node has active child nodes or is referenced in Work Orders.</strong>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button 
                                            onClick={handleDelete} 
                                            disabled={isDeleting}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            {isDeleting ? "Deleting..." : "Delete Node"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                                <Tabs defaultValue="overview" className="flex-1 flex flex-col w-full h-full">
                                    <div className="px-6 border-b border-slate-800 bg-slate-900/50 shrink-0">
                                        <TabsList className="bg-transparent border-0 mt-2">
                                            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                Overview
                                            </TabsTrigger>
                                            <TabsTrigger value="contents" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                Contents
                                            </TabsTrigger>
                                            <TabsTrigger value="capabilities" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                Capabilities
                                            </TabsTrigger>
                                            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                Activity Log
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        <TabsContent value="overview" className="m-0 space-y-4">
                                            <div className="bg-slate-800/20 rounded-lg border border-slate-800/50 overflow-hidden divide-y divide-slate-800/50">
                                                <div className="px-4 py-3 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-400">Node Type</span>
                                                    <span className="text-sm text-cyan-400 font-bold uppercase tracking-wider">
                                                        {selectedNode.type || getNodeType(`${selectedNode.name} ${selectedNode.path || ''}`)}
                                                    </span>
                                                </div>
                                                <div className="px-4 py-3 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-400">Status</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-white">{selectedNode.status || 'Unknown'}</span>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-3 flex justify-between items-center min-w-0">
                                                    <span className="text-sm font-medium text-slate-400 shrink-0 mr-4">Path</span>
                                                    <span className="text-sm text-white font-mono truncate ml-auto" title={selectedNode.path || 'N/A'}>
                                                        {selectedNode.path || 'N/A'}
                                                    </span>
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
                description={formData.parentId ? `Creating a child node under ${nodes.find(n => n.id === formData.parentId)?.name}` : 'Creating a root node.'}>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                    {formData.parentId && (
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <Label className="text-cyan-400 text-xs mb-1 block">Parent Node (Locked)</Label>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <BoxSelect className="size-4 text-cyan-500" />
                                {nodes.find(n => n.id === formData.parentId)?.name}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Node Name</Label>
                        <Input
                            required
                            value={formData.name || ''}
                            aria-invalid={!!validationErrors.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                clearError('name');
                            }}
                            placeholder="e.g. Assembly Station 1"
                        />
                        <FormError message={validationErrors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label>Node Type</Label>
                        <Select 
                            value={formData.type as string || 'OTHER'} 
                            onValueChange={(val) => {
                                setFormData({ ...formData, type: val as NodeType });
                                clearError('type');
                            }}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700">
                                <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                {NODE_TYPES.map((t) => (
                                    <SelectItem key={t.value} value={t.value} className="text-slate-200 focus:bg-slate-800">
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormError message={validationErrors.type} />
                    </div>
                    <div className="space-y-2">
                        <Label>Definition ID (Optional)</Label>
                        <TableView
                            value={formData.definitionId || ''}
                            onChange={(val) => {
                                setFormData({ ...formData, definitionId: val });
                                clearError('definitionId');
                            }}
                            fetchData={() => Promise.resolve([]) /* TODO: Wire up to Definitions API when available */}
                            placeholder="Select definition..."
                            hasError={!!validationErrors.definitionId}
                        />
                        <FormError message={validationErrors.definitionId} />
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
