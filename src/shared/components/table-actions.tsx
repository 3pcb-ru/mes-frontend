import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ConfirmDeleteDialog } from './ui/confirm-delete-dialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TableActionsProps {
    id: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => Promise<void>;
    isDeleting?: boolean;
    itemName?: string;
}

export function TableActions({ id, onEdit, onDelete, isDeleting = false, itemName = 'item' }: TableActionsProps) {
    const { t } = useTranslation();
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
                        title={t('common.actions.edit')}
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
                        title={t('common.actions.delete')}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {onDelete && (
                <ConfirmDeleteDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={handleDelete}
                    title={t('common.actions.confirm_delete_title', { item: itemName })}
                    description={t('common.actions.confirm_delete_description', { item: itemName })}
                    isDeleting={isLoading}
                />
            )}
        </>
    );
}

export default TableActions;
