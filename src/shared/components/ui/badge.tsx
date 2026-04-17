import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './utils';

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-300 overflow-hidden',
    {
        variants: {
            variant: {
                default: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-2px_rgba(16,185,129,0.2)] hover:bg-emerald-500/20 hover:border-emerald-500/50',
                secondary: 'border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-2px_rgba(59,130,246,0.2)] hover:bg-blue-500/20 hover:border-blue-500/50',
                destructive: 'border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_10px_-2px_rgba(239,68,68,0.2)] hover:bg-red-500/20 hover:border-red-500/50',
                outline: 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function Badge({ className, variant, asChild = false, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span';

    return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
