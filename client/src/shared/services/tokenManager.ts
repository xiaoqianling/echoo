import { createSignal } from "solid-js";

// Token 管理事件类型
type TokenEvent = 'token-updated' | 'token-expired' | 'token-cleared';

// 统一的 Token 管理器
class UnifiedTokenManager {
  private static instance: UnifiedTokenManager;
  private accessToken = createSignal<string | null>(null);
  private refreshToken = createSignal<string | null>(null);
  private eventListeners = new Map<TokenEvent, Set<() => void>>();

  // 单例模式
  static getInstance(): UnifiedTokenManager {
    if (!UnifiedTokenManager.instance) {
      UnifiedTokenManager.instance = new UnifiedTokenManager();
    }
    return UnifiedTokenManager.instance;
  }

  private constructor() {
    this.initializeFromStorage();
    this.setupStorageListener();
  }

  // 从存储初始化
  private initializeFromStorage(): void {
    const [setAccessToken] = this.accessToken;
    const [setRefreshToken] = this.refreshToken;
    
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    
    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);
  }

  // 监听存储变化（多标签页同步）
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'accessToken' || event.key === 'refreshToken') {
        this.initializeFromStorage();
        this.emitEvent('token-updated');
      }
    });
  }

  // 获取当前 tokens
  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    const [accessToken] = this.accessToken;
    const [refreshToken] = this.refreshToken;
    return { accessToken: accessToken(), refreshToken: refreshToken() };
  }

  // 设置 tokens
  setTokens(accessToken: string, refreshToken: string): void {
    const [setAccessToken] = this.accessToken;
    const [setRefreshToken] = this.refreshToken;
    
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("tokenTimestamp", Date.now().toString());
    
    this.emitEvent('token-updated');
  }

  // 清除 tokens
  clearTokens(): void {
    const [setAccessToken] = this.accessToken;
    const [setRefreshToken] = this.refreshToken;
    
    setAccessToken(null);
    setRefreshToken(null);
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenTimestamp");
    
    this.emitEvent('token-cleared');
  }

  // 检查 token 是否过期
  isTokenExpired(): boolean {
    const timestamp = localStorage.getItem("tokenTimestamp");
    if (!timestamp) return true;
    
    const tokenAge = Date.now() - parseInt(timestamp);
    return tokenAge > 7 * 24 * 60 * 60 * 1000; // 7天
  }

  // 事件管理
  on(event: TokenEvent, callback: () => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: TokenEvent, callback: () => void): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emitEvent(event: TokenEvent): void {
    this.eventListeners.get(event)?.forEach(callback => callback());
  }
}

// 导出单例实例
export const tokenManager = UnifiedTokenManager.getInstance();