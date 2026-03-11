import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { cn } from './utils';

interface SlideOutDrawerProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    side?: 'left' | 'right' | 'top' | 'bottom'; // Kept for backwards compatibility but ignored
}

// Renaming conceptually, keeping export name to prevent breaking imports
export function SlideOutDrawer({ open, onOpenChange, trigger, title, description, children, className }: SlideOutDrawerProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={cn('sm:max-w-md w-full max-h-[85vh] flex flex-col bg-slate-900 border-slate-700 text-slate-50', className)}>
                <DialogHeader className="mb-2 shrink-0">
                    <DialogTitle className="text-white">{title}</DialogTitle>
                    {description && <DialogDescription className="text-slate-400">{description}</DialogDescription>}
                </DialogHeader>
                <div className="flex flex-col flex-1 h-full overflow-y-auto pr-2 custom-scrollbar">{children}</div>
            </DialogContent>
        </Dialog>
    );
}
