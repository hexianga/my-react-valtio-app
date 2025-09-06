import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 导入 Sentry 和状态管理
import { initSentry } from './utils/sentry';
import { initializeAppState, setupStateSubscriptions } from './store';
import { validateEnvConfig, logEnvConfig } from './utils/envConfig';

/**
 * 初始化应用
 * 设置 Sentry、状态管理等
 */
const initializeApp = () => {
  // 🔧 验证环境配置
  if (!validateEnvConfig()) {
    throw new Error('环境配置验证失败，请检查环境变量设置');
  }
  
  // 📋 打印环境配置（仅开发环境）
  logEnvConfig();
  
  // 初始化 Sentry
  initSentry();
  
  // 初始化应用状态
  initializeAppState();
  
  // 设置状态订阅
  setupStateSubscriptions();
  
  console.log('🚀 React Valtio App 初始化完成');
  console.log('📊 Sentry 监控已启用');
  console.log('🎨 TailwindCSS 样式已加载');
  console.log('⚡ Valtio 状态管理已配置');
};

// 初始化应用
initializeApp();

// 获取根元素
const container = document.getElementById('root');

if (!container) {
  throw new Error('找不到根元素 #root');
}

// 创建 React 根
const root = createRoot(container);

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
