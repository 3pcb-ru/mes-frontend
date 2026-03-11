import * as React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import { cn } from './utils';

interface SlideOutDrawerProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
}

export function SlideOutDrawer({ open, onOpenChange, trigger, title, description, children, className, side = 'right' }: SlideOutDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent side={side} className={cn('sm:max-w-md w-full', className)}>
                <SheetHeader className="mb-4">
                    <SheetTitle>{title}</SheetTitle>
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                <div className="flex flex-col flex-1 h-full overflow-y-auto pr-1">{children}</div>
            </SheetContent>
        </Sheet>
    );
}
