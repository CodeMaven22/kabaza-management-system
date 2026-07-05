import useSWR, { SWRConfiguration } from 'swr';
import { defaultFetcher, baseSWRConfig, listSWRConfig, detailSWRConfig, realtimeSWRConfig, staticSWRConfig } from './useSWRConfig';

export type CacheStrategy = 'base' | 'list' | 'detail' | 'realtime' | 'static';

interface UseAPIOptions extends SWRConfiguration {
  strategy?: CacheStrategy;
}

/**
 * Custom hook for API data fetching with SWR
 * Provides automatic caching, retries, and revalidation
 */
export function useAPI<T>(
  key: string | null,
  options: UseAPIOptions = {}
) {
  const { strategy = 'list', ...customConfig } = options;

  // Select strategy-based config
  let strategyConfig = baseSWRConfig;
  switch (strategy) {
    case 'list':
      strategyConfig = listSWRConfig;
      break;
    case 'detail':
      strategyConfig = detailSWRConfig;
      break;
    case 'realtime':
      strategyConfig = realtimeSWRConfig;
      break;
    case 'static':
      strategyConfig = staticSWRConfig;
      break;
  }

  const finalConfig: SWRConfiguration = {
    ...strategyConfig,
    ...customConfig,
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    key,
    defaultFetcher,
    finalConfig
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    isError: !!error,
  };
}

/**
 * Hook for list/paginated API endpoints
 */
export function useAPIList<T>(
  endpoint: string | null,
  options?: SWRConfiguration
) {
  return useAPI<T>(endpoint, {
    strategy: 'list',
    ...options,
  });
}

/**
 * Hook for single resource endpoints
 */
export function useAPIDetail<T>(
  endpoint: string | null,
  options?: SWRConfiguration
) {
  return useAPI<T>(endpoint, {
    strategy: 'detail',
    ...options,
  });
}

/**
 * Hook for real-time data
 */
export function useAPIRealtime<T>(
  endpoint: string | null,
  options?: SWRConfiguration
) {
  return useAPI<T>(endpoint, {
    strategy: 'realtime',
    ...options,
  });
}

/**
 * Hook for static/rarely-changing data
 */
export function useAPIStatic<T>(
  endpoint: string | null,
  options?: SWRConfiguration
) {
  return useAPI<T>(endpoint, {
    strategy: 'static',
    ...options,
  });
}
