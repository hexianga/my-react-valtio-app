import { trackApiPerformance } from '../utils/sentry';
import { ApiPerformanceData, ExtendedAxiosRequestConfig } from './types';

/**
 * 生成唯一的请求 ID
 */
export const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 格式化时长显示
 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

/**
 * 获取当前时间戳
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toLocaleTimeString('zh-CN');
};

/**
 * 输出 API 性能日志
 */
export const logApiPerformance = (data: ApiPerformanceData): void => {
  const { requestId, url, method, status, duration, success } = data;
  const statusIcon = success ? '✅' : '❌';
  const durationFormatted = formatDuration(duration);
  const logStyle = success
    ? 'color: #10b981; font-weight: bold;'
    : 'color: #ef4444; font-weight: bold;';

  const logMessage = `
    ${statusIcon} [API] ${method.toUpperCase()} ${url}
    ├─ 请求ID: ${requestId}
    ├─ 状态码: ${status}
    ├─ 端到端耗时: ${durationFormatted}
    └─ 时间: ${data.timestamp}
  `;

  const logFn = success ? console.log : console.error;
  logFn(`%c${logMessage}`, logStyle);
};

/**
 * 构建性能数据对象
 */
export const buildPerformanceData = (
  config: ExtendedAxiosRequestConfig | undefined,
  status: number,
  duration: number,
  success: boolean
): ApiPerformanceData => {
  return {
    requestId: config?.metadata?.requestId || 'unknown',
    url: config?.url || 'unknown',
    method: config?.method || 'GET',
    status,
    duration,
    timestamp: getCurrentTimestamp(),
    success,
  };
};

/**
 * 记录 API 性能
 */
export const recordApiPerformance = (
  config: ExtendedAxiosRequestConfig | undefined,
  duration: number
): void => {
  if (config?.url) {
    trackApiPerformance(config.url, config.method || 'GET', duration);
  }
};
