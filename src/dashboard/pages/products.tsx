import { useEffect, useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { productsService } from '@/features/products/services/products.service';
import type { ProductListItem } from '@/features/products/types/products.types';
import { Button } from '@/shared/components/ui/button';
import { DataTableGrid, type ColumnDef } from '@/shared/components/ui/data-table-grid';
import { SlideOutDrawer } from '@/shared/components/ui/slide-out-drawer';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { TableActions } from '@/shared/components/table-actions';
import { getModuleActions } from '@/shared/lib/module-actions-config';

export function ProductsPage() {
    const [items, setItems] = useState<ProductListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingItem, setEditingItem] = useState<ProductListItem | null>(null);
    const [formData, setFormData] = useState<Partial<ProductListItem>>({});

    const moduleActions = getModuleActions('products');

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await productsService.listProducts();
            setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Failed to load products');
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, sku: formData.sku!, name: formData.name! };
            if (editingItem) {
                await productsService.updateProduct(editingItem.id, payload);
                toast.success('Product updated successfully');
            } else {
                await productsService.createProduct(payload);
                toast.success('Product created successfully');
            }
            handleCloseDrawer();
            await fetchProducts();
        } catch (err: any) {
            console.error('Error saving product:', err);
            toast.error(err?.message || 'Failed to save product');
        }
    };

    const handleEdit = (id: string) => {
        const item = items.find((p) => p.id === id);
        if (item) {
            setEditingItem(item);
            setFormData(item);
            setIsDrawerOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await productsService.deleteProduct(id);
            toast.success('Product deleted successfully');
            await fetchProducts();
        } catch (err: any) {
            console.error('Delete error:', err);
            toast.error(err?.message || 'Failed to delete product');
        }
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const filteredItems = items.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '' || p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || '');

    const columns: ColumnDef<ProductListItem>[] = [
        { header: 'SKU', accessorKey: 'sku' },
        { header: 'Name', accessorKey: 'name' },
        { header: 'Organization', accessorKey: 'organizationId' },
        {
            header: 'Actions',
            cell: (item) =>
                (moduleActions.canEdit || moduleActions.canDelete) && (
                    <div className="flex justify-end pr-4">
                        <TableActions
                            id={item.id}
                            onEdit={moduleActions.canEdit ? handleEdit : undefined}
                            onDelete={moduleActions.canDelete ? handleDelete : undefined}
                            itemName="product"
                        />
                    </div>
                ),
        },
    ];

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Master Data: Products</h1>
                    <p className="text-slate-400">Manage your central engineering product catalog and SKUs.</p>
                </div>
                <div className="flex items-center gap-3 shrink min-w-0">
                    <Button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                        <Plus className="h-4 w-4" /> Add Product
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-y-auto">
                <DataTableGrid data={filteredItems} columns={columns} isLoading={isLoading} onSearch={setSearchQuery} searchPlaceholder="Search by SKU or Name..." pageCount={1} />
            </div>

            <SlideOutDrawer
                open={isDrawerOpen}
                onOpenChange={(open) => !open && handleCloseDrawer()}
                title={editingItem ? 'Edit Product' : 'Create Product'}
                description="Manage specific product configurations and master data definition.">
                <form onSubmit={handleCreateOrUpdate} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>
                            SKU <span className="text-destructive">*</span>
                        </Label>
                        <Input required value={formData.sku || ''} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. PROD-001" />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Navigation GPS Module v2"
                        />
                    </div>
                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
                        <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Product</Button>
                    </div>
                </form>
            </SlideOutDrawer>
        </div>
    );
}
