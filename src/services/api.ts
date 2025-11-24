import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

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

  // 设置所有拦截器
  setupInterceptors(instance);

  return instance;
};

// 创建 API 实例
export const api = createApiInstance();

export default api;
