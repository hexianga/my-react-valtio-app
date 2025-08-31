import React from 'react';
import { useAppState } from '../hooks';
import { actions } from '../store';

/**
 * 首页组件
 * 展示应用基本功能和状态管理示例
 */
const Home: React.FC = () => {
  const { count, theme, user, isAuthenticated } = useAppState();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React + Valtio + TypeScript
          </h1>
          <p className="text-lg text-gray-600">
            现代化的 React 应用开发模板
          </p>
        </div>

        {/* 功能卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 状态管理示例 */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">状态管理 (Valtio)</h3>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-primary-600">{count}</span>
                <p className="text-gray-600">计数器</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={actions.increment}
                  className="btn btn-primary flex-1"
                >
                  增加
                </button>
                <button
                  onClick={actions.decrement}
                  className="btn btn-secondary flex-1"
                >
                  减少
                </button>
              </div>
              <button
                onClick={actions.reset}
                className="btn btn-secondary w-full"
              >
                重置
              </button>
            </div>
          </div>

          {/* 主题切换 */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">主题切换</h3>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-lg font-medium capitalize">{theme}</span>
                <p className="text-gray-600">当前主题</p>
              </div>
              <button
                onClick={actions.toggleTheme}
                className="btn btn-primary w-full"
              >
                切换主题
              </button>
            </div>
          </div>

          {/* 用户状态 */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">用户状态</h3>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-lg font-medium">
                  {isAuthenticated ? '已登录' : '未登录'}
                </span>
                <p className="text-gray-600">认证状态</p>
              </div>
              {user && (
                <div className="text-sm text-gray-600">
                  <p>用户名: {user.username}</p>
                  <p>邮箱: {user.email}</p>
                </div>
              )}
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    actions.clearUser();
                  } else {
                    actions.setUser({
                      id: '1',
                      username: 'demo_user',
                      email: 'demo@example.com',
                    });
                  }
                }}
                className="btn btn-primary w-full"
              >
                {isAuthenticated ? '退出登录' : '模拟登录'}
              </button>
            </div>
          </div>
        </div>

        {/* 技术栈展示 */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">技术栈</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'React 18',
              'TypeScript',
              'Valtio',
              'TailwindCSS',
              'React Router',
              'Sentry',
              'Axios',
              'ahooks',
            ].map((tech) => (
              <div
                key={tech}
                className="bg-gray-100 rounded-lg p-3 text-center"
              >
                <span className="text-sm font-medium text-gray-700">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 功能特性 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">已集成功能</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✅ 状态管理 (Valtio)</li>
              <li>✅ 路由管理 (React Router v6)</li>
              <li>✅ 类型安全 (TypeScript)</li>
              <li>✅ 样式框架 (TailwindCSS)</li>
              <li>✅ 错误监控 (Sentry)</li>
              <li>✅ HTTP 客户端 (Axios)</li>
              <li>✅ 工具库 (ahooks)</li>
              <li>✅ 代码规范 (ESLint + Prettier)</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Sentry 监控</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✅ 错误捕获和上报</li>
              <li>✅ 性能监控 (FCP, CLS, INP)</li>
              <li>✅ 页面 PV 统计</li>
              <li>✅ API 耗时监控</li>
              <li>✅ 源码映射</li>
              <li>✅ 用户行为追踪</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
