/**
 * 环境配置工具类
 * 用于管理和验证环境变量配置
 */

export interface EnvConfig {
  // 基础配置
  nodeEnv: string;
  version: string;
  debug: boolean;
  
  // API 配置
  apiBaseUrl: string;
  apiTimeout: number;
  
  // Sentry 配置
  sentryDsn: string;
  sentryEnvironment: string;
  
  // 功能开关
  useMock: boolean;
  enableDevtools: boolean;
  enableAnalytics: boolean;
  
  // 日志配置
  logLevel: string;
}

/**
 * 获取环境配置
 */
export function getEnvConfig(): EnvConfig {
  return {
    // 基础配置
    nodeEnv: process.env.NODE_ENV || 'development',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    debug: process.env.REACT_APP_DEBUG === 'true',
    
    // API 配置
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
    apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10),
    
    // Sentry 配置
    sentryDsn: process.env.REACT_APP_SENTRY_DSN || '',
    sentryEnvironment: process.env.REACT_APP_SENTRY_ENVIRONMENT || 'development',
    
    // 功能开关
    useMock: process.env.REACT_APP_USE_MOCK === 'true',
    enableDevtools: process.env.REACT_APP_ENABLE_DEVTOOLS === 'true',
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    
    // 日志配置
    logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
  };
}

/**
 * 验证必需的环境变量
 */
export function validateEnvConfig(): boolean {
  const config = getEnvConfig();
  const requiredFields = ['apiBaseUrl', 'version'];
  
  for (const field of requiredFields) {
    if (!config[field as keyof EnvConfig]) {
      console.error(`❌ 缺少必需的环境变量: ${field}`);
      return false;
    }
  }
  
  console.log('✅ 环境配置验证通过');
  return true;
}

/**
 * 打印当前环境配置（仅在开发环境）
 */
export function logEnvConfig(): void {
  if (process.env.NODE_ENV === 'development') {
    const config = getEnvConfig();
    console.group('🔧 当前环境配置');
    console.log('环境:', config.nodeEnv);
    console.log('版本:', config.version);
    console.log('调试模式:', config.debug);
    console.log('API 地址:', config.apiBaseUrl);
    console.log('API 超时:', `${config.apiTimeout  }ms`);
    console.log('使用 Mock:', config.useMock);
    console.log('开发工具:', config.enableDevtools);
    console.log('日志级别:', config.logLevel);
    console.groupEnd();
  }
}

// 默认导出配置对象
export default getEnvConfig();