import * as React from 'react';
import { Badge, type badgeVariants } from './badge';
import { type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

export type StandardStatus = 'IDLE' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'PLANNED' | 'RELEASED' | 'CLOSED' | 'DOWN' | 'ERROR' | 'SCRAP' | 'ACTIVE' | 'INACTIVE';

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
    status: StandardStatus | string;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
    const getBadgeVariant = (s: string): VariantProps<typeof badgeVariants>['variant'] => {
        const normalized = s.toUpperCase();
        switch (normalized) {
            case 'IDLE':
            case 'READY':
            case 'COMPLETED':
            case 'CLOSED':
            case 'ACTIVE':
                return 'default'; // Or a specific green/success variant custom to your theme
            case 'IN_PROGRESS':
            case 'RELEASED':
            case 'PLANNED':
                return 'secondary';
            case 'DOWN':
            case 'ERROR':
            case 'SCRAP':
            case 'INACTIVE':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getCustomColorClasses = (s: string) => {
        const normalized = s.toUpperCase();
        switch (normalized) {
            case 'IDLE':
            case 'READY':
            case 'COMPLETED':
            case 'CLOSED':
            case 'ACTIVE':
                return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20';
            case 'IN_PROGRESS':
            case 'RELEASED':
                return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 border-blue-500/20';
            case 'PLANNED':
                return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/20';
            case 'DOWN':
            case 'ERROR':
            case 'SCRAP':
            case 'INACTIVE':
                return 'bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25 border-red-500/20';
            default:
                return '';
        }
    };

    return (
        <Badge variant={getBadgeVariant(status)} className={cn(getCustomColorClasses(status), 'transition-colors font-semibold tracking-wide capitalize', className)} {...props}>
            {status.replace(/_/g, ' ')}
        </Badge>
    );
}
