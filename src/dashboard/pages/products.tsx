import { useEffect, useState } from 'react';
import { Package, Search, Loader2, Plus } from 'lucide-react';
import { productsService } from '@/features/products/services/products.service';
import type { ProductListItem } from '@/features/products/types/products.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import CrudWizard from '@/shared/components/crud-wizard';
import { TableActions } from '@/shared/components/table-actions';
import { getModuleActions } from '@/shared/lib/module-actions-config';

export function ProductsPage() {
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<ProductListItem | null>(null);
  const moduleActions = getModuleActions('products');

  const fetch = async () => {
    try {
      const data = await productsService.listProducts();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('API Error:', err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (values: any) => {
    try {
      if (editingItem) {
        await productsService.updateProduct(editingItem.id, values);
      } else {
        await productsService.createProduct(values);
      }
      setEditingItem(null);
      await fetch();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (id: string) => {
    const item = items.find(p => p.id === id);
    if (item) {
      setEditingItem(item);
      setIsOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsService.deleteProduct(id);
      await fetch();
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  };

  const handleCloseWizard = () => {
    setIsOpen(false);
    setEditingItem(null);
  };

  const filtered = Array.isArray(items) ? items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())) : [];

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
                    {(moduleActions.canEdit || moduleActions.canDelete) && (
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filtered.map((p)=> (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 text-white">{p.sku || '—'}</td>
                      <td className="px-6 py-4 text-white">{p.name || '—'}</td>
                      <td className="px-6 py-4 text-slate-400">{p.tenantId || '—'}</td>
                      {(moduleActions.canEdit || moduleActions.canDelete) && (
                        <td className="px-6 py-4 text-right">
                          <TableActions 
                            id={p.id} 
                            onEdit={moduleActions.canEdit ? handleEdit : undefined}
                            onDelete={moduleActions.canDelete ? handleDelete : undefined}
                            itemName="product"
                          />
                        </td>
                      )}
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
        onClose={handleCloseWizard}
        title={editingItem ? "Edit Product" : "Create Product"}
        mode={editingItem ? "edit" : "create"}
        fields={[
          {name:'sku', label:'SKU', required:true, hint:'Stock Keeping Unit - unique identifier for the product (e.g., PROD-001)'},
          {name:'name', label:'Name', required:true, hint:'Product name or description (e.g., GPS Module)'}
        ]}
        initialData={editingItem || {}}
        onSubmit={handleCreate}
      />
    </div>
  );
}
