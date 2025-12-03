import React from 'react';

const RemoteHello: React.FC<{ who?: string }> = ({ who = 'Module Federation' }) => {
  return (
    <div className="p-4 border rounded-lg bg-green-50 border-green-200">
      <div className="text-sm text-green-700">来自远程模块</div>
      <h3 className="text-xl font-bold text-green-800 mt-2">Hello, {who}! 👋</h3>
      <p className="text-sm text-green-700 mt-1">
        该组件通过 Module Federation 暴露，宿主应用以远程方式动态加载。
      </p>
    </div>
  );
};

export default RemoteHello;

