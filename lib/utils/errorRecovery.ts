import { RETRY_CONFIG } from '@/lib/config';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface ErrorWithStatus extends Error {
  status?: number;
  response?: any;
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: ErrorWithStatus): boolean {
  // Network errors are retryable
  if (!error.status) return true;

  // Retry on 5xx errors (server errors)
  if (error.status >= 500) return true;

  // Retry on specific 4xx errors (rate limiting, timeouts)
  if (error.status === 429) return true; // Too Many Requests
  if (error.status === 408) return true; // Request Timeout
  if (error.status === 409) return true; // Conflict (can retry)

  // Don't retry on 4xx client errors (except above)
  if (error.status >= 400 && error.status < 500) return false;

  return true;
}

/**
 * Calculate exponential backoff delay
 */
export function calculateBackoffDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  multiplier: number
): number {
  const delay = Math.min(
    initialDelayMs * Math.pow(multiplier, attempt - 1),
    maxDelayMs
  );
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * delay * 0.1;
  return delay + jitter;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = RETRY_CONFIG.maxRetries,
    initialDelayMs = RETRY_CONFIG.initialDelayMs,
    maxDelayMs = RETRY_CONFIG.maxDelayMs,
    backoffMultiplier = RETRY_CONFIG.backoffMultiplier,
    onRetry,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const err = error as ErrorWithStatus;

      // Check if error is retryable
      if (!isRetryableError(err) || attempt === maxRetries) {
        throw error;
      }

      // Calculate delay and retry
      const delay = calculateBackoffDelay(
        attempt,
        initialDelayMs,
        maxDelayMs,
        backoffMultiplier
      );

      console.log(
        `[v0] Retry attempt ${attempt}/${maxRetries} after ${Math.round(delay)}ms`,
        err.message
      );

      onRetry?.(attempt, err);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown error');
}

/**
 * Hook for handling API errors with user-friendly messages
 */
export function getErrorMessage(error: ErrorWithStatus | Error | null): string {
  if (!error) return 'An error occurred';

  const err = error as ErrorWithStatus;

  // Specific HTTP error messages
  if (err.status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (err.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (err.status === 404) {
    return 'The requested resource was not found.';
  }
  if (err.status === 409) {
    return 'This resource already exists or conflicts with another.';
  }
  if (err.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (err.status === 500 || err.status === 502 || err.status === 503) {
    return 'Server error. Please try again later.';
  }

  // Network errors
  if (err.message?.includes('timeout') || err.message?.includes('TIMEOUT')) {
    return 'Request timed out. Please check your connection and try again.';
  }
  if (err.message?.includes('network') || err.message?.includes('NETWORK')) {
    return 'Network error. Please check your internet connection.';
  }

  // Default to error message if available
  return err.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Error handler for async operations
 */
export interface ErrorHandler {
  onError: (error: ErrorWithStatus) => void;
  onRetry?: (attempt: number) => void;
  onSuccess?: () => void;
}

/**
 * Wrapper for async operations with error handling and retry
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  handlers: Partial<ErrorHandler> = {},
  retryOptions: RetryOptions = {}
): Promise<T | null> {
  try {
    const result = await retryWithBackoff(operation, {
      ...retryOptions,
      onRetry: (attempt) => handlers.onRetry?.(attempt),
    });
    handlers.onSuccess?.();
    return result;
  } catch (error) {
    const err = error as ErrorWithStatus;
    handlers.onError?.(err);
    return null;
  }
}

/**
 * Check if a response is successful
 */
export function isSuccessResponse(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Format error for logging
 */
export function formatErrorLog(error: ErrorWithStatus, context?: string): string {
  const ctx = context ? `[${context}] ` : '';
  const status = error.status ? ` (${error.status})` : '';
  return `${ctx}${error.message}${status}`;
}
