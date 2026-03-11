import { useEffect, useState } from 'react';
import { Loader2, Plus, Box } from 'lucide-react';
import { toast } from 'sonner';
import { inventoryService } from '@/features/inventory/services/inventory.service';
import type { ContainerListItem } from '@/features/inventory/types/inventory.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';
import { TableActions } from '@/shared/components/table-actions';
import { getModuleActions } from '@/shared/lib/module-actions-config';

export function InventoryPage() {
    const [items, setItems] = useState<ContainerListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [editingItem, setEditingItem] = useState<ContainerListItem | null>(null);
    const moduleActions = getModuleActions('inventory');

    const fetch = async () => {
        try {
            const data = await inventoryService.listContainers();
            setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Failed to load inventory');
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    const handleCreate = async (values: any) => {
        try {
            if (editingItem) {
                await inventoryService.updateContainer(editingItem.id, values);
                toast.success('Container updated successfully');
            } else {
                await inventoryService.createContainer(values);
                toast.success('Container created successfully');
            }
            setEditingItem(null);
            await fetch();
        } catch (err: any) {
            console.error('Error:', err);
            toast.error(err?.message || 'Failed to save container');
        }
    };
    const handleEdit = (id: string) => {
        const item = items.find((c) => c.id === id);
        if (item) {
            setEditingItem(item);
            setIsOpen(true);
        }
    };
    const handleDelete = async (id: string) => {
        try {
            await inventoryService.deleteContainer(id);
            toast.success('Container deleted successfully');
            await fetch();
        } catch (err: any) {
            console.error('Delete error:', err);
            toast.error(err?.message || 'Failed to delete container');
            throw err;
        }
    };
    const handleCloseWizard = () => {
        setIsOpen(false);
        setEditingItem(null);
    };
    const filtered = Array.isArray(items) ? items.filter((c) => c.lpn.toLowerCase().includes(search.toLowerCase())) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Inventory Containers</h1>
                    <p className="text-slate-400">Manage containers and locations.</p>
                </div>
                <div className="flex items-center gap-3 shrink min-w-0">
                    <Input placeholder="Search LPN..." value={search} onChange={(e: any) => setSearch(e.target.value)} className="min-w-0 flex-1 sm:w-64" />
                    <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50 pb-6">
                    <CardTitle className="text-white">Containers</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                            <p className="text-slate-400">Loading containers...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Box className="h-8 w-8 text-slate-500" />
                            <p className="text-slate-400">No containers found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">LPN</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Location</th>
                                        {(moduleActions.canEdit || moduleActions.canDelete) && (
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {filtered.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-white">{c.lpn}</td>
                                            <td className="px-6 py-4 text-slate-400">{c.type || '-'}</td>
                                            <td className="px-6 py-4 text-slate-400">{c.locationNodeId || '-'}</td>
                                            {(moduleActions.canEdit || moduleActions.canDelete) && (
                                                <td className="px-6 py-4 text-right">
                                                    <TableActions
                                                        id={c.id}
                                                        onEdit={moduleActions.canEdit ? handleEdit : undefined}
                                                        onDelete={moduleActions.canDelete ? handleDelete : undefined}
                                                        itemName="container"
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <CrudWizard
                isOpen={isOpen}
                onClose={handleCloseWizard}
                title={editingItem ? 'Edit Container' : 'Create Container'}
                mode={editingItem ? 'edit' : 'create'}
                fields={[
                    { name: 'lpn', label: 'LPN', required: true, hint: 'License Plate Number - unique identifier for this container (e.g., LPN-2024-001)' },
                    { name: 'type', label: 'Type', hint: 'Container type (e.g., REEL, TRAY, BOX)' },
                    { name: 'locationNodeId', label: 'Location Node ID', hint: 'Optional: Facility node where container is stored' },
                ]}
                initialData={editingItem || {}}
                onSubmit={handleCreate}
            />
        </div>
    );
}
