/**
 * Request Deduplication Cache
 * Prevents multiple identical concurrent API requests
 */

type PendingRequest<T> = {
  promise: Promise<T>;
  timestamp: number;
};

const cache = new Map<string, PendingRequest<any>>();
const CACHE_TTL = 300000; // 5 minutes

export function dedupedRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  // Return cached promise if still pending and not expired
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`[v0] Using cached request for: ${key}`);
    return cached.promise;
  }

  // Create new request
  const promise = requestFn().then(
    (result) => {
      // Clean up after success
      cache.delete(key);
      return result;
    },
    (error) => {
      // Clean up after error
      cache.delete(key);
      throw error;
    }
  );

  cache.set(key, { promise, timestamp: now });
  return promise;
}

export function clearRequestCache(): void {
  cache.clear();
}

export function clearRequestCacheFor(key: string): void {
  cache.delete(key);
}
