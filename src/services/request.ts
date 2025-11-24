import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from './api';
import { ApiResponse } from './types';

/**
 * 通用请求方法工厂函数
 */
const createRequestMethod = <T = any>(
  method: 'get' | 'post' | 'put' | 'delete'
) => {
  return (
    url: string,
    dataOrConfig?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const apiMethod = api[method] as any;

    if (method === 'get' || method === 'delete') {
      return apiMethod(url, dataOrConfig).then(
        (response: AxiosResponse) => response.data
      );
    } else {
      return apiMethod(url, dataOrConfig, config).then(
        (response: AxiosResponse) => response.data
      );
    }
  };
};

/**
 * 通用 GET 请求
 */
export const get = createRequestMethod('get');

/**
 * 通用 POST 请求
 */
export const post = createRequestMethod('post');

/**
 * 通用 PUT 请求
 */
export const put = createRequestMethod('put');

/**
 * 通用 DELETE 请求
 */
export const del = createRequestMethod('delete');

/**
 * 文件上传
 */
export const uploadFile = (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return api
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    })
    .then(response => response.data);
};
