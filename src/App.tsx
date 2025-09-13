import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import FormPage from './pages/FormPage';
import WebVitalsDisplay from './components/WebVitalsDisplay';

/**
 * 错误边界组件
 * 用于捕获 React 组件中的错误
 */
const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: ({ error, componentStack, resetError }) => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              页面出错了!
            </h2>
            <p className="text-gray-600 mb-6">
              抱歉，页面遇到了一个错误。我们已经记录了这个错误，并将尽快修复。
            </p>
            <div className="space-y-4">
              <button onClick={resetError} className="btn btn-primary w-full">
                重试
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="btn btn-secondary w-full"
              >
                返回首页
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  错误详情 (开发模式)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto">
                  <div className="mb-2">
                    <strong>错误信息:</strong>
                    <div className="mt-1">{error?.message}</div>
                  </div>
                  <div>
                    <strong>组件栈:</strong>
                    <div className="mt-1 whitespace-pre-wrap">
                      {componentStack}
                    </div>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    ),
  }
);

/**
 * 主应用组件
 * 配置路由和全局布局
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/form" element={<FormPage />} />
            {/* 404 页面 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">404</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      页面未找到
                    </h2>
                    <p className="text-gray-600 mb-6">
                      抱歉，您访问的页面不存在。
                    </p>
                    <a href="/" className="btn btn-primary">
                      返回首页
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Layout>
      </Router>
      
      {/* Web Vitals 性能监控显示组件 (仅开发环境) */}
      <WebVitalsDisplay position="bottom-right" />
    </ErrorBoundary>
  );
};

export default App;
