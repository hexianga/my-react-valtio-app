# 🚀 Axios 请求封装优化指南

## 📋 概述

项目已有 axios 封装，本次优化主要增强了 API 性能监控和日志输出功能，特别是添加了**端到端时长追踪**和**请求 ID 追踪**。

## ✨ 优化内容

### 1. 🆔 请求 ID 追踪

**功能**: 为每个请求生成唯一的请求 ID，便于追踪和调试

```typescript
// 自动生成格式: timestamp-randomString
// 例如: 1700000000000-abc123def
const requestId = generateRequestId();
```

**优势**:
- ✅ 便于追踪请求链路
- ✅ 支持前后端日志关联
- ✅ 便于问题排查和性能分析

### 2. ⏱️ 端到端时长追踪

**功能**: 精确计算从发起请求到收到响应的完整耗时

```typescript
// 自动计算并输出
// 例如: 298ms 或 1.23s
const duration = endTime - startTime;
const formatted = formatDuration(duration);
```

**特点**:
- ✅ 毫秒级精度
- ✅ 自动格式化显示
- ✅ 支持成功和失败情况

### 3. 📊 详细的性能日志

**功能**: 在浏览器控制台输出详细的 API 性能信息

#### 请求开始日志
```
[API] 发起请求 GET /api/users
```

#### 请求完成日志（成功）
```
✅ [API] GET /api/users
├─ 请求ID: 1700000000000-abc123def
├─ 状态码: 200
├─ 端到端耗时: 298ms
└─ 时间: 14:30:45
```

#### 请求完成日志（失败）
```
❌ [API] POST /api/login
├─ 请求ID: 1700000000001-xyz789abc
├─ 状态码: 401
├─ 端到端耗时: 125ms
└─ 时间: 14:30:46
```

### 4. 🔗 请求头集成

**功能**: 自动在请求头中添加请求 ID

```typescript
// 自动添加到所有请求
headers: {
  'X-Request-ID': '1700000000000-abc123def'
}
```

**用途**:
- ✅ 后端可以记录相同的请求 ID
- ✅ 便于前后端日志关联
- ✅ 支持分布式追踪

### 5. 🎨 彩色日志输出

**功能**: 使用不同颜色区分不同类型的日志

- 🔵 **蓝色**: 请求发起
- 🟢 **绿色**: 请求成功
- 🔴 **红色**: 请求失败

### 6. 📈 性能数据结构

**新增接口**:
```typescript
export interface ApiPerformanceData {
  requestId: string;      // 唯一请求 ID
  url: string;            // 请求 URL
  method: string;         // 请求方法
  status: number;         // HTTP 状态码
  duration: number;       // 端到端耗时（毫秒）
  timestamp: string;      // 时间戳
  success: boolean;       // 是否成功
}
```

## 🔧 使用示例

### 基本使用

```typescript
import { get, post, put, del } from '../services/api';

// GET 请求
const data = await get('/users');

// POST 请求
const result = await post('/users', { name: 'John' });

// PUT 请求
const updated = await put('/users/1', { name: 'Jane' });

// DELETE 请求
await del('/users/1');
```

### 文件上传

```typescript
import { uploadFile } from '../services/api';

const file = new File(['content'], 'file.txt');

uploadFile('/upload', file, (progress) => {
  console.log(`上传进度: ${progress}%`);
});
```

### 自定义配置

```typescript
import { api } from '../services/api';

// 使用原始 axios 实例进行自定义请求
api.get('/users', {
  timeout: 5000,
  headers: {
    'Custom-Header': 'value'
  }
});
```

## 📊 控制台输出示例

### 成功请求

```
[API] 发起请求 GET /api/users
✅ [API] GET /api/users
├─ 请求ID: 1700000000000-abc123def
├─ 状态码: 200
├─ 端到端耗时: 298ms
└─ 时间: 14:30:45
```

### 失败请求

```
[API] 发起请求 POST /api/login
❌ [API] POST /api/login
├─ 请求ID: 1700000000001-xyz789abc
├─ 状态码: 401
├─ 端到端耗时: 125ms
└─ 时间: 14:30:46
❌ 认证失败: 请重新登录
```

