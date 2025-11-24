import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 导入 Sentry、状态管理和性能监控
import { initSentry } from './utils/sentry';
import { initializeAppState, setupStateSubscriptions } from './store';
import { validateEnvConfig, logEnvConfig } from './utils/envConfig';
import {
  initWebVitals,
  getPerformanceSummary,
  getPerformanceAdvice,
} from './utils/webVitals';
import {
  initPerformanceObserver,
  getPerformanceEntriesSummary,
} from './utils/performanceObserver';

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

  // 🎯 初始化 Web Vitals 性能监控
  initWebVitals({
    enableConsoleLog: process.env.NODE_ENV === 'development',
    enableSentryReport: true,
    enableAnalytics: process.env.NODE_ENV === 'production',
  });

  // 🔍 初始化 PerformanceObserver 监控所有 entrytype
  initPerformanceObserver({
    enableConsoleLog: process.env.NODE_ENV === 'development',
    enableSentryReport: true,
    enableDetailedLogging: process.env.NODE_ENV === 'development',
    // 可以根据需要过滤特定类型
    // filterByType: ['navigation', 'resource', 'paint'],
    // excludeTypes: ['resource'], // 排除资源加载日志（可能很多）
  });

  console.log('🚀 React Valtio App 初始化完成');
  console.log('📊 Sentry 监控已启用');
  console.log('🎨 TailwindCSS 样式已加载');
  console.log('⚡ Valtio 状态管理已配置');
  console.log('📊 Web Vitals 性能监控已启用');
  console.log('🔍 PerformanceObserver 全类型监控已启用');
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

// 📊 页面加载完成后显示性能摘要
window.addEventListener('load', () => {
  // 延迟执行，确保所有指标都已采集
  setTimeout(() => {
    getPerformanceSummary();
    getPerformanceEntriesSummary();

    // 开发环境显示优化建议
    if (process.env.NODE_ENV === 'development') {
      getPerformanceAdvice();
    }
  }, 1000);
});
