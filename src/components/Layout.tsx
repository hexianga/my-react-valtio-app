import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppState } from '../hooks';
import { actions } from '../store';

/**
 * 布局组件
 * 采用左侧侧边栏 + 右侧内容的布局
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, user, isAuthenticated } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 导航菜单项
  const menuItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/about', label: '关于', icon: 'ℹ️' },
    { path: '/form', label: '表单示例', icon: '📝' },
    { path: '/json-diff', label: 'JSON Diff', icon: '🔍' },
    { path: '/jsdiff', label: 'JSDiff Pro', icon: '⚡' },
    { path: '/performance', label: '性能监控', icon: '📊' },
    { path: '/type-error', label: 'TypeError 演示', icon: '⚠️' },
    { path: '/json-parser', label: 'JSON 解析工具', icon: '🛠️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部 Header - 简化版 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex justify-between items-center">
          {/* 左侧：菜单切换按钮 + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="切换侧边栏"
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">
                React App
              </span>
            </Link>
          </div>

          {/* 右侧：主题切换 + 用户信息 */}
          <div className="flex items-center space-x-4">
            {/* 主题切换 */}
            <button
              onClick={actions.toggleTheme}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="切换主题"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* 用户信息 */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user?.username}
                  </span>
                  <button
                    onClick={actions.clearUser}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    actions.setUser({
                      id: '1',
                      username: 'demo_user',
                      email: 'demo@example.com',
                    });
                  }}
                  className="btn btn-primary text-sm"
                >
                  登录
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主容器 - 左右布局 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧侧边栏 */}
        <aside
          className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 overflow-y-auto ${
            sidebarOpen ? 'w-64' : 'w-0'
          }`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // 在移动设备上点击菜单后关闭侧边栏
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* 右侧主要内容区域 */}
        <main className="flex-1 overflow-y-auto px-4">{children}</main>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm">
              © 2024 React Valtio App. Built with ❤️ using modern web
              technologies.
            </p>
            <p className="text-xs">
              React 18 • TypeScript • Valtio • TailwindCSS • Sentry
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
