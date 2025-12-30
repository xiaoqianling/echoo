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
  isInitialized: boolean;
}

// 创建基础状态
const [authState, setAuthState] = createStore<AuthState>({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,
});

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
export const refreshTokens = async (): Promise<void> => {};

// 停止自动刷新机制
export const stopAutoRefresh = () => {};

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
  stopAutoRefresh,
};

// 导出类型
export type AuthStore = typeof authStore;
