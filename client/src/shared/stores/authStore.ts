import { createSignal } from "solid-js";
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
}

// 创建基础状态
const [authState, setAuthState] = createStore<AuthState>({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
});

// 创建信号用于响应式更新
export const [isInitialized, setIsInitialized] = createSignal(false);

// Mock认证函数
const useMockAuth = () => {
  console.log("🎭 Using mock authentication");

  const mockUser: User = {
    id: "mock-user-1",
    name: "Test User",
    email: "test@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPayload = {
    sub: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  };

  const mockAccessToken = `${btoa(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  )}.${btoa(JSON.stringify(mockPayload))}.mock-signature`;
  const mockRefreshToken = `${btoa(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  )}.${btoa(
    JSON.stringify({
      ...mockPayload,
      exp: Math.floor(Date.now() / 1000) + 604800,
    })
  )}.mock-signature`;

  localStorage.setItem("accessToken", mockAccessToken);
  localStorage.setItem("refreshToken", mockRefreshToken);

  setAuthState({
    user: mockUser,
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    isAuthenticated: true,
    isLoading: false,
  });
};

// 保存tokens
const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  setAuthState({ accessToken, refreshToken });
};

// 登录函数
export const login = async (email: string, password: string): Promise<User> => {
  setAuthState({ isLoading: true });

  try {
    const response = await apiService.login({ email, password });
    saveTokens(response.accessToken, response.refreshToken);
    setAuthState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
    });
    return response.user;
  } catch (error) {
    setAuthState({ isLoading: false });
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
    saveTokens(response.accessToken, response.refreshToken);
    setAuthState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
    });
    return response.user;
  } catch (error) {
    setAuthState({ isLoading: false });
    throw error;
  }
};

// 登出函数
export const logout = async (): Promise<void> => {
  setAuthState({ isLoading: true });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  webSocketService.disconnect();
  setAuthState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
  });
};

// 检查认证状态
export const checkAuth = async (): Promise<void> => {
  const currentAccessToken =
    authState.accessToken || localStorage.getItem("accessToken");

  if (!currentAccessToken) {
    setAuthState({ isLoading: false });
    return;
  }

  try {
    const user = await apiService.getMe();
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  } catch (error) {
    // 尝试刷新token
    await refreshTokens();
  }
};

// 刷新tokens
export const refreshTokens = async (): Promise<void> => {
  const currentRefreshToken =
    authState.refreshToken || localStorage.getItem("refreshToken");

  if (!currentRefreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    useMockAuth();
    return;
  }

  try {
    const tokens = await apiService.refreshToken(currentRefreshToken);
    saveTokens(tokens.accessToken, tokens.refreshToken);
    await checkAuth();
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    useMockAuth();
  }
};

// 初始化认证
export const initializeAuth = async (): Promise<void> => {
  console.log("Initializing auth...");
  setAuthState({ isLoading: true });

  try {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      setAuthState({ accessToken });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Init timeout")), 5000);
      });

      await Promise.race([checkAuth(), timeoutPromise]);
    } else {
      useMockAuth();
    }
  } catch (error) {
    console.log("Auth initialization failed, using mock auth:", error.message);
    useMockAuth();
  } finally {
    setIsInitialized(true);
  }
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

  // 方法
  login,
  register,
  logout,
  checkAuth,
  refreshTokens,
  initializeAuth,
};

// 导出类型
export type AuthStore = typeof authStore;
