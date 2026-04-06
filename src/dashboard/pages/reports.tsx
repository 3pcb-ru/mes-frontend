import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { reportsService } from '@/features/reports/services/reports.service';
import type { ActivityListItem } from '@/features/reports/types/reports.types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { DataTableGrid, type ColumnDef } from '@/shared/components/ui/data-table-grid';

export function ReportsPage() {
    const [items, setItems] = useState<ActivityListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Advanced Filters
    const [searchAction, setSearchAction] = useState('');
    const [filterNode, setFilterNode] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [filterJob, setFilterJob] = useState('');

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const data = await reportsService.listActivities();
            setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Failed to load report activities');
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

    const columns: ColumnDef<ActivityListItem>[] = [
        { header: 'Action Type', accessorKey: 'actionType' },
        { header: 'Date', cell: (item) => new Date(item.createdAt || Date.now()).toLocaleString() },
        { header: 'User ID', accessorKey: 'userId', cell: (item) => item.userId || 'System' },
        { header: 'Node ID', accessorKey: 'nodeId', cell: (item) => item.nodeId || '—' },
        { header: 'Job ID', accessorKey: 'jobId', cell: (item) => item.jobId || '—' },
        {
            header: 'Metadata',
            cell: (item) =>
                item.metadata ? (
                    <div className="max-w-[200px] truncate text-xs font-mono text-slate-400" title={JSON.stringify(item.metadata)}>
                        {JSON.stringify(item.metadata)}
                    </div>
                ) : (
                    '—'
                ),
        },
    ];

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
                    <p className="text-slate-400">Read-only view for all logged system activities and event reports.</p>
                </div>
            </div>

            {/* Advanced Filters Card */}
            <Card className="bg-slate-900/50 border-slate-700/50 shrink-0">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">Action Type</Label>
                        <Input placeholder="e.g. status_change" value={searchAction} onChange={(e) => setSearchAction(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">Node ID</Label>
                        <Input placeholder="Filter by Node UUID..." value={filterNode} onChange={(e) => setFilterNode(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">User ID</Label>
                        <Input placeholder="Filter by User UUID..." value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">Job / Work Order ID</Label>
                        <Input placeholder="Filter by Job UUID..." value={filterJob} onChange={(e) => setFilterJob(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Data Grid */}
            <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-y-auto">
                <DataTableGrid data={filteredItems} columns={columns} isLoading={isLoading} pageCount={1} />
            </div>
        </div>
    );
}
