import { proxy, subscribe } from 'valtio';
import { subscribeKey } from 'valtio/utils';

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

/**
 * 应用状态接口
 */
export interface AppState {
  // 用户相关
  user: User | null;
  isAuthenticated: boolean;
  
  // 应用状态
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  
  // 错误状态
  error: string | null;
  
  // 计数器示例
  count: number;
}

/**
 * 创建应用状态
 */
export const appState = proxy<AppState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  theme: 'light',
  language: 'zh-CN',
  error: null,
  count: 0,
});

/**
 * 用户相关操作
 */
export const userActions = {
  /**
   * 设置用户信息
   */
  setUser: (user: User) => {
    appState.user = user;
    appState.isAuthenticated = true;
  },
  
  /**
   * 清除用户信息
   */
  clearUser: () => {
    appState.user = null;
    appState.isAuthenticated = false;
  },
  
  /**
   * 更新用户信息
   */
  updateUser: (updates: Partial<User>) => {
    if (appState.user) {
      appState.user = { ...appState.user, ...updates };
    }
  },
};

/**
 * 应用状态操作
 */
export const appActions = {
  /**
   * 设置加载状态
   */
  setLoading: (loading: boolean) => {
    appState.isLoading = loading;
  },
  
  /**
   * 切换主题
   */
  toggleTheme: () => {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    // 保存到本地存储
    localStorage.setItem('theme', appState.theme);
  },
  
  /**
   * 设置主题
   */
  setTheme: (theme: 'light' | 'dark') => {
    appState.theme = theme;
    localStorage.setItem('theme', theme);
  },
  
  /**
   * 设置语言
   */
  setLanguage: (language: 'zh-CN' | 'en-US') => {
    appState.language = language;
    localStorage.setItem('language', language);
  },
  
  /**
   * 设置错误信息
   */
  setError: (error: string | null) => {
    appState.error = error;
  },
  
  /**
   * 清除错误信息
   */
  clearError: () => {
    appState.error = null;
  },
  
  /**
   * 增加计数器
   */
  increment: () => {
    appState.count += 1;
  },
  
  /**
   * 减少计数器
   */
  decrement: () => {
    appState.count -= 1;
  },
  
  /**
   * 重置计数器
   */
  reset: () => {
    appState.count = 0;
  },
};

/**
 * 初始化应用状态
 * 从本地存储恢复设置
 */
export const initializeAppState = () => {
  // 恢复主题设置
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  if (savedTheme) {
    appState.theme = savedTheme;
  }
  
  // 恢复语言设置
  const savedLanguage = localStorage.getItem('language') as 'zh-CN' | 'en-US';
  if (savedLanguage) {
    appState.language = savedLanguage;
  }
  
  // 恢复用户认证状态
  const token = localStorage.getItem('auth_token');
  if (token) {
    // 这里可以验证 token 有效性
    appState.isAuthenticated = true;
  }
};

/**
 * 订阅状态变化
 * 用于持久化存储或其他副作用
 */
export const setupStateSubscriptions = () => {
  // 订阅主题变化
  subscribeKey(appState, 'theme', (theme) => {
    // 应用主题到 DOM
    document.documentElement.setAttribute('data-theme', theme);
  });
  
  // 订阅语言变化
  subscribeKey(appState, 'language', (language) => {
    // 这里可以触发国际化更新
    console.log('Language changed to:', language);
  });
  
  // 订阅认证状态变化
  subscribeKey(appState, 'isAuthenticated', (isAuthenticated) => {
    if (!isAuthenticated) {
      // 清除本地存储的认证信息
      localStorage.removeItem('auth_token');
    }
  });
};

// 导出所有操作
export const actions = {
  ...userActions,
  ...appActions,
};
