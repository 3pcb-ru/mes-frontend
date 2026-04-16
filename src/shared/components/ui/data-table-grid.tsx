import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Input } from './input';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Search, Inbox } from 'lucide-react';
import { Skeleton } from './skeleton';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    headerClassName?: string;
    className?: string;
}

interface DataTableGridProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    pageCount?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    isLoading?: boolean;
    className?: string;
}

export function DataTableGrid<T>({
    data,
    columns,
    onSearch,
    searchPlaceholder = 'Search...',
    pageCount = 1,
    currentPage = 1,
    onPageChange,
    isLoading = false,
    className,
}: DataTableGridProps<T>) {
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (onSearch) onSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, onSearch]);

    return (
        <div className={cn("flex flex-col gap-4 w-full", className)}>
            {onSearch && (
                <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                    </div>
                </div>
            )}

            <div className="rounded-md border border-slate-700/50 bg-slate-900/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, idx) => (
                                <TableHead key={idx} className={col.headerClassName}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, rowIdx) => (
                                <TableRow key={`skeleton-${rowIdx}`} className="border-b border-slate-700/30">
                                    {columns.map((col, colIdx) => (
                                        <TableCell key={`skeleton-cell-${colIdx}`} className={col.className}>
                                            <Skeleton className="h-6 w-full bg-slate-800/50" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length ? (
                            data.map((item, rowIdx) => (
                                <TableRow key={rowIdx} className="hover:bg-slate-800/30 transition-colors">
                                    {columns.map((col, colIdx) => (
                                        <TableCell key={colIdx} className={col.className}>
                                            {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-64">
                                    <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                                            <Inbox className="h-8 w-8 text-slate-700" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-slate-400">{t('common.empty.no_data', 'No data found')}</p>
                                            <p className="text-xs">{t('common.empty.adjust_search', 'Adjust your search or filters to see more results')}</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {onPageChange && pageCount > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-sm text-muted-foreground mr-4">
                        Page {currentPage} of {pageCount}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1 || isLoading}>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= pageCount || isLoading}>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
