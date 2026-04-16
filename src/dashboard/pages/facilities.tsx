import { useEffect, useState, useMemo } from 'react';
import { Loader2, Plus, FolderTree, BoxSelect } from 'lucide-react';
import { toast } from 'sonner';
import { useFacilities } from '@/features/facilities/store/facilities.store';
import { type CreateFacilityDto } from '@/features/facilities/types/facilities.schema';
import type { ApiError } from '@/shared/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { NodeTreeView, type TreeNode } from '@/shared/components/ui/node-tree-view';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { SlideOutDrawer } from '@/shared/components/ui/slide-out-drawer';
import { Label } from '@/shared/components/ui/label';
import { useFormValidation } from '@/shared/hooks/use-form-validation';
import { useTranslation } from 'react-i18next';
import { FormError } from '@/shared/components/ui/form-error';
import { TableView } from '@/shared/components/ui/table-view';
import { NodeDiagramView } from '@/shared/components/ui/node-diagram-view';
import { cn } from '@/shared/lib/utils';
import { Network, AlertTriangle, Trash2, ArrowRightLeft, Pencil, ArrowUpToLine } from 'lucide-react';
import { NODE_STATUS_CHANGE_REASONS, NODE_TYPES, type NodeType, type NodeStatusChangeReason } from '@/features/facilities/types/facilities.types';
import { getNodeType } from '@/shared/lib/node-utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export function FacilitiesPage() {
    const { nodes, isLoading, selectedNodeId, selectedNode, fetchNodes, setSelectedNodeId, createFacility, updateFacility, moveFacility, deleteFacility, changeStatus } =
        useFacilities();

    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<CreateFacilityDto>>({});
    const { validationErrors, handleApiError, clearError, resetErrors } = useFormValidation();
    const { t } = useTranslation();
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

    useEffect(() => {
        fetchNodes().catch((err: ApiError) => {
            console.error('Initial load failed', err);
            toast.error(err?.message || t('dashboard.facilities.messages.load_failed'));
        });
    }, [fetchNodes]);

    const treeData = useMemo(() => {
        const map = new Map<string, TreeNode>();
        const roots: TreeNode[] = [];

        nodes.forEach((n) => {
            const nodeType = (n.type || n.definition?.type || getNodeType(`${n.name} ${n.path || ''}`)) as NodeType;
            map.set(n.id, {
                id: n.id,
                label: n.name,
                type: nodeType,
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

    // Removed selectedNode memo as it's provided by useFacilities()

    const handleDelete = async () => {
        if (!selectedNodeId) return;
        setIsDeleting(true);
        try {
            await deleteFacility(selectedNodeId);
            toast.success(t('dashboard.facilities.messages.delete_success'));
            setIsDeleteDialogOpen(false);
        } catch (err) {
            const apiError = err as ApiError;
            console.error('Error deleting node', apiError);
            toast.error(apiError?.message || t('dashboard.facilities.messages.delete_failed'));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateNode = async () => {
        if (!selectedNodeId) return;
        try {
            // Update name or type if changed
            if (editName !== (selectedNode?.name || '') || editType !== (selectedNode?.type || 'OTHER')) {
                await updateFacility(selectedNodeId, {
                    name: editName,
                    type: editType,
                });
            }

            // Update status if changed or if reason provided
            if (newStatus !== (selectedNode?.status || 'IDLE')) {
                await changeStatus(selectedNodeId, {
                    status: newStatus,
                    reason: statusReason,
                });
            }

            toast.success(t('dashboard.facilities.messages.update_success'));
            setIsStatusDialogOpen(false);
        } catch (err) {
            const apiError = err as ApiError;
            console.error('Error updating node', apiError);
            toast.error(apiError?.message || t('dashboard.facilities.messages.update_failed'));
        }
    };

    const handleMove = async (overrideParentId?: string | null) => {
        if (!selectedNodeId) return;
        try {
            const pId = overrideParentId !== undefined ? overrideParentId : newParentId;
            await moveFacility(selectedNodeId, pId);
            toast.success(t('dashboard.facilities.messages.move_success'));
            setIsMoveDialogOpen(false);
        } catch (err) {
            const apiError = err as ApiError;
            console.error('Error moving node', apiError);
            toast.error(apiError?.message || t('dashboard.facilities.messages.move_failed'));
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        resetErrors();
        try {
            const payload: CreateFacilityDto = {
                name: formData.name || '',
                parentId: formData.parentId || selectedNodeId || null,
                definitionId: formData.definitionId || '',
                type: formData.type || 'OTHER',
            };

            await createFacility(payload);
            toast.success(t('dashboard.facilities.messages.create_success'));
            setIsCreateOpen(false);
            setFormData({});
        } catch (err) {
            const apiError = err as ApiError;
            console.error('Error creating node', apiError);
            if (!handleApiError(apiError)) {
                toast.error(apiError?.message || t('dashboard.facilities.messages.create_failed'));
            }
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{t('dashboard.facilities.header.title')}</h1>
                    <p className="text-slate-400">{t('dashboard.facilities.header.description')}</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    <Button variant={viewMode === 'tree' ? 'secondary' : 'ghost'} size="sm" className="h-8 gap-2" onClick={() => setViewMode('tree')}>
                        <FolderTree className="h-4 w-4" />
                        {t('dashboard.facilities.buttons.hierarchy')}
                    </Button>
                    <Button variant={viewMode === 'diagram' ? 'secondary' : 'ghost'} size="sm" className="h-8 gap-2" onClick={() => setViewMode('diagram')}>
                        <Network className="h-4 w-4" />
                        {t('dashboard.facilities.buttons.layout_mode')}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
                {viewMode === 'tree' ? (
                    <Card className="w-1/3 min-w-[300px] flex flex-col bg-slate-900/50 border-slate-700/50 dark text-slate-300">
                        <CardHeader className="border-b border-slate-800 pb-4 shrink-0">
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder={t('dashboard.facilities.tree.search_placeholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-9 bg-slate-800/50 text-slate-200"
                                />
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
                                <div className="text-center p-8 text-slate-500 text-sm">{t('dashboard.facilities.tree.no_nodes')}</div>
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
                <Card
                    className={cn('flex flex-col bg-slate-900/50 border-slate-700/50 overflow-hidden relative dark text-slate-300', viewMode === 'tree' ? 'flex-1' : 'w-[400px]')}>
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
                                                title={t('dashboard.facilities.buttons.update_node')}
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
                                                title={t('dashboard.facilities.buttons.move_node')}
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
                                                title={t('dashboard.facilities.buttons.delete_node')}
                                                onClick={() => setIsDeleteDialogOpen(true)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Move Node Dialog */}
                            <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
                                <DialogContent className="bg-slate-950/90 border-slate-800 text-slate-200 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
                                    <DialogHeader className="space-y-3">
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                            <ArrowRightLeft className="h-6 w-6 text-cyan-400" />
                                            {t('dashboard.facilities.dialogs.move.title')}
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-400 text-sm leading-relaxed">
                                            {t('dashboard.facilities.dialogs.move.description', { name: selectedNode.name })}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-6 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('dashboard.facilities.dialogs.move.new_parent')}</Label>
                                            <TableView
                                                value={newParentId || ''}
                                                initialLabel={nodes.find((n) => n.id === newParentId)?.name}
                                                onChange={(val) => setNewParentId(val || null)}
                                                fetchData={async () => {
                                                    if (!selectedNodeId || !selectedNode) return nodes;
                                                    // Filter out the node itself and its descendants to prevent circularity
                                                    return nodes.filter(
                                                        (n) => n.id !== selectedNodeId && (n.path === selectedNode.path || !n.path.startsWith(selectedNode.path + '.')),
                                                    );
                                                }}
                                                placeholder={t('dashboard.facilities.dialogs.move.placeholder')}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            {selectedNode.parentId && (
                                                <Button
                                                    variant="outline"
                                                    className="w-full sm:w-auto h-9 bg-slate-900 border-slate-800 hover:bg-slate-800 text-amber-400 border-amber-500/10 hover:border-amber-500/30 gap-2 transition-all"
                                                    onClick={() => {
                                                        setNewParentId(null);
                                                        // Execute move immediately with null override
                                                        handleMove(null);
                                                    }}>
                                                    <ArrowUpToLine className="size-4" />
                                                    {t('dashboard.facilities.dialogs.move.make_independent')}
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setIsMoveDialogOpen(false)}>
                                                {t('dashboard.facilities.buttons.cancel')}
                                            </Button>
                                            <Button 
                                                onClick={() => handleMove()}
                                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/20"
                                            >
                                                {t('dashboard.facilities.buttons.move_node')}
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Edit Node Dialog */}
                            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                                <DialogContent className="bg-slate-950/90 border-slate-800 text-slate-200 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
                                    <DialogHeader className="space-y-3">
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                            <Pencil className="h-6 w-6 text-indigo-400" />
                                            {t('dashboard.facilities.dialogs.update.title')}
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-400 text-sm">
                                            {t('dashboard.facilities.dialogs.update.description', { name: selectedNode.name })}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-5 py-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('dashboard.facilities.dialogs.update.node_name')}</Label>
                                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-slate-900/50 border-slate-800 focus:border-indigo-500/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('dashboard.facilities.dialogs.update.node_type')}</Label>
                                            <Select value={editType} onValueChange={(val: any) => setEditType(val)}>
                                                <SelectTrigger className="bg-slate-900/50 border-slate-800">
                                                    <SelectValue placeholder={t('dashboard.facilities.dialogs.update.select_type')} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                                                    {NODE_TYPES.map((t) => (
                                                        <SelectItem key={t.value} value={t.value} className="focus:bg-slate-800">
                                                            {t.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('dashboard.facilities.dialogs.update.status')}</Label>
                                            <Input value={newStatus} onChange={(e) => setNewStatus(e.target.value.toUpperCase())} className="bg-slate-900/50 border-slate-800 focus:border-indigo-500/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('dashboard.facilities.dialogs.update.reason')}</Label>
                                            <Select value={statusReason} onValueChange={(val: any) => setStatusReason(val)}>
                                                <SelectTrigger className="bg-slate-900/50 border-slate-800">
                                                    <SelectValue placeholder={t('dashboard.facilities.dialogs.update.select_reason')} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                                                    {NODE_STATUS_CHANGE_REASONS.map((r) => (
                                                        <SelectItem key={r.value} value={r.value} className="focus:bg-slate-800">
                                                            {r.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-6 border-t border-slate-800/50">
                                        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setIsStatusDialogOpen(false)}>
                                            {t('dashboard.facilities.buttons.cancel')}
                                        </Button>
                                        <Button 
                                            onClick={handleUpdateNode}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-500/20"
                                        >
                                            {t('dashboard.facilities.buttons.save_changes')}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogContent className="bg-slate-950/90 border-slate-800 text-slate-200 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 max-w-md">
                                    <DialogHeader className="space-y-3">
                                        <DialogTitle className="flex items-center gap-3 text-red-500 text-2xl font-bold">
                                            <AlertTriangle className="size-6" />
                                            {t('dashboard.facilities.dialogs.delete.title')}
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                                            {t('dashboard.facilities.dialogs.delete.confirm', { name: selectedNode.name })}
                                            <br />
                                            <br />
                                            <span className="text-slate-300">{t('dashboard.facilities.dialogs.delete.warning1')}</span>
                                            <strong className="text-red-400 ml-1 font-bold"> {t('dashboard.facilities.dialogs.delete.warning2')}</strong>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="pt-8 border-t border-slate-800/50">
                                        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setIsDeleteDialogOpen(false)}>
                                            {t('dashboard.facilities.buttons.cancel')}
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            onClick={handleDelete} 
                                            disabled={isDeleting}
                                            className="bg-red-600 hover:bg-red-500 text-white border-0 shadow-lg shadow-red-500/20 px-8"
                                        >
                                            {isDeleting ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>{t('dashboard.facilities.buttons.deleting')}</span>
                                                </div>
                                            ) : (
                                                t('dashboard.facilities.buttons.delete_node')
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                                <Tabs defaultValue="overview" className="flex-1 flex flex-col w-full h-full">
                                    <div className="px-6 border-b border-slate-800 bg-slate-900/50 shrink-0">
                                        <TabsList className="bg-transparent border-0 mt-2">
                                            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                {t('dashboard.facilities.tabs.overview')}
                                            </TabsTrigger>
                                            <TabsTrigger value="contents" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                {t('dashboard.facilities.tabs.contents')}
                                            </TabsTrigger>
                                            <TabsTrigger value="capabilities" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                {t('dashboard.facilities.tabs.capabilities')}
                                            </TabsTrigger>
                                            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white">
                                                {t('dashboard.facilities.tabs.activity')}
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        <TabsContent value="overview" className="m-0 space-y-4">
                                            <div className="bg-slate-800/20 rounded-lg border border-slate-800/50 overflow-hidden divide-y divide-slate-800/50">
                                                <div className="px-4 py-3 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-400">{t('dashboard.facilities.tabs.content.node_type')}</span>
                                                    <span className="text-sm text-cyan-400 font-bold uppercase tracking-wider">
                                                        {selectedNode.type || getNodeType(`${selectedNode.name} ${selectedNode.path || ''}`)}
                                                    </span>
                                                </div>
                                                <div className="px-4 py-3 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-400">{t('dashboard.facilities.dialogs.update.status')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-white">
                                                            {selectedNode.status
                                                                ? t(`common.components.status.${selectedNode.status.toUpperCase()}`)
                                                                : t('dashboard.facilities.tabs.content.unknown')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-3 flex justify-between items-center min-w-0">
                                                    <span className="text-sm font-medium text-slate-400 shrink-0 mr-4">{t('dashboard.facilities.tabs.content.path')}</span>
                                                    <span
                                                        className="text-sm text-white font-mono truncate ml-auto"
                                                        title={selectedNode.path || t('dashboard.facilities.tabs.content.na')}>
                                                        {selectedNode.path || t('dashboard.facilities.tabs.content.na')}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedNode.attributes && Object.keys(selectedNode.attributes).length > 0 && (
                                                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                                                    <h3 className="text-sm font-medium text-slate-400 mb-3">{t('dashboard.facilities.tabs.content.attributes')}</h3>
                                                    <pre className="text-xs text-green-400 font-mono overflow-x-auto">{JSON.stringify(selectedNode.attributes, null, 2)}</pre>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="contents" className="m-0">
                                            <div className="text-sm text-slate-400 text-center py-10 border border-dashed border-slate-700 rounded-lg">
                                                {t('dashboard.facilities.tabs.content.empty_contents')}
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
                                                    <p className="text-sm text-slate-500">{t('dashboard.facilities.tabs.content.empty_capabilities')}</p>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="activity" className="m-0">
                                            <div className="space-y-4">
                                                <p className="text-sm text-slate-500">{t('dashboard.facilities.tabs.content.empty_activity')}</p>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
                            <FolderTree className="size-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium text-slate-300">{t('dashboard.facilities.empty_state.title')}</p>
                            <p className="max-w-xs mt-2 text-sm">{t('dashboard.facilities.empty_state.description')}</p>
                        </div>
                    )}
                </Card>
            </div>

            <SlideOutDrawer
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={t('dashboard.facilities.dialogs.create.title')}
                description={
                    formData.parentId
                        ? t('dashboard.facilities.dialogs.create.desc_child', { name: nodes.find((n) => n.id === formData.parentId)?.name })
                        : t('dashboard.facilities.dialogs.create.desc_root')
                }>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                    {formData.parentId && (
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <Label className="text-cyan-400 text-xs mb-1 block">{t('dashboard.facilities.dialogs.create.parent_locked')}</Label>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <BoxSelect className="size-4 text-cyan-500" />
                                {nodes.find((n) => n.id === formData.parentId)?.name}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>{t('dashboard.facilities.dialogs.create.node_name')}</Label>
                        <Input
                            required
                            value={formData.name || ''}
                            aria-invalid={!!validationErrors.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                clearError('name');
                            }}
                            placeholder={t('dashboard.facilities.dialogs.create.node_name_placeholder')}
                        />
                        <FormError message={validationErrors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label>{t('dashboard.facilities.dialogs.update.node_type')}</Label>
                        <Select
                            value={(formData.type as string) || 'OTHER'}
                            onValueChange={(val) => {
                                setFormData({ ...formData, type: val as NodeType });
                                clearError('type');
                            }}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700">
                                <SelectValue placeholder={t('dashboard.facilities.dialogs.update.select_type')} />
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
                        <Label>{t('dashboard.facilities.dialogs.create.definition_id')}</Label>
                        <TableView
                            value={formData.definitionId || ''}
                            onChange={(val) => {
                                setFormData({ ...formData, definitionId: val });
                                clearError('definitionId');
                            }}
                            fetchData={() => Promise.resolve([]) /* TODO: Wire up to Definitions API when available */}
                            placeholder={t('dashboard.facilities.dialogs.create.definition_placeholder')}
                            hasError={!!validationErrors.definitionId}
                        />
                        <FormError message={validationErrors.definitionId} />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                            {t('dashboard.facilities.buttons.cancel')}
                        </Button>
                        <Button type="submit">{t('dashboard.facilities.buttons.create_node')}</Button>
                    </div>
                </form>
            </SlideOutDrawer>
        </div>
    );
}
