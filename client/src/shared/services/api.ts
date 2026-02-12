import {
  AuthResponse,
  LoginForm,
  RegisterForm,
  Message,
  Organization,
  User,
  SendMessageForm,
  Member,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.initializeTokens();
  }

  private initializeTokens() {
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    console.log("🔐 ApiService.saveTokens:", {
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length,
    });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    console.log("✅ ApiService.saveTokens: Tokens saved to localStorage");
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  setTokens(accessToken: string, refreshToken: string) {
    console.log("🔐 ApiService.setTokens:", {
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length,
    });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    console.log("✅ ApiService.setTokens: Tokens set to API service");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      // Token过期，尝试刷新
      try {
        await this.refreshAuthToken();
        // 重新发起请求
        return this.request<T>(endpoint, options);
      } catch (error) {
        this.clearTokens();
        throw new Error("Authentication failed");
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // 认证相关API
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    this.saveTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async register(userData: RegisterForm): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    this.saveTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async refreshAuthToken(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    this.saveTokens(data.accessToken, data.refreshToken);
    return data;
  }

  logout() {
    this.clearTokens();
  }

  // 消息相关API
  async sendMessage(messageData: SendMessageForm): Promise<Message> {
    return this.request<Message>("/echoo/messages/send", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  async getMessages(organizationId?: string): Promise<Message[]> {
    const endpoint = organizationId
      ? `/echoo/messages/list?organizationId=${organizationId}`
      : "/echoo/messages/list";

    return this.request<Message[]>(endpoint);
  }

  async getMessage(messageId: string): Promise<Message> {
    return this.request<Message>(`/echoo/messages/${messageId}/detail`);
  }

  // 组织相关API
  async getOrganizations(): Promise<Organization[]> {
    return this.request<Organization[]>("/echoo/organizations/list");
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    return this.request<Organization>(
      `/echoo/organizations/${organizationId}/detail`
    );
  }

  async createOrganization(
    name: string,
    description?: string
  ): Promise<Organization> {
    return this.request<Organization>("/echoo/organizations/create", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  }

  async joinOrganization(inviteCode: string): Promise<Organization> {
    return this.request<Organization>("/echoo/organizations/join", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
    });
  }

  // 成员管理API
  async addMember(
    organizationId: string,
    userId: string,
    role: string
  ): Promise<void> {
    return this.request<void>(
      `/echoo/organizations/${organizationId}/member/add`,
      {
        method: "POST",
        body: JSON.stringify({ userId, role }),
      }
    );
  }

  async removeMember(organizationId: string, userId: string): Promise<void> {
    return this.request<void>(
      `/echoo/organizations/${organizationId}/member/remove`,
      {
        method: "DELETE",
        body: JSON.stringify({ userId }),
      }
    );
  }

  async promoteMember(organizationId: string, userId: string): Promise<void> {
    return this.request<void>(
      `/echoo/organizations/${organizationId}/member/promote`,
      {
        method: "POST",
        body: JSON.stringify({ userId }),
      }
    );
  }

  async demoteMember(organizationId: string, userId: string): Promise<void> {
    return this.request<void>(
      `/echoo/organizations/${organizationId}/member/demote`,
      {
        method: "POST",
        body: JSON.stringify({ userId }),
      }
    );
  }

  async leaveOrganization(organizationId: string): Promise<void> {
    return this.request<void>(
      `/echoo/organizations/${organizationId}/member/leave`,
      {
        method: "POST",
      }
    );
  }

  // 组织消息API
  async publishMessage(
    organizationId: string,
    title: string,
    content: string
  ): Promise<void> {
    return this.request<void>(
      `/echoo/organizations/${organizationId}/message/publish`,
      {
        method: "POST",
        body: JSON.stringify({ title, content }),
      }
    );
  }

  async getOrganizationMessages(organizationId: string): Promise<Message[]> {
    return this.request<Message[]>(
      `/echoo/organizations/${organizationId}/message/list`
    );
  }

  async getOrganizationMembers(organizationId: string): Promise<Member[]> {
    return this.request<Member[]>(
      `/echoo/organizations/${organizationId}/member/list`
    );
  }

  // 组织管理API
  async transferOwnership(
    organizationId: string,
    newOwnerId: string
  ): Promise<void> {
    return this.request<void>(
      `/echoo/organizations/${organizationId}/owner/transfer`,
      {
        method: "POST",
        body: JSON.stringify({ newOwnerId }),
      }
    );
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    return this.request<void>(`/echoo/organizations/${organizationId}/delete`, {
      method: "DELETE",
    });
  }

  // 用户相关API
  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.request("/users/password", {
      method: "PATCH",
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  // Stats
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/echoo/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
