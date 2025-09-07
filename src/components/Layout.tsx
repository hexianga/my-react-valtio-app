import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppState } from '../hooks';
import { actions } from '../store';

/**
 * 布局组件
 * 包含导航栏和主要内容区域
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, user, isAuthenticated } = useAppState();

  // 导航菜单项
  const menuItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/about', label: '关于', icon: 'ℹ️' },
    { path: '/form', label: '表单示例', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold text-gray-900">
                  React App
                </span>
              </Link>
            </div>

            {/* 导航菜单 */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* 右侧操作区 */}
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
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="flex-1">{children}</main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © 2024 React Valtio App. Built with ❤️ using modern web
              technologies.
            </p>
            <p className="text-sm">
              React 18 • TypeScript • Valtio • TailwindCSS • Sentry
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
