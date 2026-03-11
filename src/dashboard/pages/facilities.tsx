import { useEffect, useState } from 'react';
import { Loader2, Plus, Building2 } from 'lucide-react';
import { facilitiesService } from '@/features/facilities/services/facilities.service';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';
import { TableActions } from '@/shared/components/table-actions';
import { getModuleActions } from '@/shared/lib/module-actions-config';

export function FacilitiesPage() {
    const [items, setItems] = useState<FacilityListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [editingItem, setEditingItem] = useState<FacilityListItem | null>(null);
    const moduleActions = getModuleActions('facilities');

    const fetch = async () => {
        try {
            const data = await facilitiesService.listFacilities();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
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
                await facilitiesService.updateFacility(editingItem.id, values);
            } else {
                await facilitiesService.createFacility(values);
            }
            setEditingItem(null);
            await fetch();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleEdit = (id: string) => {
        const item = items.find((f) => f.id === id);
        if (item) {
            setEditingItem(item);
            setIsOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await facilitiesService.deleteFacility(id);
            await fetch();
        } catch (err) {
            console.error('Delete error:', err);
            throw err;
        }
    };

    const handleCloseWizard = () => {
        setIsOpen(false);
        setEditingItem(null);
    };

    const filtered = Array.isArray(items) ? items.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.path.toLowerCase().includes(search.toLowerCase())) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Facilities</h1>
                    <p className="text-slate-400">Manage facility hierarchy and nodes.</p>
                </div>
                <div className="flex items-center gap-3 shrink min-w-0">
                    <Input placeholder="Search facilities..." value={search} onChange={(e: any) => setSearch(e.target.value)} className="min-w-0 flex-1 sm:w-64" />
                    <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50 pb-6">
                    <CardTitle className="text-white">Facility List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                            <p className="text-slate-400">Loading facilities...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Building2 className="h-8 w-8 text-slate-500" />
                            <p className="text-slate-400">No facilities found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Path</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                                        {(moduleActions.canEdit || moduleActions.canDelete) && (
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {filtered.map((f) => (
                                        <tr key={f.id} className="hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-white">{f.path}</td>
                                            <td className="px-6 py-4 text-white">{f.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{f.status || '-'}</td>
                                            {(moduleActions.canEdit || moduleActions.canDelete) && (
                                                <td className="px-6 py-4 text-right">
                                                    <TableActions
                                                        id={f.id}
                                                        onEdit={moduleActions.canEdit ? handleEdit : undefined}
                                                        onDelete={moduleActions.canDelete ? handleDelete : undefined}
                                                        itemName="facility"
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
                title={editingItem ? 'Edit Facility' : 'Create Facility'}
                mode={editingItem ? 'edit' : 'create'}
                fields={[
                    { name: 'path', label: 'Path', required: true, hint: 'Facility hierarchy path in ltree format (e.g., Factory.Line1.Oven)' },
                    { name: 'name', label: 'Name', required: true, hint: 'Human-readable facility name' },
                    { name: 'parentId', label: 'Parent ID', hint: 'Optional: ID of parent facility node for hierarchy' },
                ]}
                initialData={editingItem || {}}
                onSubmit={handleCreate}
            />
        </div>
    );
}
