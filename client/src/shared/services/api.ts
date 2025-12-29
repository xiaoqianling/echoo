import { AuthResponse, LoginForm, RegisterForm, Message, Organization, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginForm): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterForm): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return this.request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Messages endpoints
  async sendMessage(data: {
    title: string;
    desp?: string;
    tags?: string[];
    short?: string;
    organizationId?: string;
  }): Promise<Message> {
    return this.request<Message>('/api/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(organizationId?: string): Promise<Message[]> {
    const url = organizationId ? `/messages?organizationId=${organizationId}` : '/messages';
    return this.request<Message[]>(url);
  }

  async getMessageById(id: string): Promise<Message> {
    return this.request<Message>(`/messages/${id}`);
  }

  // Organizations endpoints
  async createOrganization(data: { name: string; description?: string }): Promise<Organization> {
    return this.request<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrganizations(): Promise<Organization[]> {
    return this.request<Organization[]>('/organizations');
  }

  async getOrganizationById(id: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${id}`);
  }

  async addMember(organizationId: string, data: { userId: string; role: 'admin' | 'member' }): Promise<any> {
    return this.request<any>(`/organizations/${organizationId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeMember(organizationId: string, userId: string): Promise<void> {
    return this.request<void>(`/organizations/${organizationId}/members/${userId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();