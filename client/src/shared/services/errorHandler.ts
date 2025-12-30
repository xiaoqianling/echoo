// 错误类型定义
type ErrorType = 'network' | 'authentication' | 'authorization' | 'validation' | 'server' | 'unknown';

// 错误处理配置
interface ErrorHandlerConfig {
  showToast?: boolean;
  logToConsole?: boolean;
  redirectOnAuthError?: boolean;
  maxRetries?: number;
}

// 统一的错误处理器
class ErrorHandler {
  private static instance: ErrorHandler;
  private config: ErrorHandlerConfig;
  private retryCounts = new Map<string, number>();

  static getInstance(config?: ErrorHandlerConfig): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(config);
    }
    return ErrorHandler.instance;
  }

  private constructor(config?: ErrorHandlerConfig) {
    this.config = {
      showToast: true,
      logToConsole: true,
      redirectOnAuthError: true,
      maxRetries: 3,
      ...config,
    };
  }

  // 处理认证相关错误
  handleAuthError(error: any, context?: string): void {
    if (this.config.logToConsole) {
      console.error(`🔐 Auth Error${context ? ` (${context})` : ''}:`, error);
    }

    // 根据错误类型采取不同措施
    if (error.response?.status === 401) {
      // Token 无效
      this.handleTokenInvalid(error);
    } else if (error.response?.status === 429) {
      // 请求过于频繁
      this.handleRateLimit(error);
    } else if (error.message?.includes('network')) {
      // 网络错误
      this.handleNetworkError(error);
    } else {
      // 其他认证错误
      this.handleGenericAuthError(error);
    }
  }

  // 处理网络错误
  handleNetworkError(error: any): void {
    if (this.config.showToast) {
      this.showToast('网络连接错误，请检查网络后重试', 'error');
    }
  }

  // 处理 token 无效
  private handleTokenInvalid(error: any): void {
    // 清除本地存储
    import('./tokenManager').then(({ tokenManager }) => {
      tokenManager.clearTokens();
    });

    if (this.config.redirectOnAuthError) {
      // 延迟跳转以避免竞态条件
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }

    if (this.config.showToast) {
      this.showToast('登录已过期，请重新登录', 'warning');
    }
  }

  // 处理频率限制
  private handleRateLimit(error: any): void {
    if (this.config.showToast) {
      this.showToast('操作过于频繁，请稍后再试', 'warning');
    }
  }

  // 处理通用认证错误
  private handleGenericAuthError(error: any): void {
    if (this.config.showToast) {
      this.showToast('认证失败，请检查登录信息', 'error');
    }
  }

  // 显示 toast 消息
  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // 这里可以集成实际的 toast 库
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // 实际项目中可以这样实现：
    // toast[type](message);
  }

  // 检查是否应该重试
  shouldRetry(error: any, operationId: string): boolean {
    const count = this.retryCounts.get(operationId) || 0;
    
    // 网络错误和服务器错误可以重试
    const retryable = error.response?.status >= 500 || 
                     error.message?.includes('network') ||
                     error.code === 'ECONNREFUSED';
    
    if (retryable && count < this.config.maxRetries!) {
      this.retryCounts.set(operationId, count + 1);
      return true;
    }
    
    return false;
  }

  // 重置重试计数
  resetRetryCount(operationId: string): void {
    this.retryCounts.delete(operationId);
  }

  // 获取错误类型
  getErrorType(error: any): ErrorType {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return 'authentication';
    } else if (error.response?.status === 422) {
      return 'validation';
    } else if (error.response?.status >= 500) {
      return 'server';
    } else if (error.message?.includes('network') || error.code === 'ECONNREFUSED') {
      return 'network';
    }
    return 'unknown';
  }
}

// 导出单例实例
export const errorHandler = ErrorHandler.getInstance();

// 便捷函数
export const handleAuthError = (error: any, context?: string) => {
  errorHandler.handleAuthError(error, context);
};

export const handleNetworkError = (error: any) => {
  errorHandler.handleNetworkError(error);
};