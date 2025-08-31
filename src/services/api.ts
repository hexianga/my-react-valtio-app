import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { trackApiPerformance } from '@/utils/sentry';

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
 * 创建 Axios 实例
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加认证 token
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 记录请求开始时间
      config.metadata = { startTime: Date.now() };
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 计算请求耗时
      const endTime = Date.now();
      const startTime = response.config.metadata?.startTime || endTime;
      const duration = endTime - startTime;
      
      // 记录 API 性能
      trackApiPerformance(
        response.config.url || '',
        response.config.method || 'GET',
        duration
      );
      
      return response;
    },
    (error) => {
      // 计算请求耗时（错误情况）
      const endTime = Date.now();
      const startTime = error.config?.metadata?.startTime || endTime;
      const duration = endTime - startTime;
      
      // 记录 API 性能（错误情况）
      if (error.config?.url) {
        trackApiPerformance(
          error.config.url,
          error.config.method || 'GET',
          duration
        );
      }
      
      // 处理常见错误
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 未授权，清除 token 并跳转到登录页
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            break;
          case 403:
            // 禁止访问
            console.error('Access forbidden');
            break;
          case 404:
            // 资源不存在
            console.error('Resource not found');
            break;
          case 500:
            // 服务器错误
            console.error('Server error');
            break;
          default:
            console.error('API error:', error.response.data);
        }
      } else if (error.request) {
        // 网络错误
        console.error('Network error:', error.request);
      } else {
        // 其他错误
        console.error('Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// 创建 API 实例
export const api = createApiInstance();

/**
 * 通用 GET 请求
 * @param url 请求 URL
 * @param config 请求配置
 */
export const get = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return api.get(url, config).then((response) => response.data);
};

/**
 * 通用 POST 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 请求配置
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return api.post(url, data, config).then((response) => response.data);
};

/**
 * 通用 PUT 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 请求配置
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return api.put(url, data, config).then((response) => response.data);
};

/**
 * 通用 DELETE 请求
 * @param url 请求 URL
 * @param config 请求配置
 */
export const del = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return api.delete(url, config).then((response) => response.data);
};

/**
 * 文件上传
 * @param url 上传 URL
 * @param file 文件对象
 * @param onProgress 进度回调
 */
export const uploadFile = (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  }).then((response) => response.data);
};

export default api;
