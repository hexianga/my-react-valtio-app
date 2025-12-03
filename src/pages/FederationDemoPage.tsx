import React, { Suspense } from 'react';

// 通过 Module Federation 从自身远程容器加载组件
// 在 webpack 配置中已声明 remotes: { myApp: 'myApp@.../remoteEntry.js' }
// 这里以 lazy 方式动态加载远程暴露的组件
const RemoteHello = React.lazy(() => import('myApp/RemoteHello' as any));
const RemoteButton = React.lazy(() => import('remoteApp/Button' as any));

const FederationDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Module Federation 示例</h1>
          <p className="text-gray-600 mt-2">
            该示例演示了在同一个应用中暴露远程组件，并通过 Module Federation 动态加载与渲染。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">远程组件渲染</h2>
          <Suspense fallback={<div className="text-gray-500">正在加载远程组件...</div>}>
            <RemoteHello who="from Host" />
          </Suspense>
          <div className="mt-6">
            <Suspense fallback={<div className="text-gray-500">正在加载 RemoteApp/Button...</div>}>
              <RemoteButton label="RemoteApp Button" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FederationDemoPage;
