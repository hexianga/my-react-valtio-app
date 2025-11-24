import { AxiosInstance, AxiosResponse } from 'axios';
import { ExtendedAxiosRequestConfig, ErrorHandler } from './types';
import {
  generateRequestId,
  logApiPerformance,
  buildPerformanceData,
  recordApiPerformance,
} from './utils';

/**
 * 错误处理器映射表
 */
const errorHandlers: Record<number, ErrorHandler> = {
  401: {
    status: 401,
    message: '❌ 认证失败: 请重新登录',
    handler: () => {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    },
  },
  403: {
    status: 403,
    message: '❌ 禁止访问: 没有权限访问此资源',
  },
  404: {
    status: 404,
    message: '❌ 资源不存在: 请检查请求 URL',
  },
  500: {
    status: 500,
    message: '❌ 服务器错误: 请稍后重试',
  },
};

/**
 * 处理响应错误
 */
const handleResponseError = (error: any): void => {
  if (error.response) {
    const handler = errorHandlers[error.response.status];
    if (handler) {
      console.error(handler.message);
      handler.handler?.();
    } else {
      console.error('❌ API 错误:', error.response.data);
    }
  } else if (error.request) {
    console.error('❌ 网络错误: 请检查网络连接');
  } else {
    console.error('❌ 错误:', error.message);
  }
};

/**
 * 处理响应完成（成功或失败）
 */
const handleResponseComplete = (
  config: ExtendedAxiosRequestConfig | undefined,
  status: number,
  success: boolean
): void => {
  const endTime = Date.now();
  const startTime = config?.metadata?.startTime || endTime;
  const duration = endTime - startTime;

  const performanceData = buildPerformanceData(
    config,
    status,
    duration,
    success
  );
  logApiPerformance(performanceData);
  recordApiPerformance(config, duration);
};

/**
 * 设置请求拦截器
 */
export const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: ExtendedAxiosRequestConfig) => {
      const requestId = generateRequestId();

      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers['X-Request-ID'] = requestId;

      config.metadata = {
        startTime: Date.now(),
        requestId,
      };

      console.log(
        `%c[API] 发起请求 ${config.method?.toUpperCase()} ${config.url}`,
        'color: #3b82f6; font-weight: bold;'
      );

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

/**
 * 设置响应拦截器
 */
export const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as ExtendedAxiosRequestConfig;
      handleResponseComplete(config, response.status, true);
      return response;
    },
    error => {
      const config = error.config as ExtendedAxiosRequestConfig;
      const status = error.response?.status || 0;

      handleResponseComplete(config, status, false);
      handleResponseError(error);

      return Promise.reject(error);
    }
  );
};

/**
 * 设置所有拦截器
 */
export const setupInterceptors = (instance: AxiosInstance): void => {
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
};
