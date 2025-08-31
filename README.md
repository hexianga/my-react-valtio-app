# React Valtio App

一个现代化的 React 应用开发模板，集成了最新的技术栈和最佳实践。

## 🚀 技术栈

- **React 18** - 最新的 React 版本
- **TypeScript** - 类型安全的 JavaScript
- **Valtio** - 轻量级状态管理
- **React Router v6** - 路由管理
- **TailwindCSS** - 实用优先的 CSS 框架
- **Sentry** - 错误监控和性能追踪
- **Axios** - HTTP 客户端
- **ahooks** - React Hooks 库
- **Webpack 5** - 模块打包工具
- **ESLint + Prettier** - 代码规范和格式化
- **Husky + lint-staged** - Git 钩子和代码检查

## ✨ 特性

### 🎯 核心功能
- ✅ 基于 React 18 和 TypeScript
- ✅ Valtio 状态管理
- ✅ React Router v6 路由
- ✅ TailwindCSS 样式框架
- ✅ 响应式设计

### 📊 Sentry 监控
- ✅ 错误捕获和上报
- ✅ 性能监控 (FCP, CLS, INP)
- ✅ 页面 PV 统计
- ✅ API 耗时监控
- ✅ 源码映射
- ✅ 用户行为追踪

### 🛠️ 开发工具
- ✅ Webpack 5 构建配置
- ✅ ESLint + Prettier 代码规范
- ✅ Husky + lint-staged Git 钩子
- ✅ TypeScript 类型检查
- ✅ 热重载开发服务器

## 📦 安装和运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

## 🏗️ 项目结构

```
src/
├── components/     # 可复用组件
├── pages/         # 页面组件
├── store/         # Valtio 状态管理
├── hooks/         # 自定义 Hooks
├── services/      # API 服务
├── utils/         # 工具函数
├── types/         # TypeScript 类型定义
├── App.tsx        # 主应用组件
└── index.tsx      # 应用入口
```

## 🔧 配置

### Sentry 配置
在 `src/utils/sentry.ts` 中配置你的 Sentry DSN：

```typescript
const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || 'your-sentry-dsn-here';
```

### 环境变量
创建 `.env` 文件：

```env
REACT_APP_SENTRY_DSN=your-sentry-dsn
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## 📊 Sentry 功能

### 错误监控
- 自动捕获 JavaScript 错误
- React 错误边界集成
- 错误上下文和堆栈信息

### 性能监控
- First Contentful Paint (FCP)
- Cumulative Layout Shift (CLS)
- Interaction to Next Paint (INP)
- API 请求耗时统计

### 用户追踪
- 页面访问统计
- 用户行为分析
- 会话重放

## 🎨 样式系统

使用 TailwindCSS 进行样式开发：

```tsx
// 示例组件
const Button = ({ children, variant = 'primary' }) => (
  <button className={`btn btn-${variant}`}>
    {children}
  </button>
);
```

## 📝 代码规范

项目使用 ESLint 和 Prettier 进行代码规范：

- TypeScript 严格模式
- React Hooks 规则
- 自动格式化
- Git 提交前自动检查

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

构建产物将生成在 `dist/` 目录中。

### 环境配置
确保在生产环境中设置正确的环境变量：

- `REACT_APP_SENTRY_DSN` - Sentry DSN
- `REACT_APP_API_BASE_URL` - API 基础 URL

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://reactjs.org/)
- [Valtio](https://github.com/pmndrs/valtio)
- [TailwindCSS](https://tailwindcss.com/)
- [Sentry](https://sentry.io/)
- [ahooks](https://ahooks.js.org/)
