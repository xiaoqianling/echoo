// 安全存储管理器
class SecureStorageManager {
  private static instance: SecureStorageManager;
  private encryptionKey: string | null = null;

  static getInstance(): SecureStorageManager {
    if (!SecureStorageManager.instance) {
      SecureStorageManager.instance = new SecureStorageManager();
    }
    return SecureStorageManager.instance;
  }

  private constructor() {
    this.initializeEncryptionKey();
  }

  // 初始化加密密钥（实际项目中应从安全来源获取）
  private initializeEncryptionKey(): void {
    // 从环境变量或配置中获取加密密钥
    this.encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || 'default-encryption-key';
    
    // 生产环境应该使用更安全的密钥管理方案
    if (import.meta.env.PROD && this.encryptionKey === 'default-encryption-key') {
      console.warn('⚠️ 使用默认加密密钥，生产环境请配置安全密钥');
    }
  }

  // 简单的加密函数（实际项目应使用更安全的加密库）
  private encrypt(data: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    
    // 简单的 Base64 编码（实际项目应使用 AES 加密）
    const encoded = btoa(unescape(encodeURIComponent(data)));
    return `encrypted:${encoded}`;
  }

  // 解密函数
  private decrypt(encryptedData: string): string {
    if (!encryptedData.startsWith('encrypted:')) {
      return encryptedData; // 未加密的数据
    }
    
    const encoded = encryptedData.substring(10);
    try {
      return decodeURIComponent(escape(atob(encoded)));
    } catch {
      throw new Error('Failed to decrypt data');
    }
  }

  // 安全存储 token
  setSecureToken(key: string, value: string, options: { encrypt?: boolean } = {}): void {
    const shouldEncrypt = options.encrypt ?? true;
    const processedValue = shouldEncrypt ? this.encrypt(value) : value;
    
    localStorage.setItem(key, processedValue);
  }

  // 安全获取 token
  getSecureToken(key: string): string | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    try {
      return this.decrypt(value);
    } catch {
      // 解密失败，可能是未加密的数据
      return value;
    }
  }

  // 清除安全存储
  removeSecureToken(key: string): void {
    localStorage.removeItem(key);
  }

  // 检查存储是否安全（验证加密是否正常工作）
  isStorageSecure(): boolean {
    try {
      const testData = 'security-test';
      this.setSecureToken('__security_test', testData);
      const retrieved = this.getSecureToken('__security_test');
      this.removeSecureToken('__security_test');
      return retrieved === testData;
    } catch {
      return false;
    }
  }
}

// 导出单例实例
export const secureStorage = SecureStorageManager.getInstance();

// 专门用于 token 的安全存储
export class SecureTokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'secure_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'secure_refresh_token';
  private static readonly TOKEN_META_KEY = 'secure_token_meta';

  // 存储 tokens
  static setTokens(accessToken: string, refreshToken: string): void {
    secureStorage.setSecureToken(this.ACCESS_TOKEN_KEY, accessToken);
    secureStorage.setSecureToken(this.REFRESH_TOKEN_KEY, refreshToken);
    
    // 存储 token 元数据（不加密）
    const meta = {
      storedAt: Date.now(),
      userAgent: navigator.userAgent,
      origin: window.location.origin
    };
    localStorage.setItem(this.TOKEN_META_KEY, JSON.stringify(meta));
  }

  // 获取 tokens
  static getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: secureStorage.getSecureToken(this.ACCESS_TOKEN_KEY),
      refreshToken: secureStorage.getSecureToken(this.REFRESH_TOKEN_KEY)
    };
  }

  // 清除 tokens
  static clearTokens(): void {
    secureStorage.removeSecureToken(this.ACCESS_TOKEN_KEY);
    secureStorage.removeSecureToken(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_META_KEY);
  }

  // 验证 token 安全性
  static validateTokenSecurity(): boolean {
    const meta = localStorage.getItem(this.TOKEN_META_KEY);
    if (!meta) return false;
    
    try {
      const { userAgent, origin } = JSON.parse(meta);
      
      // 检查用户代理和来源是否匹配
      return userAgent === navigator.userAgent && 
             origin === window.location.origin;
    } catch {
      return false;
    }
  }

  // 检查存储是否被篡改
  static isStorageTampered(): boolean {
    const tokens = this.getTokens();
    const metaExists = !!localStorage.getItem(this.TOKEN_META_KEY);
    
    // 如果 tokens 存在但元数据不存在，可能被篡改
    if ((tokens.accessToken || tokens.refreshToken) && !metaExists) {
      return true;
    }
    
    return false;
  }
}