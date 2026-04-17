import * as React from 'react';
import { Badge, type badgeVariants } from './badge';
import { type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useTranslation } from 'react-i18next';

export type StandardStatus = 'IDLE' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'PLANNED' | 'RELEASED' | 'CLOSED' | 'DOWN' | 'ERROR' | 'SCRAP' | 'ACTIVE' | 'INACTIVE';

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
    status: StandardStatus | string;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
    const { t } = useTranslation();

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
                return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-2px_rgba(16,185,129,0.1)]';
            case 'IN_PROGRESS':
            case 'RELEASED':
                return 'border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-2px_rgba(59,130,246,0.1)]';
            case 'PLANNED':
                return 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_-2px_rgba(245,158,11,0.1)]';
            case 'DOWN':
            case 'ERROR':
            case 'SCRAP':
            case 'INACTIVE':
                return 'border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_10px_-2px_rgba(239,68,68,0.1)]';
            default:
                return 'border-slate-700 bg-slate-800/50 text-slate-400';
        }
    };

    return (
        <Badge variant={getBadgeVariant(status)} className={cn(getCustomColorClasses(status), 'transition-colors font-semibold tracking-wide capitalize', className)} {...props}>
            {t(`common.components.status.${status.toUpperCase()}`, status.replace(/_/g, ' '))}
        </Badge>
    );
}
