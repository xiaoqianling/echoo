import {
  AuthResponse,
  LoginForm,
  RegisterForm,
  Message,
  Organization,
  User,
  SendMessageForm,
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
    return this.request<Message>("/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  async getMessages(organizationId?: string): Promise<Message[]> {
    const endpoint = organizationId
      ? `/messages?organizationId=${organizationId}`
      : "/messages";

    return this.request<Message[]>(endpoint);
  }

  async getMessage(messageId: string): Promise<Message> {
    return this.request<Message>(`/messages/${messageId}`);
  }

  // 组织相关API
  async getOrganizations(): Promise<Organization[]> {
    return this.request<Organization[]>("/organizations");
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${organizationId}`);
  }

  async createOrganization(
    name: string,
    description?: string
  ): Promise<Organization> {
    return this.request<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  }

  async joinOrganization(inviteCode: string): Promise<Organization> {
    return this.request<Organization>("/organizations/join", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
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
}

export const apiService = new ApiService();
