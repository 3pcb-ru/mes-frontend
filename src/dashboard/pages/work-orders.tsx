import { useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { workOrdersService } from '@/features/work-orders/services/work-orders.service';
import type { WorkOrderListItem } from '@/features/work-orders/types/work-orders.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';

export function WorkOrdersPage() {
  const [items, setItems] = useState<WorkOrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = async () => { try { const data = await workOrdersService.listWorkOrders(); setItems(Array.isArray(data) ? data : []); } catch (err) { console.error(err); setItems([]); } finally { setIsLoading(false); } };
  useEffect(()=>{ fetch(); }, []);
  const handleCreate = async (values:any) => { await workOrdersService.createWorkOrder(values); await fetch(); };
  const filtered = Array.isArray(items) ? items.filter(w=> (w.bomRevisionId || '').toLowerCase().includes(search.toLowerCase())) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Work Orders</h1>
          <p className="text-slate-400">Create and track work orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search BOM revision..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button onClick={()=>setIsOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4"/>Add</Button>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50 pb-6"><CardTitle className="text-white">Work Orders</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (<div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="h-8 w-8 animate-spin text-cyan-500"/><p className="text-slate-400">Loading work orders...</p></div>) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/40">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">BOM Rev</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Target Qty</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Planned Start</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filtered.map(w=>(<tr key={w.id} className="hover:bg-slate-800/30"><td className="px-6 py-4">{w.bomRevisionId}</td><td className="px-6 py-4">{w.targetQuantity}</td><td className="px-6 py-4">{w.plannedStartDate||'-'}</td><td className="px-6 py-4 text-right"></td></tr>))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CrudWizard isOpen={isOpen} onClose={()=>setIsOpen(false)} title="Create Work Order" fields={[
        {name:'bomRevisionId', label:'BOM Revision ID', required:true, hint:'Bill of Materials revision ID to use for this order'},
        {name:'targetQuantity', label:'Target Quantity', type:'number', required:true, hint:'Number of units to produce'},
        {name:'plannedStartDate', label:'Planned Start Date', hint:'Optional: ISO date (YYYY-MM-DD)'}
      ]} onSubmit={handleCreate} />
    </div>
  );
}
