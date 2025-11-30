import React from 'react';

const ErrorState: React.FC<{ title?: string; message: string; actions?: React.ReactNode }> = ({ title = '加载失败', message, actions }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-x-4">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;