## 🔍 性能监控

### 查看性能数据

打开浏览器开发者工具（F12），切换到 Console 标签，可以看到所有 API 请求的性能数据。

### 性能分析

1. **快速请求** (< 100ms)
   - 通常表示缓存命中或本地请求
   - 显示为绿色

2. **正常请求** (100ms - 1s)
   - 正常的网络请求
   - 显示为绿色

3. **慢请求** (> 1s)
   - 可能需要优化
   - 显示为红色

## 🛠️ 错误处理

### 自动错误处理

系统会自动处理以下错误：

| 状态码 | 错误类型 | 处理方式 |
|--------|--------|--------|
| 401 | 未授权 | 清除 token，跳转登录页 |
| 403 | 禁止访问 | 显示权限错误提示 |
| 404 | 资源不存在 | 显示资源不存在提示 |
| 500 | 服务器错误 | 显示服务器错误提示 |
| 其他 | 网络错误 | 显示网络错误提示 |

### 错误日志

```
❌ 认证失败: 请重新登录
❌ 禁止访问: 没有权限访问此资源
❌ 资源不存在: 请检查请求 URL
❌ 服务器错误: 请稍后重试
❌ 网络错误: 请检查网络连接
```

## 📝 API 参考

### 导出的函数

```typescript
// 基本请求方法
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>

// 文件上传
export const uploadFile = (url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse>

// 原始 axios 实例
export const api: AxiosInstance
```

### 导出的接口

```typescript
// API 响应
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 性能数据
export interface ApiPerformanceData {
  requestId: string;
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: string;
  success: boolean;
}
```

## 🎯 最佳实践

### 1. 使用请求 ID 追踪

```typescript
// 后端可以从请求头获取 X-Request-ID
// 并在日志中记录相同的 ID
const requestId = request.headers['x-request-id'];
logger.info(`Request ${requestId} started`);
```

### 2. 监控性能指标

```typescript
// 定期检查控制台日志
// 识别慢请求并优化
// 例如: 如果某个请求耗时 > 1s，考虑优化
```

### 3. 错误处理

```typescript
try {
  const data = await get('/users');
  // 处理数据
} catch (error) {
  // 错误已自动处理和记录
  // 可以在这里进行额外的处理
}
```

## 📊 性能优化建议

### 1. 缓存策略

```typescript
// 对于不经常变化的数据，考虑使用缓存
const cachedData = localStorage.getItem('users');
if (cachedData) {
  return JSON.parse(cachedData);
}
```

### 2. 请求合并

```typescript
// 避免发送多个相同的请求
// 使用防抖或节流
```

### 3. 分页加载

```typescript
// 对于大量数据，使用分页加载
const data = await get('/users?page=1&limit=20');
```

## 🔗 相关文件

- **实现文件**: `src/services/api.ts`
- **使用示例**: 项目中的各个页面组件
- **性能监控**: `src/utils/sentry.ts`

## 📞 常见问题

### Q: 如何禁用性能日志？

A: 在生产环境中，可以通过环境变量控制日志输出：

```typescript
if (process.env.NODE_ENV === 'development') {
  logApiPerformance(performanceData);
}
```

### Q: 如何自定义请求 ID 格式？

A: 修改 `generateRequestId()` 函数：

```typescript
const generateRequestId = (): string => {
  // 自定义格式
  return `custom-${Date.now()}`;
};
```

### Q: 如何获取性能数据用于分析？

A: 性能数据会自动发送到 Sentry，也可以在控制台查看。

## ✅ 优化总结

| 功能 | 状态 | 说明 |
|------|------|------|
| 请求 ID 追踪 | ✅ | 自动生成和传递 |
| 端到端时长 | ✅ | 精确计算和显示 |
| 性能日志 | ✅ | 彩色输出到控制台 |
| 错误处理 | ✅ | 自动处理常见错误 |
| 文件上传 | ✅ | 支持进度回调 |
| Sentry 集成 | ✅ | 自动上报性能数据 |

---

**版本**: 2.0.0
**最后更新**: 2024年11月21日
**状态**: ✅ 优化完成
