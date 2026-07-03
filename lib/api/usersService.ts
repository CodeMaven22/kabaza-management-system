import { apiClient } from './client';
import { UserProfile, UserRole, UserStatus } from './authService';

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UsersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserProfile[];
}

class UsersService {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(filters?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
  }): Promise<UsersListResponse> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.request<UsersListResponse>(`/auth/${query}`);
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(userId: number): Promise<UserProfile> {
    return apiClient.request<UserProfile>(`/auth/${userId}/`);
  }

  /**
   * Create new user (admin only)
   */
  async createUser(userData: CreateUserRequest): Promise<UserProfile> {
    return apiClient.request<UserProfile>('/auth/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Update user (admin only)
   */
  async updateUser(
    userId: number,
    userData: UpdateUserRequest
  ): Promise<UserProfile> {
    return apiClient.request<UserProfile>(`/auth/${userId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: number): Promise<void> {
    await apiClient.request(`/auth/${userId}/delete/`, {
      method: 'DELETE',
    });
  }

  /**
   * Change user status (suspend, deactivate, activate)
   */
  async changeUserStatus(
    userId: number,
    status: UserStatus
  ): Promise<UserProfile> {
    return this.updateUser(userId, { status });
  }

  /**
   * Get user details (admin only)
   */
  async getUserDetails(userId: number): Promise<UserProfile> {
    return apiClient.request<UserProfile>(`/auth/${userId}/details/`);
  }
}

export const usersService = new UsersService();
