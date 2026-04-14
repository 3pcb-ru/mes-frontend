import { useEffect, useState, useMemo } from 'react';
import { Loader2, Plus, Box, Warehouse, ChevronRight, PackageCheck, Send, Move, ClipboardList, Search, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { warehouseService } from '@/features/warehouse/services/warehouse.service';
import { facilitiesService } from '@/features/facilities/services/facilities.service';
import type { ContainerListItem } from '@/features/warehouse/types/warehouse.types';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import CrudWizard from '@/shared/components/crud-wizard';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';

export function WarehousePage() {
    const { t } = useTranslation();
    const [allNodes, setAllNodes] = useState<FacilityListItem[]>([]);
    const [allContainers, setAllContainers] = useState<ContainerListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    
    // Receipt/Shipment Form State
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [isShipmentOpen, setIsShipmentOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const nodesResult = await facilitiesService.listFacilities();
            const containersResult = await warehouseService.listContainers();
            
            const nodes = Array.isArray(nodesResult) ? nodesResult : (nodesResult as any)?.data || [];
            const containers = Array.isArray(containersResult) ? containersResult : (containersResult as any)?.data || [];

            setAllNodes(Array.isArray(nodes) ? nodes : []);
            setAllContainers(Array.isArray(containers) ? containers : []);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || t('dashboard.warehouse.messages.load_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Breadcrumb logic
    const breadcrumbs = useMemo(() => {
        const path: FacilityListItem[] = [];
        let current = allNodes.find(n => n.id === currentNodeId);
        while (current) {
            path.unshift(current);
            const parentId = current.parentId;
            current = allNodes.find(n => n.id === parentId);
        }
        return path;
    }, [currentNodeId, allNodes]);

    // Current Selection logic
    const currentSubNodes = useMemo(() => {
        return allNodes.filter(n => n.parentId === currentNodeId);
    }, [currentNodeId, allNodes]);

    const currentContainers = useMemo(() => {
        return allContainers.filter(c => c.locationNodeId === currentNodeId);
    }, [currentNodeId, allContainers]);

    const handleReceipt = async (values: any) => {
        try {
            // Mocking record creation as per plan
            await warehouseService.createContainer({ 
                ...values, 
                locationNodeId: currentNodeId || undefined 
            });
            toast.success(t('dashboard.warehouse.messages.receipt_success'));
            setIsReceiptOpen(false);
            fetchData();
        } catch (err: any) {
            toast.error(err?.message || t('dashboard.warehouse.messages.receipt_failed'));
        }
    };

    const handleShipment = async (values: any) => {
        try {
            // Mocking shipment as per plan
            toast.success(t('dashboard.warehouse.messages.shipment_success'));
            setIsShipmentOpen(false);
        } catch (err: any) {
            toast.error(err?.message || t('dashboard.warehouse.messages.shipment_failed'));
        }
    };

    const handleMove = async (containerId: string, targetNodeId: string) => {
        try {
            await warehouseService.moveContainer(containerId, { targetNodeId });
            toast.success(t('dashboard.warehouse.messages.move_success'));
            fetchData();
        } catch (err: any) {
            toast.error(err?.message || t('dashboard.warehouse.messages.move_failed'));
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
                <p className="text-slate-400 font-medium italic">{t('common.actions.loading')}</p>
            </div>
        );
    }

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
                <div className="flex items-center gap-3">
                    <Button onClick={() => setIsReceiptOpen(true)} className="gap-2">
                        <PackageCheck className="h-4 w-4" />
                        {t('dashboard.warehouse.new_receipt')}
                    </Button>
                    <Button onClick={() => setIsShipmentOpen(true)} className="gap-2">
                        <Send className="h-4 w-4" />
                        {t('dashboard.warehouse.new_shipment')}
                    </Button>
                </div>
            </div>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                <button 
                    onClick={() => setCurrentNodeId(null)}
                    className={cn("hover:text-cyan-400 transition-colors", !currentNodeId ? "text-cyan-400 font-bold" : "text-slate-400")}
                >
                    {t('dashboard.warehouse.root_storage')}
                </button>
                {breadcrumbs.map((node) => (
                    <div key={node.id} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                        <button 
                            onClick={() => setCurrentNodeId(node.id)}
                            className={cn("hover:text-cyan-400 transition-colors", currentNodeId === node.id ? "text-cyan-400 font-bold" : "text-slate-400")}
                        >
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
                        {currentSubNodes.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-slate-500 text-sm">{t('dashboard.warehouse.no_sub_areas')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                                {currentSubNodes.map(node => (
                                    <button
                                        key={node.id}
                                        onClick={() => setCurrentNodeId(node.id)}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all group group"
                                    >
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
                    <CardContent className="p-0">
                        {currentContainers.length === 0 ? (
                            <div className="py-16 text-center">
                                <Box className="h-12 w-12 text-slate-700 mx-auto mb-4 opacity-50" />
                                <p className="text-slate-500">{t('dashboard.warehouse.empty_location')}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-900/20">
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('dashboard.warehouse.table.lpn')}</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('dashboard.warehouse.table.type')}</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('dashboard.warehouse.table.created_at')}</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('dashboard.warehouse.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {currentContainers.filter(c => c.lpn.toLowerCase().includes(search.toLowerCase())).map((c) => (
                                            <tr key={c.id} className="group hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{c.lpn}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-400 font-mono text-[10px]">
                                                        {c.type || t('common.status.UNKNOWN')}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-400">
                                                    {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50" title={t('dashboard.warehouse.tooltips.qc_check')}>
                                                            <PackageCheck className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50" title={t('dashboard.warehouse.tooltips.move')}>
                                                            <Move className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10" title={t('dashboard.warehouse.tooltips.remove')}>
                                                            <LogOut className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                    { name: 'expectedDate', label: t('dashboard.warehouse.receipt_modal.fields.expected_date'), type: 'date', hint: t('dashboard.warehouse.receipt_modal.fields.expected_date_hint') },
                    { name: 'actualDate', label: t('dashboard.warehouse.receipt_modal.fields.actual_date'), type: 'date', hint: t('dashboard.warehouse.receipt_modal.fields.actual_date_hint') },
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
                    { name: 'destination', label: t('dashboard.warehouse.shipment_modal.fields.destination'), required: true, hint: t('dashboard.warehouse.shipment_modal.fields.destination_hint') },
                    { name: 'expectedDate', label: t('dashboard.warehouse.shipment_modal.fields.expected_date'), type: 'date' },
                    { name: 'actualDate', label: t('dashboard.warehouse.shipment_modal.fields.actual_date'), type: 'date' },
                ]}
                onSubmit={handleShipment}
                initialData={{ actualDate: new Date().toISOString().split('T')[0] }}
            />
        </div>
    );
}
