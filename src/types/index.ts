import type { ComponentType, ReactNode } from 'react';

/**
 * 表单数据接口
 */
export interface FormData {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  gender: 'male' | 'female';
  interests: string[];
  description?: string;
}

/**
 * 表单提交响应接口
 */
export interface FormSubmitResponse {
  success: boolean;
  message: string;
  data?: FormData;
}

/**
 * 通用响应接口
 */
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

/**
 * 分页参数接口
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark';

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'en-US';

/**
 * 路由配置接口
 */
export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  exact?: boolean;
  children?: RouteConfig[];
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    roles?: string[];
  };
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
}

/**
 * 表格列配置接口
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: number | string;
  fixed?: 'left' | 'right';
  render?: (value: any, record: T, index: number) => ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: Array<{ text: string; value: string | number }>;
  onFilter?: (value: string | number, record: T) => boolean;
}

/**
 * 表单字段接口
 */
export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  validation?: {
    pattern?: RegExp;
    message?: string;
    min?: number;
    max?: number;
  };
}

/**
 * 文件上传响应接口
 */
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * 通知消息接口
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  closable?: boolean;
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  inp: number; // Interaction to Next Paint
  ttfb: number; // Time to First Byte
}

/**
 * 环境变量接口
 */
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  REACT_APP_API_BASE_URL: string;
  REACT_APP_SENTRY_DSN: string;
  REACT_APP_VERSION: string;
}

/**
 * 本地存储键名枚举
 */
export enum StorageKeys {
  AUTH_TOKEN = 'auth_token',
  USER_INFO = 'user_info',
  THEME = 'theme',
  LANGUAGE = 'language',
  SETTINGS = 'settings',
}
