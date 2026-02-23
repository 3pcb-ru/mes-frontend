import { useEffect, useState } from 'react';
import { Package, Search, Loader2, Plus } from 'lucide-react';
import { productsService } from '@/features/products/services/products.service';
import type { ProductListItem } from '@/features/products/types/products.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';

export function ProductsPage() {
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    try {
      const data = await productsService.listProducts();
      console.log('API Response:', data);
      console.log('Is Array?', Array.isArray(data));
      console.log('Data Type:', typeof data);
      const itemsToSet = Array.isArray(data) ? data : [];
      console.log('Items to set:', itemsToSet);
      console.log('First item:', itemsToSet[0]);
      setItems(itemsToSet);
    } catch (err) {
      console.error('API Error:', err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (values: any) => {
    await productsService.createProduct(values);
    await fetch();
  };

  const filtered = Array.isArray(items) ? items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())) : [];

  useEffect(() => {
    console.log('Items:', items);
    console.log('Search:', search);
    console.log('Filtered:', filtered);
  }, [items, search, filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-slate-400">Manage product catalog and SKUs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search products..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
          <Button onClick={()=>setIsOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50 pb-6">
          <CardTitle className="text-white">Product List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
              <p className="text-slate-400">Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Package className="h-8 w-8 text-slate-500" />
              <p className="text-slate-400">No products found</p>
              {items.length > 0 && <p className="text-slate-500 text-sm">(Total: {items.length}, Filtered: {filtered.length})</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/40">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">SKU</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Tenant</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filtered.map((p)=> (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 text-white">{p.sku || '—'}</td>
                      <td className="px-6 py-4 text-white">{p.name || '—'}</td>
                      <td className="px-6 py-4 text-slate-400">{p.tenantId || '—'}</td>
                      <td className="px-6 py-4 text-right"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CrudWizard
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        title="Create Product"
        fields={[
          {name:'sku', label:'SKU', required:true, hint:'Stock Keeping Unit - unique identifier for the product (e.g., PROD-001)'},
          {name:'name', label:'Name', required:true, hint:'Product name or description (e.g., GPS Module)'}
        ]}
        onSubmit={handleCreate}
      />
    </div>
  );
}
