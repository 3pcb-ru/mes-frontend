import { useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { facilitiesService } from '@/features/facilities/services/facilities.service';
import type { FacilityListItem } from '@/features/facilities/types/facilities.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';

export function FacilitiesPage() {
  const [items, setItems] = useState<FacilityListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    try {
      const data = await facilitiesService.listFacilities();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally { setIsLoading(false); }
  };

  useEffect(()=>{ fetch(); }, []);

  const handleCreate = async (values: any) => {
    await facilitiesService.createFacility(values);
    await fetch();
  };

  const filtered = Array.isArray(items) ? items.filter((f)=> f.name.toLowerCase().includes(search.toLowerCase()) || f.path.toLowerCase().includes(search.toLowerCase())) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Facilities</h1>
          <p className="text-slate-400">Manage facility hierarchy and nodes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search facilities..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button onClick={()=>setIsOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4"/>Add</Button>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50 pb-6"><CardTitle className="text-white">Facility List</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="h-8 w-8 animate-spin text-cyan-500"/><p className="text-slate-400">Loading facilities...</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/40">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Path</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filtered.map((f)=> (
                    <tr key={f.id} className="hover:bg-slate-800/30"><td className="px-6 py-4">{f.path}</td><td className="px-6 py-4">{f.name}</td><td className="px-6 py-4">{f.status || '-'}</td><td className="px-6 py-4 text-right"></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CrudWizard isOpen={isOpen} onClose={()=>setIsOpen(false)} title="Create Facility" fields={[
        {name:'path', label:'Path', required:true, hint:'Facility hierarchy path in ltree format (e.g., Factory.Line1.Oven)'},
        {name:'name', label:'Name', required:true, hint:'Human-readable facility name'},
        {name:'parentId', label:'Parent ID', hint:'Optional: ID of parent facility node for hierarchy'}
      ]} onSubmit={handleCreate} />
    </div>
  );
}
