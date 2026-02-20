import { BarChart3, Package, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuth } from '@/features/auth/store/auth.store';

const stats = [
    { name: 'Total Products', value: '1,234', change: '+12%', icon: Package, color: 'cyan' },
    { name: 'Active Users', value: '56', change: '+4%', icon: Users, color: 'purple' },
    { name: 'Production Rate', value: '98.5%', change: '+2.1%', icon: TrendingUp, color: 'green' },
    { name: 'Reports', value: '89', change: '+18%', icon: BarChart3, color: 'orange' },
];

export function DashboardHome() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
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
                            <p className="text-xs text-green-400">{stat.change} from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-slate-400">Your latest manufacturing operations and updates.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">Production batch #{1000 + i}</p>
                                    <p className="text-sm text-slate-400">
                                        Completed {i} hour{i !== 1 ? 's' : ''} ago
                                    </p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Completed</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
