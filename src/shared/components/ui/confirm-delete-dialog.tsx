'use client';

import * as React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isDeleting?: boolean;
}

export function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, title, description, confirmText, cancelText, isDeleting = false }: ConfirmDeleteDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-950/90 border-slate-800 text-white max-w-[400px] backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500 text-xl font-bold">
                        <Trash2 className="h-5 w-5" />
                        {title || t('common.actions.confirm_delete_title', 'Confirm Delete')}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 pt-2">
                        {description || t('common.actions.confirm_delete_description', 'Are you sure you want to delete this item? This action cannot be undone.')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        {cancelText || t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-500 text-white border-0 shadow-lg shadow-red-500/20 px-6">
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{t('common.actions.deleting', 'Deleting...')}</span>
                            </div>
                        ) : (
                            confirmText || t('common.delete', 'Delete')
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
