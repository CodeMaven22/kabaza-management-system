// API Client with JWT Token Management
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface TokenPayload {
  exp: number;
  iat: number;
  user_id: number;
}

class APIClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadTokensFromStorage();
    }
  }

  /**
   * Load tokens from session storage (client-side only)
   */
  private loadTokensFromStorage(): void {
    try {
      const access = sessionStorage.getItem('access_token');
      const refresh = sessionStorage.getItem('refresh_token');
      if (access) this.accessToken = access;
      if (refresh) this.refreshToken = refresh;
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('[v0] Failed to load tokens:', error);
    }
  }

  /**
   * Store tokens securely in session storage
   */
  private saveTokensToStorage(access: string, refresh?: string): void {
    try {
      sessionStorage.setItem('access_token', access);
      if (refresh) {
        sessionStorage.setItem('refresh_token', refresh);
        this.refreshToken = refresh;
      }
      this.accessToken = access;
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('[v0] Failed to save tokens:', error);
    }
  }

  /**
   * Clear tokens from storage (logout)
   */
  private clearTokens(): void {
    try {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      this.accessToken = null;
      this.refreshToken = null;
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
      }
    } catch (error) {
      console.error('[v0] Failed to clear tokens:', error);
    }
  }

  /**
   * Schedule automatic token refresh before expiration
   */
  private scheduleTokenRefresh(): void {
    if (!this.accessToken) return;

    try {
      const decoded = jwtDecode<TokenPayload>(this.accessToken);
      const now = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - now;
      
      // Refresh 5 minutes before expiration
      const refreshTime = Math.max((timeUntilExpiry - 300) * 1000, 1000);
      
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
      }

      this.tokenRefreshTimer = setTimeout(() => {
        this.refreshAccessToken();
      }, refreshTime);
    } catch (error) {
      console.error('[v0] Failed to schedule token refresh:', error);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.saveTokensToStorage(data.access, this.refreshToken);
      return true;
    } catch (error) {
      console.error('[v0] Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Make authenticated API request
   */
  async request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, any> } = {},
    retryCount = 0
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    // Add authorization header if token exists
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    // Add CSRF token for state-changing operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || '')) {
      const csrfToken = this.getCsrfToken();
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
    }

    // Build URL with query parameters
    let url = `${API_BASE_URL}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration
      if (response.status === 401 && retryCount === 0) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request<T>(endpoint, options, 1);
        }
        this.clearTokens();
        throw new Error('Unauthorized: Session expired');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errorMessage = error.detail || error.message || response.statusText;
        throw new APIError(errorMessage, response.status, error);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        error instanceof Error ? error.message : 'Network error',
        0,
        error
      );
    }
  }

  /**
   * Get CSRF token from cookie
   */
  private getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  /**
   * Set tokens (called after login)
   */
  setTokens(access: string, refresh?: string): void {
    this.saveTokensToStorage(access, refresh);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Logout and clear tokens
   */
  logout(): void {
    this.clearTokens();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Make GET request
   */
  async get<T>(
    endpoint: string,
    options?: { params?: Record<string, any>; responseType?: 'json' | 'blob' }
  ): Promise<T> {
    if (options?.responseType === 'blob') {
      return this.getBlob<T>(endpoint, options.params);
    }
    return this.request<T>(endpoint, { 
      method: 'GET',
      params: options?.params,
    });
  }

  /**
   * Make GET request returning Blob (for file downloads)
   */
  private async getBlob<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const headers = {
      ...({} as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || response.statusText,
          response.status,
          errorData
        );
      }

      return response.blob() as Promise<T>;
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(
        error instanceof Error ? error.message : 'Network error',
        0,
        error
      );
    }
  }

  /**
   * Make POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Make PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Make PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Make DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number = 0,
    public data: any = null
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const apiClient = new APIClient();
export { APIError };
