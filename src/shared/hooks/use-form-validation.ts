import { useState, useCallback } from 'react';
import type { ApiError } from '../lib/api-client';

/**
 * A generic hook that manages API server-side validation errors for forms.
 *
 * - Maintains a `validationErrors` map (field name → error message).
 * - `handleApiError`: extracts validation errors from a 422 ApiError and populates state.
 *   Returns `true` when the error was a validation error (so callers can skip generic toasts).
 * - `clearError`: clears the error for a specific field (call this on input onChange).
 * - `resetErrors`: clears all errors (call this before submission).
 */
export function useFormValidation() {
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleApiError = useCallback((err: unknown): boolean => {
        const apiError = err as ApiError;
        if (apiError?.statusCode === 422 && apiError?.validationErrors) {
            setValidationErrors(apiError.validationErrors);
            return true;
        }
        return false;
    }, []);

    const clearError = useCallback((field: string) => {
        setValidationErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const resetErrors = useCallback(() => {
        setValidationErrors({});
    }, []);

    return { validationErrors, handleApiError, clearError, resetErrors };
}
