# 环境配置文件使用说明

## 📁 环境配置文件结构

```
.env.development    # 开发环境配置
.env.test          # 测试环境配置  
.env.production    # 生产环境配置
.env.local         # 本地配置（不提交到版本控制）
.env               # 默认配置（备用）
```

## 🔧 加载优先级

环境变量按以下优先级加载（后加载的会覆盖先加载的）：

1. `.env` - 默认配置
2. `.env.local` - 本地配置
3. `.env.[environment]` - 环境特定配置

## 🎯 使用方式

### 开发环境
```bash
pnpm run dev          # 启动开发服务器
pnpm run build:dev    # 开发环境构建
```

### 测试环境
```bash
pnpm run build:test   # 测试环境构建
```

### 生产环境
```bash
pnpm run build        # 生产环境构建（默认）
pnpm run build:prod   # 生产环境构建（显式）
```

## 📋 环境变量说明

### 核心配置
- `NODE_ENV` - 运行环境（development/test/production）
- `REACT_APP_VERSION` - 应用版本号
- `REACT_APP_API_BASE_URL` - API 基础地址
- `REACT_APP_API_TIMEOUT` - API 请求超时时间

### Sentry 配置
- `REACT_APP_SENTRY_DSN` - Sentry 项目 DSN
- `REACT_APP_SENTRY_ENVIRONMENT` - Sentry 环境标识

### 开发工具配置
- `REACT_APP_DEBUG` - 是否启用调试模式
- `REACT_APP_LOG_LEVEL` - 日志级别
- `REACT_APP_ENABLE_DEVTOOLS` - 是否启用开发工具

### 构建配置
- `GENERATE_SOURCEMAP` - 是否生成 Source Map
- `CDN_URL` - CDN 地址（生产环境）

### 功能开关
- `REACT_APP_USE_MOCK` - 是否使用模拟数据
- `REACT_APP_ENABLE_ANALYTICS` - 是否启用分析统计
- `REACT_APP_PERFORMANCE_TRACKING` - 是否启用性能追踪

## 🔒 安全注意事项

1. **不要提交敏感信息**：
   - API 密钥、访问令牌等敏感信息应放在 `.env.local` 中
   - `.env.local` 文件不会被提交到版本控制

2. **环境变量前缀**：
   - 只有以 `REACT_APP_` 开头的变量才会被打包到客户端代码中
   - 其他变量仅在构建时可用

3. **生产环境配置**：
   - 生产环境应禁用调试功能
   - 建议禁用 Source Map 以保护源码

## 💡 最佳实践

1. **环境隔离**：
   - 每个环境使用独立的配置文件
   - 避免在不同环境间共享敏感配置

2. **配置验证**：
   - 在应用启动时验证必需的环境变量
   - 为缺失的配置提供合理的默认值

3. **文档维护**：
   - 及时更新环境变量说明文档
   - 记录配置变更的影响和原因

## 🚀 部署配置

### Vercel 部署
在 Vercel 项目设置中配置生产环境变量：
```
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_SENTRY_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### Docker 部署
在 Dockerfile 中设置环境变量：
```dockerfile
ENV NODE_ENV=production
ENV REACT_APP_API_BASE_URL=https://api.example.com
```

### CI/CD 配置
在 GitHub Actions 中设置环境变量：
```yaml
env:
  NODE_ENV: production
  REACT_APP_API_BASE_URL: ${{ secrets.API_BASE_URL }}
```