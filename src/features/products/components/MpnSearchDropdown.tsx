import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { productsService } from '../services/products.service';
import { cn } from '@/shared/components/ui/utils';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface MpnSearchDropdownProps {
    productId: string;
    revisionId: string;
    onSelect: (part: any) => void;
    className?: string;
    placeholder?: string;
}

export function MpnSearchDropdown({ productId, revisionId, onSelect, className, placeholder }: MpnSearchDropdownProps) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<{ local: any[]; octopart: any[] }>({ local: [], octopart: [] });
    const [loading, setLoading] = React.useState(false);

    // Debounced search
    React.useEffect(() => {
        if (query.length < 3) {
            setResults({ local: [], octopart: [] });
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await productsService.searchParts(productId, revisionId, query);
                setResults(data);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, productId, revisionId]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        'flex h-10 w-full items-center justify-between rounded-md border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-sm ring-offset-background transition-all hover:border-cyan-500/30 hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer overflow-hidden backdrop-blur-sm',
                        className,
                    )}>
                    <span className={cn('truncate font-medium', !query && 'text-slate-500')}>{query || placeholder || t('dashboard.products.drawer.search_mpn_placeholder')}</span>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin shrink-0 text-cyan-400" /> : <Search className={cn("h-4 w-4 shrink-0 transition-colors", open ? "text-cyan-400" : "text-slate-500")} />}
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-slate-700/50 bg-slate-950/90 backdrop-blur-xl w-[var(--radix-popover-trigger-width)] shadow-2xl overflow-hidden" align="start">
                <Command shouldFilter={false} className="bg-transparent">
                    <CommandInput 
                        placeholder={t('dashboard.products.drawer.search_mpn_hint')} 
                        value={query} 
                        onValueChange={setQuery}
                        className="border-none focus:ring-0 text-white placeholder:text-slate-500"
                    />
                    <CommandList className="max-h-none border-t border-slate-800/50">
                        {loading && (
                            <div className="flex items-center justify-center py-8 gap-2 text-cyan-400 font-medium animate-pulse">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-xs uppercase tracking-widest">{t('common.actions.searching')}</span>
                            </div>
                        )}
                        {!loading && query.length >= 3 && results.local.length === 0 && results.octopart.length === 0 && (
                            <div className="py-8 text-center bg-slate-900/20">
                                <span className="text-sm text-slate-500 font-medium italic">{t('common.empty.no_data')}</span>
                            </div>
                        )}

                        <ScrollArea className="h-72">
                            {results.local.length > 0 && (
                                <CommandGroup 
                                    heading={
                                        <div className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <div className="h-1 w-1 rounded-full bg-slate-500" />
                                            {t('dashboard.products.drawer.local_inventory')}
                                        </div>
                                    }
                                    className="p-1"
                                >
                                    {results.local.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.id}
                                            onSelect={() => {
                                                onSelect(item);
                                                setOpen(false);
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-slate-800/50 cursor-pointer data-[selected=true]:bg-slate-800/80">
                                            <div className="h-8 w-8 rounded bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shrink-0">
                                                <Search className="h-3 w-3 text-slate-500" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-white uppercase truncate text-xs">{item.mpn || item.name}</span>
                                                <span className="text-[10px] text-slate-400 truncate">{item.manufacturer || 'Unknown'}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {results.octopart.length > 0 && (
                                <CommandGroup 
                                    heading={
                                        <div className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
                                            <div className="h-1 w-1 rounded-full bg-cyan-400" />
                                            {t('dashboard.products.drawer.octopart_results')}
                                        </div>
                                    }
                                    className="p-1 border-t border-slate-800/50"
                                >
                                    {results.octopart.map((part) => (
                                        <CommandItem
                                            key={part.id}
                                            value={part.id}
                                            onSelect={() => {
                                                onSelect(part);
                                                setOpen(false);
                                                setQuery(part.mpn);
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-cyan-500/5 cursor-pointer data-[selected=true]:bg-cyan-500/10 group">
                                            <div className="h-10 w-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-lg border border-slate-700/50">
                                                {part.image ? (
                                                    <img src={part.image} alt={part.mpn} className="h-full w-full object-contain transition-transform group-hover:scale-110" />
                                                ) : (
                                                    <Search className="h-4 w-4 text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="font-bold text-white uppercase truncate text-xs group-hover:text-cyan-400 transition-colors">{part.mpn}</span>
                                                <span className="text-[10px] text-cyan-400/80 truncate font-semibold">{part.manufacturer?.name || part.manufacturer}</span>
                                                {part.description && <span className="text-[10px] text-slate-500 truncate mt-0.5 italic">{part.description}</span>}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
