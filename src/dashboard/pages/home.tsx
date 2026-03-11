import { Activity, AlertTriangle, Blocks, Hammer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuth } from '@/features/auth/store/auth.store';
import { StatusBadge } from '@/shared/components/ui/status-badge';

const stats = [
    { name: 'Active Work Orders', value: '142', change: '+12%', icon: Hammer, color: 'blue' },
    { name: 'Nodes Down', value: '3', change: '-2', icon: AlertTriangle, color: 'red' },
    { name: 'Nodes Error', value: '1', change: '0', icon: AlertTriangle, color: 'orange' },
    { name: 'Recent Trace Activities', value: '891', change: '+18%', icon: Activity, color: 'cyan' },
];

export function DashboardHome() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 h-full">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.firstName || 'User'}! 👋</h1>
                <p className="text-slate-400">Here's what's happening with your manufacturing operations today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">{stat.name}</CardTitle>
                            <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-slate-400 mt-1">{stat.change} from last shift</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white">Recent Traceability Activities</CardTitle>
                    <CardDescription className="text-slate-400">Latest actions logged across your nodes and work orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                    <Blocks className="h-5 w-5 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">Node State Changed - Line {i}</p>
                                    <p className="text-sm text-slate-400">Operator changed station {i}A status to IN_PROGRESS</p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={i === 2 ? 'COMPLETED' : 'IN_PROGRESS'} className="mb-1 block w-fit ml-auto" />
                                    <p className="text-xs text-slate-500">{i * 15} mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
