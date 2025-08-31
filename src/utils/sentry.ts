import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * 初始化 Sentry 配置
 * 包含错误捕获、性能监控、页面 PV 统计等功能
 */
export const initSentry = () => {
  // 注意：在生产环境中需要替换为实际的 DSN
  const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || 'your-sentry-dsn-here';
  
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        // 设置路由变化追踪
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          (history) => history,
          [],
          [],
          {
            // 启用路由变化追踪
            enableLongTask: true,
            enableInp: true, // 启用 INP 指标
          }
        ),
      }),
    ],
    
    // 性能监控配置
    tracesSampleRate: 1.0, // 采样率，生产环境建议设置为 0.1
    replaysSessionSampleRate: 0.1, // 会话重放采样率
    replaysOnErrorSampleRate: 1.0, // 错误时重放采样率
    
    // 环境配置
    environment: process.env.NODE_ENV,
    
    // 启用 Web Vitals 监控
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          (history) => history,
          [],
          [],
          {
            enableLongTask: true,
            enableInp: true,
          }
        ),
      }),
    ],
    
    // 错误过滤
    beforeSend(event) {
      // 过滤掉一些不需要的错误
      if (event.exception) {
        const exception = event.exception.values?.[0];
        if (exception?.type === 'ChunkLoadError') {
          return null; // 忽略代码分割加载错误
        }
      }
      return event;
    },
    
    // 启用调试模式（开发环境）
    debug: process.env.NODE_ENV === 'development',
  });
};

/**
 * 手动捕获错误
 * @param error 错误对象
 * @param context 错误上下文
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * 手动捕获消息
 * @param message 消息内容
 * @param level 消息级别
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info'
) => {
  Sentry.captureMessage(message, level);
};

/**
 * 设置用户信息
 * @param user 用户信息
 */
export const setUser = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

/**
 * 设置标签
 * @param key 标签键
 * @param value 标签值
 */
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

/**
 * 设置额外上下文
 * @param key 上下文键
 * @param value 上下文值
 */
export const setContext = (key: string, value: Record<string, any>) => {
  Sentry.setContext(key, value);
};

/**
 * 开始性能监控
 * @param name 事务名称
 * @param operation 操作名称
 */
export const startTransaction = (name: string, operation: string) => {
  return Sentry.startTransaction({
    name,
    op: operation,
  });
};

/**
 * 监控 API 请求性能
 * @param url API URL
 * @param method HTTP 方法
 * @param duration 请求耗时
 */
export const trackApiPerformance = (url: string, method: string, duration: number) => {
  const transaction = Sentry.startTransaction({
    name: `${method} ${url}`,
    op: 'http.request',
  });
  
  transaction.setTag('http.method', method);
  transaction.setTag('http.url', url);
  transaction.setData('http.duration', duration);
  
  // 根据耗时设置不同的标签
  if (duration > 3000) {
    transaction.setTag('performance.slow', 'true');
  } else if (duration > 1000) {
    transaction.setTag('performance.medium', 'true');
  } else {
    transaction.setTag('performance.fast', 'true');
  }
  
  transaction.finish();
};
