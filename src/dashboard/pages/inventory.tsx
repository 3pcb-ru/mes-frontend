import { useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { inventoryService } from '@/features/inventory/services/inventory.service';
import type { ContainerListItem } from '@/features/inventory/types/inventory.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';

export function InventoryPage() {
  const [items, setItems] = useState<ContainerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = async () => { try { const data = await inventoryService.listContainers(); setItems(data || []); } catch (err) { console.error(err); } finally { setIsLoading(false); } };
  useEffect(()=>{ fetch(); }, []);
  const handleCreate = async (values:any) => { await inventoryService.createContainer(values); await fetch(); };
  const filtered = items.filter(c=> c.lpn.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Containers</h1>
          <p className="text-slate-400">Manage containers and locations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search LPN..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button onClick={()=>setIsOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4"/>Add</Button>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50 pb-6"><CardTitle>Containers</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (<div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="h-8 w-8 animate-spin text-cyan-500"/><p className="text-slate-400">Loading containers...</p></div>) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/40">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">LPN</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Location</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filtered.map(c=>(<tr key={c.id} className="hover:bg-slate-800/30"><td className="px-6 py-4">{c.lpn}</td><td className="px-6 py-4">{c.type||'-'}</td><td className="px-6 py-4">{c.locationNodeId||'-'}</td><td className="px-6 py-4 text-right"></td></tr>))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CrudWizard isOpen={isOpen} onClose={()=>setIsOpen(false)} title="Create Container" fields={[{name:'lpn', label:'LPN', required:true}, {name:'type', label:'Type'}, {name:'locationNodeId', label:'Location Node ID'}]} onSubmit={handleCreate} />
    </div>
  );
}
