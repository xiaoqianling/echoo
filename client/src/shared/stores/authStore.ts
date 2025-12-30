import { createStore } from "solid-js/store";
import { apiService } from "../services/api";
import { webSocketService } from "../services/websocket";
import { User } from "../types";

// 认证状态接口
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  autoRefreshInterval: number | null;
}

// 创建基础状态
const [authState, setAuthState] = createStore<AuthState>({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,
  autoRefreshInterval: null,
});

// Token管理工具
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly TOKEN_TIMESTAMP_KEY = "tokenTimestamp";

  static saveTokens(accessToken: string, refreshToken: string) {
    console.log("🔐 TokenManager.saveTokens:", {
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length,
    });
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.TOKEN_TIMESTAMP_KEY, Date.now().toString());
    setAuthState({ accessToken, refreshToken });
    console.log("✅ Tokens saved to localStorage");
  }

  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TIMESTAMP_KEY);
    setAuthState({
      accessToken: null,
      refreshToken: null,
    });
  }

  static getStoredTokens() {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    console.log("🔍 TokenManager.getStoredTokens:", {
      accessTokenExists: !!accessToken,
      refreshTokenExists: !!refreshToken,
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length,
    });
    return {
      accessToken,
      refreshToken,
      timestamp: localStorage.getItem(this.TOKEN_TIMESTAMP_KEY),
    };
  }

  static isTokenExpired(): boolean {
    const timestamp = localStorage.getItem(this.TOKEN_TIMESTAMP_KEY);
    if (!timestamp) {
      console.log("⏰ TokenManager.isTokenExpired: No timestamp found");
      return true;
    }

    const tokenAge = Date.now() - parseInt(timestamp);
    const isExpired = tokenAge > 7 * 24 * 60 * 60 * 1000;
    console.log("⏰ TokenManager.isTokenExpired:", {
      tokenAge: Math.round(tokenAge / (24 * 60 * 60 * 1000)) + " days",
      isExpired,
    });
    return isExpired;
  }
}

// 自动刷新机制
class AutoRefreshManager {
  private static intervalId: number | null = null;
  private static readonly REFRESH_INTERVAL = 14 * 60 * 1000; // 14分钟刷新一次

  static start() {
    if (this.intervalId) {
      this.stop();
    }

    this.intervalId = window.setInterval(async () => {
      if (authState.isAuthenticated && !authState.isLoading) {
        try {
          await refreshTokens();
        } catch (error) {
          console.warn("Token refresh failed:", error);
        }
      }
    }, this.REFRESH_INTERVAL);

    setAuthState({ autoRefreshInterval: this.intervalId });
  }

  static stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      setAuthState({ autoRefreshInterval: null });
    }
  }
}

// 登录函数
export const login = async (email: string, password: string): Promise<User> => {
  setAuthState({ isLoading: true });

  try {
    const response = await apiService.login({ email, password });
    TokenManager.saveTokens(response.accessToken, response.refreshToken);
    setAuthState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });

    // 设置WebSocket连接
    await webSocketService.connect(response.accessToken);

    // 启动自动刷新
    AutoRefreshManager.start();

    // 显示登录成功提示
    import("./toast").then(({ toast }) => {
      toast.success("登录成功");
    });

    return response.user;
  } catch (error) {
    console.error("Login failed:", error);

    // 断开WebSocket连接
    webSocketService.disconnect();

    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    // 显示登录失败提示
    import("./toast").then(({ toast }) => {
      toast.error("登录失败，请检查邮箱和密码");
    });

    throw error;
  }
};

// 注册函数
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  setAuthState({ isLoading: true });

  try {
    const response = await apiService.register({ email, password, name });
    TokenManager.saveTokens(response.accessToken, response.refreshToken);
    setAuthState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });

    // 启动自动刷新
    AutoRefreshManager.start();

    return response.user;
  } catch (error) {
    setAuthState({ isLoading: false });
    throw error;
  }
};

// 登出函数
export const logout = async (): Promise<void> => {
  try {
    await apiService.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // 停止自动刷新
    AutoRefreshManager.stop();

    // 清除tokens
    TokenManager.clearTokens();

    // 断开WebSocket连接
    webSocketService.disconnect();

    // 显示登出提示
    import("./toast").then(({ toast }) => {
      toast.success("已安全登出");
    });

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }
};

// 刷新tokens
export const refreshTokens = async (): Promise<void> => {
  if (!authState.refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await apiService.refreshAuthToken();
    TokenManager.saveTokens(response.accessToken, response.refreshToken);

    // 确保自动刷新机制在运行
    if (!authState.autoRefreshInterval) {
      AutoRefreshManager.start();
    }
  } catch (error) {
    // 刷新失败，清除tokens
    TokenManager.clearTokens();
    AutoRefreshManager.stop();
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
    throw error;
  }
};

// 初始化认证状态
export const initializeAuth = async (): Promise<void> => {
  console.log("🚀 initializeAuth: Starting authentication initialization");
  setAuthState({ isLoading: true });

  const tokens = TokenManager.getStoredTokens();

  // 检查是否有有效的tokens
  if (
    !tokens.accessToken ||
    !tokens.refreshToken ||
    TokenManager.isTokenExpired()
  ) {
    console.log(
      "❌ initializeAuth: No valid tokens found, clearing and exiting"
    );
    TokenManager.clearTokens();
    webSocketService.disconnect();
    setAuthState({
      isLoading: false,
      isInitialized: true,
    });
    return;
  }

  console.log(
    "✅ initializeAuth: Valid tokens found, proceeding with authentication"
  );

  try {
    console.log("🔐 initializeAuth: Setting tokens to API service");
    // 设置tokens到api服务（不清除，而是直接设置）
    apiService.setTokens(tokens.accessToken!, tokens.refreshToken!);

    console.log("🔐 initializeAuth: Validating current token");
    // 验证当前token是否有效
    const user = await apiService.getCurrentUser();

    console.log(
      "✅ initializeAuth: Token validation successful, user:",
      user?.name
    );
    setAuthState({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });

    // 设置WebSocket连接
    console.log("🔌 initializeAuth: Setting up WebSocket connection");
    await webSocketService.connect(tokens.accessToken!);

    console.log("🔄 initializeAuth: Starting auto refresh manager");
    // 启动自动刷新
    AutoRefreshManager.start();
  } catch (error) {
    console.log("❌ initializeAuth: Token validation failed:", error);
    // Token无效，尝试刷新
    try {
      console.log("🔄 initializeAuth: Attempting token refresh");
      await refreshTokens();
    } catch (refreshError) {
      console.log(
        "❌ initializeAuth: Token refresh also failed:",
        refreshError
      );
      // 刷新也失败，清除状态
      TokenManager.clearTokens();
      webSocketService.disconnect();
      setAuthState({
        isLoading: false,
        isInitialized: true,
        isAuthenticated: false,
      });
    }
  }
};

// 停止自动刷新机制
export const stopAutoRefresh = () => {
  AutoRefreshManager.stop();
};

// 导出认证store
export const authStore = {
  // 状态
  get user() {
    return authState.user;
  },
  get accessToken() {
    return authState.accessToken;
  },
  get refreshToken() {
    return authState.refreshToken;
  },
  get isLoading() {
    return authState.isLoading;
  },
  get isAuthenticated() {
    return authState.isAuthenticated;
  },
  get isInitialized() {
    return authState.isInitialized;
  },

  // 方法
  login,
  register,
  logout,
  refreshTokens,
  initializeAuth,
  stopAutoRefresh,
};

// 导出类型
export type AuthStore = typeof authStore;
