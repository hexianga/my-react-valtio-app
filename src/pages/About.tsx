import React from 'react';
import { captureMessage, captureError } from '../utils/sentry';

/**
 * 关于页面组件
 * 展示项目信息和 Sentry 测试功能
 */
const About: React.FC = () => {
  const handleTestError = () => {
    try {
      // 测试 Sentry 错误捕获
      throw new Error('这是一个测试错误，用于验证 Sentry 错误捕获功能');
    } catch (error) {
      // 手动捕获错误
      captureError(error as Error, {
        context: '测试错误按钮点击',
        userId: 'test-user',
        timestamp: new Date().toISOString(),
      });
      console.log('错误已发送到 Sentry');
      alert('测试错误已发送到 Sentry，请检查控制台和 Sentry 面板');
    }
  };

  const handleTestMessage = () => {
    // 测试 Sentry 消息捕获
    captureMessage('用户点击了测试消息按钮', 'info');
    console.log('消息已发送到 Sentry');
    alert('消息已发送到 Sentry，请查看控制台');
  };

  const handleTestPerformance = () => {
    // 模拟性能问题
    const startTime = Date.now();
    
    // 模拟耗时操作
    setTimeout(() => {
      const duration = Date.now() - startTime;
      captureMessage(`模拟操作耗时: ${duration}ms`, 'warning');
      console.log(`性能测试完成，耗时: ${duration}ms`);
      alert(`模拟操作完成，耗时: ${duration}ms`);
    }, 2000);
  };

  const handleTestUnhandledError = () => {
    // 测试未处理的错误
    console.log('即将触发未处理的错误...');
    setTimeout(() => {
      // 这会触发 Sentry 的自动错误捕获
      throw new Error('这是一个未处理的错误，应该被 Sentry 自动捕获');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">关于项目</h1>
          <p className="text-lg text-gray-600">
            这是一个现代化的 React 应用开发模板
          </p>
        </div>

        {/* 项目信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">项目特性</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>基于 React 18 和 TypeScript</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>使用 Valtio 进行状态管理</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>TailwindCSS 样式框架</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>React Router v6 路由管理</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Sentry 错误监控和性能追踪</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Axios HTTP 客户端</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>ahooks 工具库</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">技术栈</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">前端框架:</span>
                <span>React 18.2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">类型系统:</span>
                <span>TypeScript 5.3.3</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">状态管理:</span>
                <span>Valtio 1.12.1</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">路由管理:</span>
                <span>React Router 6.20.1</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">样式框架:</span>
                <span>TailwindCSS 3.3.6</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">构建工具:</span>
                <span>Webpack 5.89.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">错误监控:</span>
                <span>Sentry 7.80.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sentry 测试区域 */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-4">Sentry 功能测试</h3>
          <p className="text-gray-600 mb-6">
            点击下面的按钮来测试 Sentry 的各种功能。这些操作会向 Sentry 发送数据，
            您可以在 Sentry 控制台中查看结果。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleTestMessage}
              className="btn btn-primary"
            >
              测试消息捕获
            </button>
            
            <button
              onClick={handleTestPerformance}
              className="btn btn-secondary"
            >
              测试性能监控
            </button>
            
            <button
              onClick={handleTestError}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              测试错误捕获
            </button>
            
            <button
              onClick={handleTestUnhandledError}
              className="btn bg-orange-600 hover:bg-orange-700 text-white"
            >
              测试未处理错误
            </button>
          </div>
        </div>

        {/* 开发指南 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">开发指南</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">启动开发服务器</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  npm run dev
                </code>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">构建生产版本</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  npm run build
                </code>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">代码检查</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  npm run lint
                </code>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">代码格式化</h4>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  npm run format
                </code>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">项目结构</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-mono text-xs">src/</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="font-mono text-xs">├── components/</span>
                <span className="ml-2">组件目录</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="font-mono text-xs">├── pages/</span>
                <span className="ml-2">页面组件</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="font-mono text-xs">├── store/</span>
                <span className="ml-2">状态管理</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="font-mono text-xs">├── hooks/</span>
                <span className="ml-2">自定义 Hooks</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="font-mono text-xs">├── services/</span>
                <span className="ml-2">API 服务</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="font-mono text-xs">├── utils/</span>
                <span className="ml-2">工具函数</span>
              </div>
              <div className="flex items-center ml-4">
                <span className="font-mono text-xs">└── types/</span>
                <span className="ml-2">类型定义</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
