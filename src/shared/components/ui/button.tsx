import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-start/50 cursor-pointer active:scale-95",
    {
        variants: {
            variant: {
                default: 'bg-gradient-to-r from-brand-primary-start to-brand-primary-end text-white border-none shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] hover:brightness-110',
                destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-red-500/20',
                outline: 'border-2 border-slate-700 bg-transparent text-slate-300 hover:border-brand-primary-start hover:text-brand-primary-start hover:bg-brand-primary-start/5',
                secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700',
                ghost: 'text-slate-400 hover:text-brand-primary-start hover:bg-brand-primary-start/10',
                link: 'text-brand-primary-start underline-offset-4 hover:underline decoration-2',
            },
            size: {
                default: 'h-10 px-5 py-2',
                sm: 'h-9 px-3 text-xs',
                lg: 'h-12 px-8 text-base',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'> &
        VariantProps<typeof buttonVariants> & {
            asChild?: boolean;
        }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return <Comp data-slot="button" ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
