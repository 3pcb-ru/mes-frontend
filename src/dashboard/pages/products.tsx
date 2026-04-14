import { useEffect, useState, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';

export function ProductsPage() {
    const { t } = useTranslation();
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
            toast.error(err?.message || t('dashboard.products.messages.load_failed'));
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
                toast.success(t('dashboard.products.messages.update_success'));
            } else {
                await productsService.createProduct(payload);
                toast.success(t('dashboard.products.messages.create_success'));
            }
            handleCloseDrawer();
            await fetchProducts();
        } catch (err: any) {
            console.error('Error saving product:', err);
            toast.error(err?.message || t('dashboard.products.messages.save_failed'));
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
            toast.success(t('dashboard.products.messages.delete_success'));
            await fetchProducts();
        } catch (err: any) {
            console.error('Delete error:', err);
            toast.error(err?.message || t('dashboard.products.messages.delete_failed'));
        }
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const filteredItems = items.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '' || p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || '');

    const columns: ColumnDef<ProductListItem>[] = useMemo(() => [
        { 
            header: t('dashboard.products.table.sku'), 
            accessorKey: 'sku',
            className: 'hidden sm:table-cell',
            headerClassName: 'hidden sm:table-cell'
        },
        { header: t('dashboard.products.table.name'), accessorKey: 'name' },
        { 
            header: t('dashboard.products.table.organization'), 
            accessorKey: 'organizationId',
            className: 'hidden lg:table-cell',
            headerClassName: 'hidden lg:table-cell'
        },
        {
            header: t('dashboard.products.table.actions'),
            headerClassName: 'text-right pr-4',
            className: 'text-right',
            cell: (item) =>
                (moduleActions.canEdit || moduleActions.canDelete) && (
                    <div className="flex justify-end pr-0">
                        <TableActions
                            id={item.id}
                            onEdit={moduleActions.canEdit ? handleEdit : undefined}
                            onDelete={moduleActions.canDelete ? handleDelete : undefined}
                            itemName={t('common.entities.product')}
                        />
                    </div>
                ),
        },
    ], [t, moduleActions]);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard.products.title')}</h1>
                    <p className="text-slate-400">{t('dashboard.products.description')}</p>
                </div>
                <div className="flex items-center gap-3 shrink min-w-0">
                    <Button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                        <Plus className="h-4 w-4" /> {t('dashboard.products.add_button')}
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-y-auto">
                <DataTableGrid data={filteredItems} columns={columns} isLoading={isLoading} onSearch={setSearchQuery} searchPlaceholder={t('dashboard.products.search_placeholder')} pageCount={1} />
            </div>

            <SlideOutDrawer
                open={isDrawerOpen}
                onOpenChange={(open) => !open && handleCloseDrawer()}
                title={editingItem ? t('dashboard.products.drawer.title_edit') : t('dashboard.products.drawer.title_create')}
                description={t('dashboard.products.drawer.description')}>
                <form onSubmit={handleCreateOrUpdate} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>
                            {t('dashboard.products.drawer.sku')} <span className="text-destructive">*</span>
                        </Label>
                        <Input required value={formData.sku || ''} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder={t('dashboard.products.drawer.sku_placeholder')} />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            {t('dashboard.products.drawer.name')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t('dashboard.products.drawer.name_placeholder')}
                        />
                    </div>
                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
                        <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                            {t('common.actions.cancel')}
                        </Button>
                        <Button type="submit">{t('common.actions.save')}</Button>
                    </div>
                </form>
            </SlideOutDrawer>
        </div>
    );
}
