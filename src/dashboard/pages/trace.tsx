import { useEffect, useState } from 'react';
import { Loader2, Plus, Activity } from 'lucide-react';
import { traceService } from '@/features/trace/services/trace.service';
import type { ActivityListItem } from '@/features/trace/types/trace.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';
import { TableActions } from '@/shared/components/table-actions';
import { getModuleActions } from '@/shared/lib/module-actions-config';
export function TracePage() {
    const [items, setItems] = useState<ActivityListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [editingItem, setEditingItem] = useState<ActivityListItem | null>(null);
    const moduleActions = getModuleActions('trace');
    const fetch = async () => {
        try {
            const data = await traceService.listActivities();
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
                await traceService.updateActivity(editingItem.id, values);
            } else {
                await traceService.createActivity(values);
            }
            setEditingItem(null);
            await fetch();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleEdit = (id: string) => {
        const item = items.find((a) => a.id === id);
        if (item) {
            setEditingItem(item);
            setIsOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await traceService.deleteActivity(id);
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

    const filtered = Array.isArray(items) ? items.filter((i) => i.actionType.toLowerCase().includes(search.toLowerCase())) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Trace Activities</h1>
                    <p className="text-slate-400">View and log traceability activities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Input placeholder="Search activities..." value={search} onChange={(e: any) => setSearch(e.target.value)} className="flex-1 sm:flex-none" />
                    <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2 whitespace-nowrap">
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50 pb-6">
                    <CardTitle className="text-white">Activities</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                            <p className="text-slate-400">Loading activities...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Activity className="h-8 w-8 text-slate-500" />
                            <p className="text-slate-400">No activities found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 bg-slate-900/40">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Action</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">User</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Job</th>
                                        {(moduleActions.canEdit || moduleActions.canDelete) && (
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {filtered.map((a) => (
                                        <tr key={a.id} className="hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-white">{a.actionType}</td>
                                            <td className="px-6 py-4 text-slate-400">{a.userId || '-'}</td>
                                            <td className="px-6 py-4 text-slate-400">{a.jobId || '-'}</td>
                                            {(moduleActions.canEdit || moduleActions.canDelete) && (
                                                <td className="px-6 py-4 text-right">
                                                    <TableActions
                                                        id={a.id}
                                                        onEdit={moduleActions.canEdit ? handleEdit : undefined}
                                                        onDelete={moduleActions.canDelete ? handleDelete : undefined}
                                                        itemName="activity"
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
                title={editingItem ? 'Edit Activity' : 'Log Activity'}
                mode={editingItem ? 'edit' : 'create'}
                fields={[
                    { name: 'actionType', label: 'Action Type', required: true, hint: 'Type of action (e.g., assemble, test, inspect)' },
                    { name: 'jobId', label: 'Job ID', hint: 'Optional: Associated job or work order ID' },
                    { name: 'nodeId', label: 'Node ID', hint: 'Optional: Associated facility or machine node' },
                ]}
                initialData={editingItem || {}}
                onSubmit={handleCreate}
            />
        </div>
    );
}
