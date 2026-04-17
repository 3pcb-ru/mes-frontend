import { useEffect, useState, useMemo } from 'react';
import { Package, Plus, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/features/products/store/products.store';
import { type Product, type CreateProductDto } from '@/features/products/types/products.schema';
import { type BomRevision, type BomMaterial } from '@/features/products/types/bom.schema';
import { productsService } from '@/features/products/services/products.service';
import type { ApiError } from '@/shared/lib/api-client';
import { Button } from '@/shared/components/ui/button';
import { DataTableGrid, type ColumnDef } from '@/shared/components/ui/data-table-grid';
import { SlideOutDrawer } from '@/shared/components/ui/slide-out-drawer';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { TableActions } from '@/shared/components/table-actions';
import { getModuleActions } from '@/shared/lib/module-actions-config';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { StatusBadge } from '@/shared/components/ui/status-badge';

type ViewMode = 'products' | 'revisions' | 'materials';

export function ProductsPage() {
    const { t } = useTranslation();
    const { items, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();

    // Drill-down state
    const [viewMode, setViewMode] = useState<ViewMode>('products');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedRevision, setSelectedRevision] = useState<BomRevision | null>(null);
    const [revisions, setRevisions] = useState<BomRevision[]>([]);
    const [materials, setMaterials] = useState<BomMaterial[]>([]);
    const [isLoadingSub, setIsLoadingSub] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingItem, setEditingItem] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});

    const moduleActions = getModuleActions('products');

    useEffect(() => {
        fetchProducts().catch((err: ApiError) => {
            console.error('Failed to load products', err);
            toast.error(err.message || t('dashboard.products.messages.load_failed'));
        });
    }, [fetchProducts, t]);

    const handleProductClick = async (product: Product) => {
        setSelectedProduct(product);
        setIsLoadingSub(true);
        try {
            const data = await productsService.listRevisions(product.id);
            setRevisions(data);
            setViewMode('revisions');
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || 'Failed to load revisions');
        } finally {
            setIsLoadingSub(false);
        }
    };

    const handleRevisionClick = async (revision: BomRevision) => {
        if (!selectedProduct) return;
        setSelectedRevision(revision);
        setIsLoadingSub(true);
        try {
            const data = await productsService.listMaterials(selectedProduct.id, revision.id);
            setMaterials(data);
            setViewMode('materials');
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || 'Failed to load materials');
        } finally {
            setIsLoadingSub(false);
        }
    };

    const handleBackToProducts = () => {
        setViewMode('products');
        setSelectedProduct(null);
        setSelectedRevision(null);
        setRevisions([]);
        setMaterials([]);
    };

    const handleBackToRevisions = () => {
        setViewMode('revisions');
        setSelectedRevision(null);
        setMaterials([]);
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                const payload = {
                    name: formData.name || editingItem.name,
                    sku: formData.sku || editingItem.sku,
                };
                await updateProduct(editingItem.id, payload);
                toast.success(t('dashboard.products.messages.update_success'));
            } else {
                const payload: CreateProductDto = {
                    sku: formData.sku!,
                    name: formData.name!,
                };
                await createProduct(payload);
                toast.success(t('dashboard.products.messages.create_success'));
            }
            handleCloseDrawer();
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || t('dashboard.products.messages.save_failed'));
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
            await deleteProduct(id);
            toast.success(t('dashboard.products.messages.delete_success'));
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || t('dashboard.products.messages.delete_failed'));
        }
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    // --- REVISION ACTIONS ---

    const handleCreateRevision = async () => {
        if (!selectedProduct) return;
        try {
            await productsService.createRevision(selectedProduct.id, {});
            toast.success('Revision created');
            const data = await productsService.listRevisions(selectedProduct.id);
            setRevisions(data);
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || 'Failed to create revision');
        }
    };

    const handleDuplicateRevision = async (revisionId: string) => {
        if (!selectedProduct) return;
        try {
            await productsService.duplicateRevision(selectedProduct.id, revisionId);
            toast.success('Revision duplicated');
            const data = await productsService.listRevisions(selectedProduct.id);
            setRevisions(data);
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || 'Failed to duplicate revision');
        }
    };

    const handleDeleteRevision = async (revisionId: string) => {
        if (!selectedProduct) return;
        try {
            await productsService.deleteRevision(selectedProduct.id, revisionId);
            toast.success('Revision deleted');
            const data = await productsService.listRevisions(selectedProduct.id);
            setRevisions(data);
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || 'Failed to delete revision');
        }
    };

    const handleStatusTransition = async (revisionId: string, action: 'submit' | 'approve' | 'activate') => {
        if (!selectedProduct) return;
        try {
            if (action === 'submit') await productsService.submitRevision(selectedProduct.id, revisionId);
            if (action === 'approve') await productsService.approveRevision(selectedProduct.id, revisionId);
            if (action === 'activate') await productsService.activateRevision(selectedProduct.id, revisionId);

            toast.success(`Revision ${action}ed`);
            const data = await productsService.listRevisions(selectedProduct.id);
            setRevisions(data);
        } catch (err) {
            const apiError = err as ApiError;
            toast.error(apiError.message || `Failed to ${action} revision`);
        }
    };

    const productColumns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: t('dashboard.products.table.sku'),
                accessorKey: 'sku',
                className: 'font-mono text-xs text-slate-400',
            },
            {
                header: t('dashboard.products.table.name'),
                accessorKey: 'name',
                className: 'font-medium text-white',
            },
            {
                header: t('dashboard.products.table.status'),
                accessorKey: 'status',
                cell: (item) => <StatusBadge status={item.status || 'draft'} />,
            },
            {
                header: t('dashboard.products.table.active_revision'),
                accessorKey: 'activeRevisionVersion',
                cell: (item) =>
                    item.activeRevisionVersion ? <span className="text-cyan-400 font-medium">{item.activeRevisionVersion}</span> : <span className="text-slate-500">—</span>,
            },
            {
                header: t('dashboard.products.table.revisions_count'),
                accessorKey: 'totalRevisions',
                cell: (item) => (
                    <Button variant="ghost" size="sm" onClick={() => handleProductClick(item)} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-8 gap-1.5 px-2">
                        {item.totalRevisions || 0}
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                ),
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
        ],
        [t, moduleActions],
    );

    const revisionColumns: ColumnDef<BomRevision>[] = useMemo(
        () => [
            {
                header: t('dashboard.products.table.version'),
                accessorKey: 'version',
                cell: (item) => (
                    <Button variant="link" className="p-0 h-auto text-cyan-400 hover:text-cyan-300 font-bold" onClick={() => handleRevisionClick(item)}>
                        {item.version}
                    </Button>
                ),
            },
            {
                header: t('dashboard.products.table.status'),
                accessorKey: 'status',
                cell: (item) => <StatusBadge status={item.status} />,
            },
            {
                header: t('common.table.created_at'),
                accessorKey: 'createdAt',
                cell: (item) => new Date(item.createdAt).toLocaleDateString(),
                className: 'text-slate-400 text-sm hidden sm:table-cell',
                headerClassName: 'hidden sm:table-cell',
            },
            {
                header: t('common.table.actions'),
                headerClassName: 'text-right pr-4',
                className: 'text-right',
                cell: (item) => (
                    <div className="flex justify-end items-center gap-2">
                        {item.status === 'draft' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusTransition(item.id, 'submit')}
                                className="h-7 text-[10px] px-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                {t('common.actions.submit') || 'Submit'}
                            </Button>
                        )}
                        {item.status === 'submitted' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusTransition(item.id, 'approve')}
                                className="h-7 text-[10px] px-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                {t('common.actions.approve') || 'Approve'}
                            </Button>
                        )}
                        {item.status === 'approved' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusTransition(item.id, 'activate')}
                                className="h-7 text-[10px] px-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                {t('common.actions.activate') || 'Activate'}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicateRevision(item.id)}
                            className="h-8 w-8 text-cyan-400 hover:bg-cyan-500/10"
                            title="Duplicate">
                            <Plus className="h-4 w-4" />
                        </Button>
                        {item.status === 'draft' && <TableActions id={item.id} onDelete={handleDeleteRevision} itemName="Revision" />}
                    </div>
                ),
            },
        ],
        [t, handleStatusTransition, handleDuplicateRevision, handleDeleteRevision],
    );

    const materialColumns: ColumnDef<BomMaterial>[] = useMemo(
        () => [
            {
                header: t('dashboard.products.table.mpn'),
                accessorKey: 'mpn',
                className: 'font-bold text-white',
            },
            {
                header: t('dashboard.products.table.manufacturer'),
                accessorKey: 'manufacturer',
                cell: (item) => item.manufacturer || <span className="text-slate-500">—</span>,
                className: 'text-slate-300',
            },
            {
                header: t('dashboard.products.table.quantity'),
                accessorKey: 'quantity',
                className: 'text-center w-20',
                headerClassName: 'text-center w-20',
            },
            {
                header: t('dashboard.products.table.designators'),
                accessorKey: 'designators',
                cell: (item) => item.designators?.join(', ') || <span className="text-slate-500">—</span>,
                className: 'max-w-[200px] truncate italic text-slate-400',
            },
            {
                header: t('dashboard.products.table.alternatives'),
                accessorKey: 'alternatives',
                cell: () => <span className="text-slate-500">—</span>,
                className: 'hidden lg:table-cell',
                headerClassName: 'hidden lg:table-cell',
            },
        ],
        [t],
    );

    const currentTitle = useMemo(() => {
        if (viewMode === 'products') return t('dashboard.products.title');
        if (viewMode === 'revisions' && selectedProduct) return t('dashboard.products.breadcrumbs.revisions', { name: selectedProduct.name });
        if (viewMode === 'materials' && selectedRevision) return t('dashboard.products.breadcrumbs.materials', { version: selectedRevision.version });
        return '';
    }, [viewMode, selectedProduct, selectedRevision, t]);

    const filteredItems = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (viewMode === 'products') {
            return items.filter((p) => p.name?.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query));
        }
        if (viewMode === 'revisions') {
            return revisions.filter((r) => r.version.toLowerCase().includes(query));
        }
        if (viewMode === 'materials') {
            return materials.filter((m) => m.mpn?.toLowerCase().includes(query) || m.manufacturer?.toLowerCase().includes(query));
        }
        return [];
    }, [items, revisions, materials, viewMode, searchQuery]);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-4 shrink-0">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={handleBackToProducts} className="cursor-pointer">
                                {t('dashboard.products.breadcrumbs.products')}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {selectedProduct && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    {viewMode === 'revisions' ? (
                                        <BreadcrumbPage>{selectedProduct.name}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink onClick={handleBackToRevisions} className="cursor-pointer">
                                            {selectedProduct.name}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </>
                        )}
                        {selectedRevision && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{selectedRevision.version}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-4">
                        {viewMode !== 'products' && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={viewMode === 'materials' ? handleBackToRevisions : handleBackToProducts}
                                className="h-10 w-10 border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white shrink-0">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-white antialiased">{currentTitle}</h1>
                            {viewMode === 'products' && <p className="text-slate-400 mt-1">{t('dashboard.products.description')}</p>}
                        </div>
                    </div>
                    {(viewMode === 'products' || viewMode === 'revisions') && (
                        <div className="flex items-center gap-3 shrink min-w-0">
                            {viewMode === 'products' ? (
                                <Button id="add-product-button" onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                                    <Plus className="h-4 w-4" /> {t('dashboard.products.add_button')}
                                </Button>
                            ) : (
                                <Button id="add-revision-button" onClick={handleCreateRevision} className="flex items-center gap-2 whitespace-nowrap shrink-0">
                                    <Plus className="h-4 w-4" /> {t('common.actions.create') || 'Create'}{' '}
                                    {t('dashboard.products.breadcrumbs.revisions', { name: '' }).replace(': ', '')}
                                    {/* Small hack for label, I'll use a clearer one if possible */}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-y-auto">
                <DataTableGrid
                    data={filteredItems as any}
                    columns={viewMode === 'products' ? productColumns : viewMode === 'revisions' ? revisionColumns : (materialColumns as any)}
                    isLoading={isLoading || isLoadingSub}
                    onSearch={setSearchQuery}
                    searchPlaceholder={t('dashboard.products.search_placeholder')}
                    pageCount={1}
                />
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
                        <Input
                            id="product-sku-input"
                            required
                            value={formData.sku || ''}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder={t('dashboard.products.drawer.sku_placeholder')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            {t('dashboard.products.drawer.name')} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="product-name-input"
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t('dashboard.products.drawer.name_placeholder')}
                        />
                    </div>
                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
                        <Button id="cancel-product-button" type="button" variant="outline" onClick={handleCloseDrawer}>
                            {t('common.actions.cancel')}
                        </Button>
                        <Button id="save-product-button" type="submit">
                            {t('common.actions.save')}
                        </Button>
                    </div>
                </form>
            </SlideOutDrawer>
        </div>
    );
}
