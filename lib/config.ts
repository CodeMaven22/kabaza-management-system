// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
};

// Authentication Configuration
export const AUTH_CONFIG = {
  tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'kabaza_auth_token',
  refreshTokenKey: process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'kabaza_refresh_token',
};

// Caching Configuration
export const CACHE_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_SWR_CACHING === 'true',
  ttl: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5 minutes
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
};

// Retry Configuration
export const RETRY_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_RETRIES === 'true',
  maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

// Celery Task Configuration
export const CELERY_CONFIG = {
  pollInterval: parseInt(process.env.NEXT_PUBLIC_CELERY_POLL_INTERVAL || '2000'),
  maxPolls: parseInt(process.env.NEXT_PUBLIC_CELERY_MAX_POLLS || '30'),
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  limit: parseInt(process.env.NEXT_PUBLIC_API_RATE_LIMIT || '100'),
  window: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW || '60000'), // 1 minute
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20'),
  maxPageSize: parseInt(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE || '100'),
  pageSizeOptions: [10, 20, 50, 100],
};

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKETS === 'true',
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws',
  reconnectInterval: 3000,
  reconnectAttempts: 5,
};

// Logging Configuration
export const LOGGING_CONFIG = {
  level: (process.env.NEXT_PUBLIC_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
  enableDebugLogs: process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === 'true',
};

// Security Configuration
export const SECURITY_CONFIG = {
  enableRequestSigning: process.env.NEXT_PUBLIC_ENABLE_REQUEST_SIGNING === 'true',
  enableCSRFProtection: process.env.NEXT_PUBLIC_ENABLE_CSRF_PROTECTION === 'true',
};

// Validation that required env vars are set
export function validateConfig() {
  if (!API_CONFIG.baseURL) {
    console.warn('[v0] NEXT_PUBLIC_API_URL not set, using default localhost');
  }
  return true;
}
