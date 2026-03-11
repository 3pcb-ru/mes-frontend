import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Input } from './input';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
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
}: DataTableGridProps<T>) {
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (onSearch) onSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, onSearch]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {onSearch && (
                <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-background" />
                    </div>
                </div>
            )}

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, idx) => (
                                <TableHead key={idx}>{col.header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length ? (
                            data.map((item, rowIdx) => (
                                <TableRow key={rowIdx}>
                                    {columns.map((col, colIdx) => (
                                        <TableCell key={colIdx}>{col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
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
