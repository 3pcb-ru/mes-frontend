import { useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { traceService } from '@/features/trace/services/trace.service';
import type { ActivityListItem } from '@/features/trace/types/trace.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';

export function TracePage() {
  const [items, setItems] = useState<ActivityListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    try { const data = await traceService.listActivities(); setItems(data || []); } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  useEffect(()=>{ fetch(); }, []);

  const handleCreate = async (values: any) => { await traceService.createActivity(values); await fetch(); };

  const filtered = items.filter(i => i.actionType.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trace Activities</h1>
          <p className="text-slate-400">View and log traceability activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search activities..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button onClick={()=>setIsOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4"/>Add</Button>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50 pb-6"><CardTitle>Activities</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (<div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="h-8 w-8 animate-spin text-cyan-500"/><p className="text-slate-400">Loading activities...</p></div>) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/40">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Action</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Job</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filtered.map((a)=>(<tr key={a.id} className="hover:bg-slate-800/30"><td className="px-6 py-4">{a.actionType}</td><td className="px-6 py-4">{a.userId||'-'}</td><td className="px-6 py-4">{a.jobId||'-'}</td><td className="px-6 py-4 text-right"></td></tr>))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CrudWizard isOpen={isOpen} onClose={()=>setIsOpen(false)} title="Log Activity" fields={[{name:'actionType', label:'Action Type', required:true}, {name:'userId', label:'User ID'}, {name:'jobId', label:'Job ID'}, {name:'nodeId', label:'Node ID'}]} onSubmit={handleCreate} />
    </div>
  );
}
