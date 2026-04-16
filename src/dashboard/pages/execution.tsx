import { useEffect, useMemo } from 'react';
import { useExecution } from '@/features/execution/hooks/use-execution';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DataTableGrid, type ColumnDef } from '@/shared/components/ui/data-table-grid';
import { useTranslation } from 'react-i18next';
import { Play, CheckCircle2, AlertCircle, Clock, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ExecutionJob } from '@/features/execution/types/execution.schema';

export function ExecutionPage() {
    const { t } = useTranslation();
    const { 
        jobs, 
        isLoading, 
        fetchJobs, 
        startJob, 
        completeJob,
        inProgressJobs,
        pendingJobs
    } = useExecution();

    useEffect(() => {
        fetchJobs().catch(() => {});
    }, [fetchJobs]);

    const stats = useMemo(() => [
        { label: t('dashboard.execution.stats.total_jobs'), value: jobs.length, icon: Clock, color: 'text-blue-400' },
        { label: t('dashboard.execution.stats.in_progress'), value: inProgressJobs.length, icon: Loader2, color: 'text-amber-400', animate: true },
        { label: t('dashboard.execution.stats.pending'), value: pendingJobs.length, icon: Play, color: 'text-slate-400' },
    ], [jobs, inProgressJobs, pendingJobs, t]);

    const columns: ColumnDef<ExecutionJob>[] = useMemo(() => [
        { 
            header: t('dashboard.execution.table.job_id'), 
            accessorKey: 'id',
            cell: (item) => <code className="text-xs text-cyan-400/70">{item.id.split('-')[0]}...</code>
        },
        { 
            header: t('dashboard.execution.table.work_order'), 
            accessorKey: 'workOrderId',
            cell: (item) => <span className="text-slate-300">{item.workOrderId.split('-')[0]}...</span>
        },
        { 
            header: t('dashboard.execution.table.status'), 
            accessorKey: 'status',
            cell: (item) => {
                const colors = {
                    PENDING: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                    IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
                    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    CANCELLED: 'bg-slate-700/10 text-slate-500 border-slate-700/20',
                };
                return (
                    <Badge variant="outline" className={cn(colors[item.status as keyof typeof colors])}>
                        {t(`common.components.status.${item.status}`)}
                    </Badge>
                );
            }
        },
        { 
            header: t('dashboard.execution.table.station'), 
            accessorKey: 'nodeId',
            cell: (item) => <span className="text-slate-400">{item.nodeId.split('-')[0]}...</span>
        },
        { 
            header: t('dashboard.execution.table.actions'), 
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    {item.status === 'PENDING' && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
                            onClick={() => startJob(item.id)}
                        >
                            <Play className="h-3.5 w-3.5 mr-1" /> {t('dashboard.execution.actions.start')}
                        </Button>
                    )}
                    {item.status === 'IN_PROGRESS' && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                            onClick={() => completeJob(item.id)}
                        >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> {t('dashboard.execution.actions.complete')}
                        </Button>
                    )}
                </div>
            )
        }
    ], [startJob, completeJob, t]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{t('dashboard.execution.title')}</h1>
                    <p className="text-slate-400 mt-1">{t('dashboard.execution.subtitle')}</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => fetchJobs()} 
                    disabled={isLoading}
                    className="border-slate-800 bg-slate-900/50 hover:bg-slate-800"
                >
                    <RefreshCcw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                    {t('common.actions.update')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                                </div>
                                <div className={cn("p-3 rounded-xl bg-slate-800/50 group-hover:scale-110 transition-transform duration-300", stat.color)}>
                                    <stat.icon className={cn("h-6 w-6", stat.animate && "animate-spin-slow")} />
                                </div>
                            </div>
                        </CardContent>
                        <div className="h-1 w-full bg-slate-800">
                            <div className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: jobs.length ? `${(stat.value / jobs.length) * 100}%` : '0%' }} />
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-200">Active Pipeline</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTableGrid 
                        data={jobs} 
                        columns={columns} 
                        isLoading={isLoading} 
                        pageCount={1}
                        className="border-none"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

// Default export for lazy loading
export default ExecutionPage;
