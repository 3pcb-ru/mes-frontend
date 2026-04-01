import { ApiError } from './api-client';

/**
 * Tracks API failures and implements a cool-down period to prevent infinite retry loops.
 */
class ApiSafetyNet {
    private failureCounts: Map<string, number> = new Map();
    private lastFailureTimes: Map<string, number> = new Map();
    private readonly MAX_RETRIES = 2; // Before cooling down
    private readonly COOL_DOWN_MS = 60000; // 1 minute cool-down for client errors (4xx)

    /**
     * Records a failure for an endpoint.
     */
    recordFailure(endpoint: string, error: ApiError): void {
        const currentCount = this.failureCounts.get(endpoint) || 0;
        this.failureCounts.set(endpoint, currentCount + 1);
        this.lastFailureTimes.set(endpoint, Date.now());

        // For client errors (especially 404), we want to be aggressive about cooling down
        if (error.statusCode >= 400 && error.statusCode < 500) {
            console.warn(`[SafetyNet] Client error ${error.statusCode} on ${endpoint}. Cooling down.`);
        }
    }

    /**
     * Reports success for an endpoint to reset the failure counter.
     */
    recordSuccess(endpoint: string): void {
        this.failureCounts.delete(endpoint);
        this.lastFailureTimes.delete(endpoint);
    }

    /**
     * Checks if a request to the endpoint should be allowed.
     */
    shouldAttempt(endpoint: string): boolean {
        const failureCount = this.failureCounts.get(endpoint) || 0;
        const lastFailureTime = this.lastFailureTimes.get(endpoint) || 0;

        if (failureCount <= this.MAX_RETRIES) {
            return true;
        }

        const elapsedSinceFailure = Date.now() - lastFailureTime;
        if (elapsedSinceFailure > this.COOL_DOWN_MS) {
            // Reset count if cool-down has passed to allow one retry
            this.failureCounts.set(endpoint, this.MAX_RETRIES);
            return true;
        }

        return false;
    }

    /**
     * Gets remaining cool-down time in seconds.
     */
    getCoolDownRemaining(endpoint: string): number {
        const lastFailureTime = this.lastFailureTimes.get(endpoint) || 0;
        const elapsed = Date.now() - lastFailureTime;
        return Math.max(0, Math.ceil((this.COOL_DOWN_MS - elapsed) / 1000));
    }
}

export const apiSafetyNet = new ApiSafetyNet();
