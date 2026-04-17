import { Info, Pin, PinOff, Share2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { VibeRenderer } from '@/features/vibe/components/vibe-renderer';
import { useVibeStore } from '@/features/vibe/store/vibe.store';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDeleteDialog } from '@/shared/components/ui/confirm-delete-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

export const VibePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { pages, fetchPages, deletePage, updatePage } = useVibeStore();
    const [showInfo, setShowInfo] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (pages.length === 0) {
            fetchPages();
        }
    }, [pages.length, fetchPages]);

    const page = useMemo(() => pages.find((p) => p.id === id), [pages, id]);

    if (!page) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48 bg-slate-800" />
                    <Skeleton className="h-10 w-24 bg-slate-800" />
                </div>
                <Skeleton className="h-[600px] w-full bg-slate-800 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1 bg-cyan-500 rounded-full" />
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{page.name}</h1>
                        <p className="text-sm text-slate-400">
                            {t('dashboard.sidebar.vibe.general.labels.category', 'Category:')} <span className="text-cyan-400 font-medium">{page.category}</span>
                            {page.isOwnerCreated && (
                                <span className="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase border border-purple-500/20">
                                    <Share2 className="h-3 w-3" /> {t('dashboard.sidebar.vibe.general.labels.shared_by_owner', 'Shared by Owner')}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Pin/Share Button (Owner only) */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updatePage(page.id, { isOwnerCreated: !page.isOwnerCreated })}
                        className={cn(
                            'transition-all duration-300',
                            page.isOwnerCreated ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white',
                        )}
                        title={
                            page.isOwnerCreated
                                ? t('dashboard.sidebar.vibe.general.actions.unpin', 'Unpin from Org')
                                : t('dashboard.sidebar.vibe.general.actions.pin', 'Pin to Org')
                        }>
                        {page.isOwnerCreated ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
                    </Button>

                    {/* Page Info Dialog */}
                    <Dialog open={showInfo} onOpenChange={setShowInfo}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-slate-900/50 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                                title={t('dashboard.sidebar.vibe.general.actions.page_info', 'Page info')}>
                                <Info className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    <Info className="h-5 w-5 text-cyan-400" />
                                    {t('dashboard.sidebar.vibe.general.labels.page_details', 'Page Protocol Details')}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    {t('dashboard.sidebar.vibe.general.labels.page_details_desc', 'Technical specifications and AI generation context for this vibe page.')}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Page ID</p>
                                        <p className="font-mono text-xs text-slate-300 break-all">{page.id}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Creation Category</p>
                                        <Badge variant="outline" className="protocol-badge">
                                            {page.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Internal Configuration (Protocol v1.0)</p>
                                    <pre className="text-[10px] font-mono text-cyan-400/80 max-h-[200px] overflow-y-auto bg-black/30 p-3 rounded border border-slate-800/50">
                                        {JSON.stringify(page.config, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300">
                        <Trash2 className="h-4 w-4 mr-2" /> {t('common.actions.delete', 'Delete')}
                    </Button>

                    <ConfirmDeleteDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onConfirm={async () => {
                            setIsDeleting(true);
                            await deletePage(page.id);
                            setIsDeleting(false);
                            setIsDeleteDialogOpen(false);
                            navigate('/dashboard');
                        }}
                        isDeleting={isDeleting}
                        title={t('dashboard.sidebar.vibe.general.labels.delete_page_title', 'Delete Custom Page')}
                        description={t('dashboard.sidebar.vibe.general.messages.confirm_delete_page', 'Are you sure you want to delete this custom page?')}
                    />
                </div>
            </div>

            {/* Renderer */}
            <VibeRenderer config={page.config} />

            <div className="text-center text-[10px] text-slate-600 uppercase tracking-widest py-4">
                {t('dashboard.sidebar.vibe.general.labels.protocol_version', 'Rendered via MES Vibe Agent Protocol v1.0')}
            </div>
        </div>
    );
};
