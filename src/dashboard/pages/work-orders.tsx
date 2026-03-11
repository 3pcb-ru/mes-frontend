import { useEffect, useState } from 'react';
import { Plus, GripVertical, FileText } from 'lucide-react';
import { workOrdersService } from '@/features/work-orders/services/work-orders.service';
import type { WorkOrderListItem } from '@/features/work-orders/types/work-orders.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { SlideOutDrawer } from '@/shared/components/ui/slide-out-drawer';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

const COLUMNS = [
    { id: 'PLANNED', label: 'Planned' },
    { id: 'RELEASED', label: 'Ready for Execution' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'CLOSED', label: 'Completed' },
] as const;

export function WorkOrdersPage() {
    const [items, setItems] = useState<WorkOrderListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<WorkOrderListItem>>({});

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await workOrdersService.listWorkOrders();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await workOrdersService.createWorkOrder({
                ...formData,
                targetQuantity: Number(formData.targetQuantity),
            });
            setIsDrawerOpen(false);
            setFormData({});
            await fetchOrders();
        } catch (err) {
            console.error('Error creating work order:', err);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Production Execution</h1>
                    <p className="text-slate-400">Manage manufacturing workflows via Work Orders.</p>
                </div>
                <div className="flex items-center shrink min-w-0">
                    <Button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Create Work Order
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 min-h-0 overflow-x-auto pb-4 custom-scrollbar">
                {COLUMNS.map((col) => {
                    const columnItems = items.filter((w) => (w.status || 'PLANNED') === col.id);

                    return (
                        <Card key={col.id} className="min-w-[320px] max-w-[320px] flex flex-col bg-slate-900/50 border-slate-700/50">
                            <CardHeader className="border-b border-slate-800 pb-3 shrink-0 py-3 px-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium text-slate-300 uppercase tracking-wide">{col.label}</CardTitle>
                                <span className="bg-slate-800 text-slate-400 text-xs font-semibold px-2 py-0.5 rounded-full">{columnItems.length}</span>
                            </CardHeader>
                            <CardContent className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                {isLoading ? (
                                    Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-28 rounded-lg bg-slate-800/20 animate-pulse border border-slate-800/50" />)
                                ) : columnItems.length === 0 ? (
                                    <div className="text-center p-8 text-slate-500 text-xs border border-dashed border-slate-700 rounded-lg">No work orders here</div>
                                ) : (
                                    columnItems.map((order) => (
                                        <div
                                            key={order.id}
                                            className="group bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-colors relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="size-4 text-cyan-500" />
                                                    <span className="text-white font-medium text-sm truncate max-w-[150px]" title={order.bomRevisionId}>
                                                        {order.bomRevisionId}
                                                    </span>
                                                </div>
                                                <GripVertical className="size-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-xs text-slate-400">
                                                    Target Qty: <span className="text-slate-200">{order.targetQuantity} units</span>
                                                </p>
                                                <p className="text-xs text-slate-400">Start: {order.plannedStartDate || 'Not scheduled'}</p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <StatusBadge status={order.status || 'PLANNED'} className="text-[10px] px-1.5 py-0" />
                                                <span className="text-[10px] text-slate-500 font-mono">{order.id.split('-')[0]}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <SlideOutDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} title="Create Work Order" description="Initialize a new production execution run.">
                <form onSubmit={handleCreate} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <Label>
                            BOM Revision ID <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            required
                            value={formData.bomRevisionId || ''}
                            onChange={(e) => setFormData({ ...formData, bomRevisionId: e.target.value })}
                            placeholder="e.g. BOM-REV-A1"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Target Quantity <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            type="number"
                            required
                            min="1"
                            value={formData.targetQuantity || ''}
                            onChange={(e) => setFormData({ ...formData, targetQuantity: Number(e.target.value) })}
                            placeholder="e.g. 50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Planned Start Date</Label>
                        <Input type="date" value={formData.plannedStartDate || ''} onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })} />
                    </div>
                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
                        <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Release Order</Button>
                    </div>
                </form>
            </SlideOutDrawer>
        </div>
    );
}
