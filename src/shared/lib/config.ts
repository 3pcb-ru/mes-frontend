/**
 * Application configuration
 * Uses Vite environment variables with fallbacks
 */
export const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
} as const;

// Type for the config object
export type Config = typeof config;
