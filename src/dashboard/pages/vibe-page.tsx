import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useVibeStore } from '@/features/vibe/store/vibe.store';
import { VibeRenderer } from '@/features/vibe/components/vibe-renderer';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { Trash2, Share2, Info } from 'lucide-react';

export const VibePage = () => {
    const { id } = useParams<{ id: string }>();
    const { pages, fetchPages, deletePage } = useVibeStore();

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
                            Category: <span className="text-cyan-400 font-medium">{page.category}</span>
                            {page.isOwnerCreated && (
                                <span className="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase border border-purple-500/20">
                                    <Share2 className="h-3 w-3" /> Shared by Owner
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-900/50 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" title="Page info">
                        <Info className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this custom page?')) {
                                deletePage(page.id);
                                window.location.href = '/dashboard';
                            }
                        }}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>

            {/* Renderer */}
            <VibeRenderer config={page.config} />

            <div className="text-center text-[10px] text-slate-600 uppercase tracking-widest py-4">Rendered via MES Vibe Agent Protocol v1.0</div>
        </div>
    );
};
