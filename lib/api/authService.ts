import { apiClient } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  profile?: {
    phone_number?: string;
    national_id?: string;
    photo?: string;
    department?: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export type UserRole =
  | 'ICT_OFFICER'
  | 'REVENUE_COLLECTOR'
  | 'REVENUE_OFFICER'
  | 'REGISTRATION_OFFICER'
  | 'FINANCE_OFFICER'
  | 'ACCOUNTS_ASSISTANT'
  | 'DIRECTOR_OF_ADMINISTRATION'
  | 'CHIEF_EXECUTIVE'
  | 'TRAFFIC_OFFICER';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'deactivated';

class AuthService {
  /**
   * Login with username and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Set tokens in API client
    apiClient.setTokens(response.access, response.refresh);

    return response;
  }

  /**
   * Register new user (admin only)
   */
  async register(userData: RegisterRequest): Promise<UserProfile> {
    return apiClient.request<UserProfile>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    return apiClient.request<UserProfile>('/auth/me/');
  }

  /**
   * Logout and notify backend
   */
  async logout(): Promise<void> {
    try {
      await apiClient.request('/auth/logout/', {
        method: 'POST',
      });
    } catch (error) {
      console.error('[v0] Logout API error:', error);
    } finally {
      apiClient.logout();
    }
  }

  /**
   * Change password
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ detail: string }> {
    return apiClient.request<{ detail: string }>(
      '/auth/change-password/',
      {
        method: 'POST',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      }
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authService = new AuthService();
