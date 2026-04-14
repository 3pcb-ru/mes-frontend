import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { reportsService } from '@/features/reports/services/reports.service';
import type { ActivityListItem } from '@/features/reports/types/reports.types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { DataTableGrid, type ColumnDef } from '@/shared/components/ui/data-table-grid';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';

export function ReportsPage() {
    const { t } = useTranslation();
    const [items, setItems] = useState<ActivityListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Advanced Filters
    const [searchAction, setSearchAction] = useState('');
    const [filterNode, setFilterNode] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [filterJob, setFilterJob] = useState('');

    // Detailed Modal State
    const [selectedItem, setSelectedItem] = useState<ActivityListItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const data = await reportsService.listActivities();
            setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || t('dashboard.reports.messages.load_failed'));
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const filteredItems = items.filter((a) => {
        const matchAction = a.actionType?.toLowerCase().includes(searchAction.toLowerCase()) ?? true;
        const matchNode = filterNode ? a.nodeId?.toLowerCase().includes(filterNode.toLowerCase()) : true;
        const matchUser = filterUser ? a.userId?.toLowerCase().includes(filterUser.toLowerCase()) : true;
        const matchJob = filterJob ? a.jobId?.toLowerCase().includes(filterJob.toLowerCase()) : true;
        return matchAction && matchNode && matchUser && matchJob;
    });

    const columns: ColumnDef<ActivityListItem>[] = useMemo(
        () => [
            { header: t('dashboard.reports.table.action_type'), accessorKey: 'actionType' },
            { header: t('dashboard.reports.table.date'), cell: (item) => new Date(item.createdAt || Date.now()).toLocaleString() },
            {
                header: t('dashboard.reports.table.user_id'),
                accessorKey: 'userId',
                cell: (item) => item.userId || t('dashboard.reports.table.system'),
                className: 'hidden sm:table-cell',
                headerClassName: 'hidden sm:table-cell',
            },
            {
                header: t('dashboard.reports.table.node_id'),
                accessorKey: 'nodeId',
                cell: (item) => item.nodeId || '—',
                className: 'hidden lg:table-cell',
                headerClassName: 'hidden lg:table-cell',
            },
            {
                header: t('dashboard.reports.table.job_id'),
                accessorKey: 'jobId',
                cell: (item) => item.jobId || '—',
                className: 'hidden lg:table-cell',
                headerClassName: 'hidden lg:table-cell',
            },
            {
                header: t('dashboard.reports.actions.title'),
                headerClassName: 'text-right pr-4',
                className: 'text-right',
                cell: (item) => (
                    <div className="flex justify-end pr-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
                            onClick={() => {
                                setSelectedItem(item);
                                setIsModalOpen(true);
                            }}
                            title={t('dashboard.reports.actions.view_details')}>
                            <Info className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [t],
    );

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.reports.title')}</h1>
                    <p className="text-slate-400">{t('dashboard.reports.description')}</p>
                </div>
            </div>

            {/* Advanced Filters Card */}
            <Card className="bg-slate-900/50 border-slate-700/50 shrink-0">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">{t('dashboard.reports.filters.action_type')}</Label>
                        <Input placeholder={t('dashboard.reports.filters.action_placeholder')} value={searchAction} onChange={(e) => setSearchAction(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">{t('dashboard.reports.filters.node_id')}</Label>
                        <Input placeholder={t('dashboard.reports.filters.node_placeholder')} value={filterNode} onChange={(e) => setFilterNode(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">{t('dashboard.reports.filters.user_id')}</Label>
                        <Input placeholder={t('dashboard.reports.filters.user_placeholder')} value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">{t('dashboard.reports.filters.job_id')}</Label>
                        <Input placeholder={t('dashboard.reports.filters.job_placeholder')} value={filterJob} onChange={(e) => setFilterJob(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Data Grid */}
            <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-y-auto">
                <DataTableGrid data={filteredItems} columns={columns} isLoading={isLoading} pageCount={1} />
            </div>

            {/* Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-950 border-slate-800 text-slate-300 sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <Info className="h-5 w-5 text-cyan-400" />
                            {t('dashboard.reports.details_modal.title')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">{t('dashboard.reports.table.action_type')}</p>
                                <p className="text-slate-200">{selectedItem?.actionType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">{t('dashboard.reports.table.date')}</p>
                                <p className="text-slate-200">{selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : '—'}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">{t('dashboard.reports.table.metadata')}</p>
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-auto max-h-[300px] custom-scrollbar">
                                <pre className="text-xs font-mono text-cyan-400/80">
                                    {selectedItem?.metadata ? JSON.stringify(selectedItem.metadata, null, 2) : 'No metadata available'}
                                </pre>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-800 hover:bg-slate-900">
                            {t('dashboard.reports.details_modal.close')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
