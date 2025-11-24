import { InternalAxiosRequestConfig } from 'axios';

/**
 * 扩展 Axios 配置类型以支持 metadata
 */
export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
    requestId: string;
  };
}

/**
 * API 响应接口
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

/**
 * API 性能数据接口
 */
export interface ApiPerformanceData {
  requestId: string;
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: string;
  success: boolean;
}

/**
 * 错误处理器接口
 */
export interface ErrorHandler {
  status: number;
  message: string;
  handler?: () => void;
}
