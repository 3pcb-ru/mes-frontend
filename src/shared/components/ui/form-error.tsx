import * as React from 'react';
import { cn } from './utils';

interface FormErrorProps {
    message?: string;
    className?: string;
}

/**
 * Displays a field-level validation error message below an input.
 * Renders nothing if no message is provided.
 */
export function FormError({ message, className }: FormErrorProps) {
    if (!message) return null;
    return (
        <p className={cn('text-sm text-destructive', className)}>
            {message}
        </p>
    );
}
