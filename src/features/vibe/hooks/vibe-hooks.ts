import { useState, useEffect } from 'react';
import { apiClient } from '@/shared/lib/api-client';
import { useTranslation } from 'react-i18next';

/**
 * useVibeData: Standardized hook for dynamic Vibe components.
 * Handles data fetching, loading states, and schema discovery.
 */
export function useVibeData<T>(endpoint: string | undefined) {
    const { t } = useTranslation();
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detectedFields, setDetectedFields] = useState<string[]>([]);

    useEffect(() => {
        if (!endpoint) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            // Normalize endpoint: ensure it starts with /api/v1
            let finalEndpoint = endpoint;
            if (!endpoint.startsWith('http')) {
                if (!endpoint.startsWith('/api/v1')) {
                    const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
                    finalEndpoint = `/api/v1${cleanPath.replace(/^\/api/, '')}`;
                }
            }

            try {
                // Fetch from normalized endpoint
                const response = await apiClient.get<any>(finalEndpoint);

                // Handle different response shapes (standard wrap vs raw array)
                const items = Array.isArray(response) ? response : response?.data || response?.items || [];

                setData(items);

                // Auto-Discovery: Infer fields from the first item
                if (items.length > 0) {
                    const firstItem = items[0];
                    const fields = Object.keys(firstItem).filter((key) => typeof firstItem[key] !== 'object' && !key.toLowerCase().includes('id'));
                    setDetectedFields(fields);
                }
            } catch (err: any) {
                // Professional logging instead of toast spam
                console.error(`[Vibe Data] Failed to fetch from "${finalEndpoint}":`, err);
                const msg = err.message || t('dashboard.vibe.general.errors.data_fetch_failed', 'Failed to fetch protocol data.');
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();
    }, [endpoint, t]);

    return {
        data,
        isLoading,
        error,
        detectedFields,
    };
}
