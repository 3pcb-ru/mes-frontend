import * as React from 'react';

import { cn } from './utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'resize-none border-slate-700 placeholder:text-slate-400 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/50 flex field-sizing-content min-h-16 w-full rounded-md border bg-slate-800/50 px-3 py-2 text-base text-white transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className,
            )}
            {...props}
        />
    );
}

export { Textarea };
