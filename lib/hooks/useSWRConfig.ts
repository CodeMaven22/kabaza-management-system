import { SWRConfiguration } from 'swr';
import { CACHE_CONFIG, RETRY_CONFIG, API_CONFIG } from '@/lib/config';
import { apiClient } from '@/lib/api/client';

/**
 * Default SWR fetcher using our API client
 */
export const defaultFetcher = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Base SWR configuration with caching and retry logic
 */
export const baseSWRConfig: SWRConfiguration = {
  // Caching behavior
  revalidateIfStale: CACHE_CONFIG.enabled,
  revalidateOnFocus: CACHE_CONFIG.revalidateOnFocus,
  revalidateOnReconnect: CACHE_CONFIG.revalidateOnReconnect,
  dedupingInterval: CACHE_CONFIG.dedupingInterval,
  focusThrottleInterval: 5000,

  // Timing
  dedupingIgnoreRevalidateCache: false,

  // Error handling
  shouldRetryOnError: RETRY_CONFIG.enabled,
  errorRetryCount: RETRY_CONFIG.maxRetries,
  errorRetryInterval: RETRY_CONFIG.initialDelayMs,

  // Loading behavior
  loadingTimeout: API_CONFIG.timeout,
  compare: defaultCompare,
};

/**
 * Custom comparison function to prevent unnecessary re-renders
 */
function defaultCompare(a: any, b: any): boolean {
  return a === b;
}

/**
 * Configuration for list endpoints with pagination
 */
export const listSWRConfig: SWRConfiguration = {
  ...baseSWRConfig,
  revalidateOnFocus: true,
  focusThrottleInterval: 10000,
};

/**
 * Configuration for detail/single resource endpoints
 */
export const detailSWRConfig: SWRConfiguration = {
  ...baseSWRConfig,
  revalidateOnFocus: false,
};

/**
 * Configuration for real-time data (high frequency updates)
 */
export const realtimeSWRConfig: SWRConfiguration = {
  ...baseSWRConfig,
  revalidateInterval: 5000,
  focusThrottleInterval: 2000,
};

/**
 * Configuration for one-time data (rarely changes)
 */
export const staticSWRConfig: SWRConfiguration = {
  ...baseSWRConfig,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: false,
};
