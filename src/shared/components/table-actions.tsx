import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import { useState } from 'react';

interface TableActionsProps {
    id: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => Promise<void>;
    isDeleting?: boolean;
    itemName?: string;
}

export function TableActions({ id, onEdit, onDelete, isDeleting = false, itemName = 'item' }: TableActionsProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // If no actions are available, don't render anything
    if (!onEdit && !onDelete) {
        return null;
    }

    const handleDelete = async () => {
        if (!onDelete) return;
        setIsLoading(true);
        try {
            await onDelete(id);
            setIsDeleteDialogOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(id)}
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isDeleting || isLoading}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {onDelete && (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete {itemName}</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. Are you sure you want to delete this {itemName}?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
