// 安全刷新管理器
class SecureRefreshManager {
  private static instance: SecureRefreshManager;
  private lastRefreshTime = 0;
  private refreshAttempts = 0;
  private maxRefreshAttempts = 5;
  private refreshWindowStart = 0;
  
  // 刷新限制配置
  private readonly MIN_REFRESH_INTERVAL = 30000; // 30秒最小间隔
  private readonly MAX_REFRESH_ATTEMPTS_PER_HOUR = 10; // 每小时最多10次
  private readonly REFRESH_WINDOW_DURATION = 60 * 60 * 1000; // 1小时窗口

  static getInstance(): SecureRefreshManager {
    if (!SecureRefreshManager.instance) {
      SecureRefreshManager.instance = new SecureRefreshManager();
    }
    return SecureRefreshManager.instance;
  }

  private constructor() {
    this.initializeFromStorage();
  }

  // 从存储初始化刷新状态
  private initializeFromStorage(): void {
    const storedState = localStorage.getItem('secure_refresh_state');
    if (storedState) {
      try {
        const state = JSON.parse(storedState);
        this.lastRefreshTime = state.lastRefreshTime || 0;
        this.refreshAttempts = state.refreshAttempts || 0;
        this.refreshWindowStart = state.refreshWindowStart || 0;
      } catch {
        // 解析失败，重置状态
        this.resetRefreshState();
      }
    }
  }

  // 保存刷新状态到存储
  private saveRefreshState(): void {
    const state = {
      lastRefreshTime: this.lastRefreshTime,
      refreshAttempts: this.refreshAttempts,
      refreshWindowStart: this.refreshWindowStart,
      savedAt: Date.now()
    };
    localStorage.setItem('secure_refresh_state', JSON.stringify(state));
  }

  // 重置刷新状态
  private resetRefreshState(): void {
    this.lastRefreshTime = 0;
    this.refreshAttempts = 0;
    this.refreshWindowStart = Date.now();
    this.saveRefreshState();
  }

  // 检查是否可以安全刷新
  canRefreshSafely(): { canRefresh: boolean; reason?: string; waitTime?: number } {
    const now = Date.now();
    
    // 检查最小刷新间隔
    if (now - this.lastRefreshTime < this.MIN_REFRESH_INTERVAL) {
      const waitTime = this.MIN_REFRESH_INTERVAL - (now - this.lastRefreshTime);
      return {
        canRefresh: false,
        reason: '刷新过于频繁',
        waitTime
      };
    }

    // 检查刷新窗口
    if (now - this.refreshWindowStart > this.REFRESH_WINDOW_DURATION) {
      // 新的一小时窗口开始
      this.resetRefreshState();
    }

    // 检查每小时最大尝试次数
    if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS_PER_HOUR) {
      const timeLeft = this.REFRESH_WINDOW_DURATION - (now - this.refreshWindowStart);
      return {
        canRefresh: false,
        reason: '每小时刷新次数超限',
        waitTime: timeLeft
      };
    }

    return { canRefresh: true };
  }

  // 安全刷新 token
  async refreshTokensSafely(): Promise<{ success: boolean; newTokens?: any; error?: string }> {
    const safetyCheck = this.canRefreshSafely();
    if (!safetyCheck.canRefresh) {
      return {
        success: false,
        error: safetyCheck.reason
      };
    }

    try {
      // 记录刷新尝试
      this.refreshAttempts++;
      this.lastRefreshTime = Date.now();
      this.saveRefreshState();

      // 执行实际的刷新逻辑
      const { apiService } = await import('./api');
      const newTokens = await apiService.refreshAuthToken();

      // 刷新成功，重置尝试计数（但保持窗口）
      this.refreshAttempts = 0;
      this.saveRefreshState();

      return {
        success: true,
        newTokens
      };

    } catch (error) {
      console.error('安全刷新失败:', error);
      
      // 刷新失败，增加失败计数
      this.refreshAttempts++;
      this.saveRefreshState();

      return {
        success: false,
        error: error instanceof Error ? error.message : '刷新失败'
      };
    }
  }

  // 获取刷新统计信息
  getRefreshStats(): {
    attemptsThisHour: number;
    maxAttemptsPerHour: number;
    lastRefreshTime: number;
    timeUntilNextWindow: number;
  } {
    const now = Date.now();
    const timeUntilNextWindow = Math.max(0, this.REFRESH_WINDOW_DURATION - (now - this.refreshWindowStart));
    
    return {
      attemptsThisHour: this.refreshAttempts,
      maxAttemptsPerHour: this.MAX_REFRESH_ATTEMPTS_PER_HOUR,
      lastRefreshTime: this.lastRefreshTime,
      timeUntilNextWindow
    };
  }

  // 强制重置刷新状态（用于测试或特殊情况）
  forceReset(): void {
    this.resetRefreshState();
  }

  // 检查是否存在异常刷新模式
  detectAnomalousBehavior(): boolean {
    const stats = this.getRefreshStats();
    
    // 如果在一小时内达到最大尝试次数的80%，认为异常
    const threshold = this.MAX_REFRESH_ATTEMPTS_PER_HOUR * 0.8;
    const timeElapsed = Date.now() - this.refreshWindowStart;
    const expectedRate = (this.MAX_REFRESH_ATTEMPTS_PER_HOUR / this.REFRESH_WINDOW_DURATION) * timeElapsed;
    
    return this.refreshAttempts > threshold && 
           this.refreshAttempts > expectedRate * 1.5; // 超过预期速率50%
  }
}

// 导出单例实例
export const secureRefreshManager = SecureRefreshManager.getInstance();

// 安全刷新包装器
export const withSecureRefresh = async <T>(
  operation: () => Promise<T>,
  options: { 
    maxRetries?: number; 
    onRateLimit?: () => void;
  } = {}
): Promise<T> => {
  const { maxRetries = 3, onRateLimit } = options;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      // 检查是否是认证错误
      if (error.response?.status === 401) {
        const refreshResult = await secureRefreshManager.refreshTokensSafely();
        
        if (refreshResult.success) {
          // 刷新成功，重试操作
          continue;
        } else {
          // 刷新失败或频率限制
          if (refreshResult.error?.includes('频繁') && onRateLimit) {
            onRateLimit();
          }
          throw new Error(`认证失败: ${refreshResult.error}`);
        }
      }
      
      // 其他错误直接抛出
      throw error;
    }
  }
  
  throw new Error(`操作失败，已达到最大重试次数: ${maxRetries}`);
};