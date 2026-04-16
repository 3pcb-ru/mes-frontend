import { useEffect, useState, useMemo } from 'react';
import { Plus, Box, Warehouse, ChevronRight, PackageCheck, Send, Move, ClipboardList, Search, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useWarehouse } from '@/features/warehouse/store/warehouse.store';
import type { ContainerListItem } from '@/features/warehouse/types/warehouse.types';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import type { ApiError } from '@/shared/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { DataTableGrid, type ColumnDef } from '@/shared/components/ui/data-table-grid';
import { Skeleton } from '@/shared/components/ui/skeleton';
import CrudWizard from '@/shared/components/crud-wizard';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';

export function WarehousePage() {
    const { t } = useTranslation();
    const { allNodes, allContainers, isLoading, fetchData, createContainer, moveContainer } = useWarehouse();
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Receipt/Shipment Form State
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [isShipmentOpen, setIsShipmentOpen] = useState(false);

    useEffect(() => {
        fetchData().catch(() => {});
    }, [fetchData]);

    // Breadcrumb logic
    const breadcrumbs = useMemo(() => {
        const path: FacilityListItem[] = [];
        let current = allNodes.find((n) => n.id === currentNodeId);
        while (current) {
            path.unshift(current);
            const parentId = current.parentId;
            current = allNodes.find((n) => n.id === parentId);
        }
        return path;
    }, [currentNodeId, allNodes]);

    // Current Selection logic
    const currentSubNodes = useMemo(() => {
        return allNodes.filter((n) => n.parentId === currentNodeId);
    }, [currentNodeId, allNodes]);

    const currentContainers = useMemo(() => {
        return allContainers.filter((c) => c.locationNodeId === currentNodeId);
    }, [currentNodeId, allContainers]);

    const handleReceipt = async (values: any) => {
        try {
            await createContainer({
                ...values,
                locationNodeId: currentNodeId || undefined,
            });
            toast.success(t('dashboard.warehouse.messages.receipt_success'));
            setIsReceiptOpen(false);
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || t('dashboard.warehouse.messages.receipt_failed'));
        }
    };

    const handleShipment = async (_values: any) => {
        try {
            toast.success(t('dashboard.warehouse.messages.shipment_success'));
            setIsShipmentOpen(false);
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || t('dashboard.warehouse.messages.shipment_failed'));
        }
    };

    const handleMove = async (containerId: string, targetNodeId: string) => {
        try {
            await moveContainer(containerId, { targetNodeId });
            toast.success(t('dashboard.warehouse.messages.move_success'));
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || t('dashboard.warehouse.messages.move_failed'));
        }
    };

    const columns: ColumnDef<ContainerListItem>[] = useMemo(
        () => [
            {
                header: t('dashboard.warehouse.table.lpn'),
                accessorKey: 'lpn',
                cell: (item) => <span className="font-medium text-white group-hover:text-cyan-400 transition-colors">{item.lpn}</span>,
            },
            {
                header: t('dashboard.warehouse.table.type'),
                cell: (item) => (
                    <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-400 font-mono text-[10px]">
                        {item.type || t('common.status.UNKNOWN')}
                    </Badge>
                ),
            },
            {
                header: t('dashboard.warehouse.table.created_at'),
                cell: (item) => <span className="text-xs text-slate-400">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>,
            },
            {
                header: t('dashboard.warehouse.table.actions'),
                headerClassName: 'text-right',
                className: 'text-right',
                cell: (item) => (
                    <div className="flex items-center justify-end gap-2 pr-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
                            title={t('dashboard.warehouse.tooltips.qc_check')}>
                            <PackageCheck className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
                            title={t('dashboard.warehouse.tooltips.move')}>
                            <Move className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            title={t('dashboard.warehouse.tooltips.remove')}
                            id={`delete-container-${item.id}`}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [t],
    );

    const filteredContainers = useMemo(() => {
        return currentContainers.filter((c) => c.lpn.toLowerCase().includes(search.toLowerCase()));
    }, [currentContainers, search]);

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Warehouse className="h-8 w-8 text-cyan-400" />
                        {t('dashboard.warehouse.title')}
                    </h1>
                    <p className="text-slate-400">{t('dashboard.warehouse.description')}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Button
                        id="new-receipt-button"
                        className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/20"
                        onClick={() => setIsReceiptOpen(true)}>
                        <Plus className="h-4 w-4" />
                        <span>{t('dashboard.warehouse.new_receipt')}</span>
                    </Button>
                    <Button
                        id="new-shipment-button"
                        className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-500/20"
                        onClick={() => setIsShipmentOpen(true)}>
                        <Send className="h-4 w-4" />
                        <span>{t('dashboard.warehouse.new_shipment')}</span>
                    </Button>
                </div>
            </div>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                <button
                    onClick={() => setCurrentNodeId(null)}
                    className={cn('hover:text-cyan-400 transition-colors', !currentNodeId ? 'text-cyan-400 font-bold' : 'text-slate-400')}>
                    {t('dashboard.warehouse.root_storage')}
                </button>
                {breadcrumbs.map((node) => (
                    <div key={node.id} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                        <button
                            onClick={() => setCurrentNodeId(node.id)}
                            className={cn('hover:text-cyan-400 transition-colors', currentNodeId === node.id ? 'text-cyan-400 font-bold' : 'text-slate-400')}>
                            {node.name}
                        </button>
                    </div>
                ))}
            </nav>

            <div className="grid grid-cols-1 gap-8">
                {/* Section A: Sub-locations */}
                <Card className="bg-slate-900/50 border-slate-800/50 overflow-hidden">
                    <CardHeader className="border-b border-slate-800/50 bg-slate-900/20 py-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Box className="h-5 w-5 text-indigo-400" />
                                {t('dashboard.warehouse.sub_locations')}
                            </CardTitle>
                            <Badge variant="outline" className="text-slate-500 border-slate-700">
                                {currentSubNodes.length} {t('dashboard.warehouse.sub_areas')}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/20 border border-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-9 w-9 rounded-lg" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-4 w-4" />
                                    </div>
                                ))}
                            </div>
                        ) : currentSubNodes.length === 0 ? (
                            <div className="py-12 text-center px-6">
                                <Box className="h-10 w-10 text-slate-800 mx-auto mb-3 opacity-40" />
                                <p className="text-slate-500 text-sm">{t('dashboard.warehouse.no_sub_areas')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                                {currentSubNodes.map((node) => (
                                    <button
                                        key={node.id}
                                        onClick={() => setCurrentNodeId(node.id)}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all group group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all">
                                                <Box className="h-5 w-5 text-slate-400 group-hover:text-cyan-400" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{node.name}</div>
                                                <div className="text-xs text-slate-500">{node.type || t('dashboard.warehouse.storage_area')}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-500" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Section B: Stored Containers */}
                <Card className="bg-slate-900/50 border-slate-800/50">
                    <CardHeader className="border-b border-slate-800/50 bg-slate-900/20 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-emerald-400" />
                            {t('dashboard.warehouse.stored_containers')}
                        </CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder={t('dashboard.warehouse.search_placeholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 bg-slate-950/50 border-slate-700"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 border-t border-slate-800/50">
                        <DataTableGrid data={filteredContainers} columns={columns} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>

            {/* Receipt Modal */}
            <CrudWizard
                isOpen={isReceiptOpen}
                onClose={() => setIsReceiptOpen(false)}
                title={t('dashboard.warehouse.receipt_modal.title')}
                description={t('dashboard.warehouse.receipt_modal.description')}
                mode="create"
                fields={[
                    { name: 'lpn', label: t('dashboard.warehouse.receipt_modal.fields.lpn'), required: true, hint: t('dashboard.warehouse.receipt_modal.fields.lpn_hint') },
                    { name: 'item', label: t('dashboard.warehouse.receipt_modal.fields.item'), required: true },
                    { name: 'quantity', label: t('dashboard.warehouse.receipt_modal.fields.quantity'), required: true, type: 'number' },
                    { name: 'source', label: t('dashboard.warehouse.receipt_modal.fields.source'), required: true },
                    {
                        name: 'expectedDate',
                        label: t('dashboard.warehouse.receipt_modal.fields.expected_date'),
                        type: 'date',
                        hint: t('dashboard.warehouse.receipt_modal.fields.expected_date_hint'),
                    },
                    {
                        name: 'actualDate',
                        label: t('dashboard.warehouse.receipt_modal.fields.actual_date'),
                        type: 'date',
                        hint: t('dashboard.warehouse.receipt_modal.fields.actual_date_hint'),
                    },
                    { name: 'type', label: t('dashboard.warehouse.receipt_modal.fields.type'), hint: t('dashboard.warehouse.receipt_modal.fields.type_hint') },
                ]}
                onSubmit={handleReceipt}
                initialData={{ actualDate: new Date().toISOString().split('T')[0] }}
            />

            {/* Shipment Modal */}
            <CrudWizard
                isOpen={isShipmentOpen}
                onClose={() => setIsShipmentOpen(false)}
                title={t('dashboard.warehouse.shipment_modal.title')}
                description={t('dashboard.warehouse.shipment_modal.description')}
                mode="create"
                fields={[
                    { name: 'lpn', label: t('dashboard.warehouse.shipment_modal.fields.lpn'), required: true },
                    { name: 'quantity', label: t('dashboard.warehouse.shipment_modal.fields.quantity'), required: true, type: 'number' },
                    {
                        name: 'destination',
                        label: t('dashboard.warehouse.shipment_modal.fields.destination'),
                        required: true,
                        hint: t('dashboard.warehouse.shipment_modal.fields.destination_hint'),
                    },
                    { name: 'expectedDate', label: t('dashboard.warehouse.shipment_modal.fields.expected_date'), type: 'date' },
                    { name: 'actualDate', label: t('dashboard.warehouse.shipment_modal.fields.actual_date'), type: 'date' },
                ]}
                onSubmit={handleShipment}
                initialData={{ actualDate: new Date().toISOString().split('T')[0] }}
            />
        </div>
    );
}
