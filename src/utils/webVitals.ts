/**
 * Web Vitals 性能监控工具
 * 
 * 监控核心Web性能指标：
 * - CLS (Cumulative Layout Shift) - 累积布局偏移
 * - INP (Interaction to Next Paint) - 交互到下次绘制  
 * - FCP (First Contentful Paint) - 首次内容绘制
 * - LCP (Largest Contentful Paint) - 最大内容绘制
 * - TTFB (Time to First Byte) - 首字节时间
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import * as Sentry from '@sentry/react';

/**
 * 性能指标类型定义
 */
interface WebVitalsConfig {
  enableConsoleLog?: boolean;
  enableSentryReport?: boolean;
  enableAnalytics?: boolean;
  thresholds?: {
    CLS: number;
    INP: number;
    FCP: number;
    LCP: number;
    TTFB: number;
  };
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Required<WebVitalsConfig> = {
  enableConsoleLog: true,
  enableSentryReport: true,
  enableAnalytics: false,
  thresholds: {
    CLS: 0.1,   // 好: ≤0.1, 需要改进: 0.1-0.25, 差: >0.25
    INP: 200,   // 好: ≤200ms, 需要改进: 200-500ms, 差: >500ms
    FCP: 1800,  // 好: ≤1.8s, 需要改进: 1.8-3s, 差: >3s
    LCP: 2500,  // 好: ≤2.5s, 需要改进: 2.5-4s, 差: >4s
    TTFB: 800,  // 好: ≤800ms, 需要改进: 800-1800ms, 差: >1800ms
  },
};

/**
 * 性能评级
 */
type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

/**
 * 获取性能评级
 */
const getPerformanceRating = (name: string, value: number, thresholds: typeof DEFAULT_CONFIG.thresholds): PerformanceRating => {
  const threshold = thresholds[name as keyof typeof thresholds];
  
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return value <= threshold ? 'good' : 'needs-improvement';
  }
};

/**
 * 格式化指标值
 */
const formatMetricValue = (name: string, value: number): string => {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'INP':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      return `${Math.round(value)}ms`;
    default:
      return value.toString();
  }
};

/**
 * 获取评级对应的颜色和图标
 */
const getRatingStyle = (rating: PerformanceRating) => {
  switch (rating) {
    case 'good':
      return { color: '🟢', bgColor: '#d4edda', textColor: '#155724' };
    case 'needs-improvement':
      return { color: '🟡', bgColor: '#fff3cd', textColor: '#856404' };
    case 'poor':
      return { color: '🔴', bgColor: '#f8d7da', textColor: '#721c24' };
  }
};

/**
 * 性能指标处理器
 */
const handleMetric = (metric: Metric, config: Required<WebVitalsConfig>) => {
  const { name, value, delta, id, navigationType } = metric;
  const rating = getPerformanceRating(name, value, config.thresholds);
  const formattedValue = formatMetricValue(name, value);
  const { color, bgColor, textColor } = getRatingStyle(rating);

  // 控制台输出
  if (config.enableConsoleLog) {
    const style = `
      background: ${bgColor}; 
      color: ${textColor}; 
      padding: 2px 8px; 
      border-radius: 4px; 
      font-weight: bold;
    `;
    
    console.group(`${color} Web Vitals - ${name}`);
    console.log(`%c${name}: ${formattedValue} (${rating})`, style);
    console.log('📊 详细信息:', {
      value,
      delta,
      id,
      rating,
      navigationType,
      timestamp: new Date().toISOString(),
    });
    console.groupEnd();
  }

  // Sentry 报告
  if (config.enableSentryReport) {
    // 添加性能标签
    Sentry.setTag(`webvitals.${name.toLowerCase()}`, rating);
    
    // 记录性能指标
    Sentry.setMeasurement(name, value, 'millisecond');
    
    // 如果性能较差，记录为事件
    if (rating === 'poor') {
      Sentry.captureMessage(`Poor Web Vitals: ${name}`, {
        level: 'warning',
        tags: {
          webVitals: true,
          metric: name,
          rating: 'poor',
        },
        extra: {
          value,
          formattedValue,
          delta,
          id,
          navigationType,
          threshold: config.thresholds[name as keyof typeof config.thresholds],
        },
      });
    }
  }

  // 自定义分析上报（可扩展）
  if (config.enableAnalytics) {
    // 这里可以集成 Google Analytics、百度统计等
    if ((window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        custom_parameter_rating: rating,
      });
    }
  }
};

/**
 * 初始化 Web Vitals 监控
 */
export const initWebVitals = (userConfig: WebVitalsConfig = {}) => {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  
  try {
    // 监控各项指标
    onCLS((metric) => handleMetric(metric, config));
    onINP((metric) => handleMetric(metric, config));
    onFCP((metric) => handleMetric(metric, config));
    onLCP((metric) => handleMetric(metric, config));
    onTTFB((metric) => handleMetric(metric, config));

    console.log('🚀 Web Vitals 监控已启动');
    console.log('📊 监控指标:', ['CLS', 'INP', 'FCP', 'LCP', 'TTFB']);
    
  } catch (error) {
    console.error('❌ Web Vitals 初始化失败:', error);
    
    if (config.enableSentryReport) {
      Sentry.captureException(error, {
        tags: { component: 'webVitals' }
      });
    }
  }
};

/**
 * 手动触发性能报告
 */
export const reportWebVitals = () => {
  // 触发所有待处理的指标
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      console.log('📊 手动触发 Web Vitals 报告');
    });
  }
};

/**
 * 获取页面性能摘要
 */
export const getPerformanceSummary = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) {
    console.warn('⚠️ 无法获取导航计时信息');
    return null;
  }

  const summary = {
    // 网络相关
    dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
    tcp: Math.round(navigation.connectEnd - navigation.connectStart),
    ttfb: Math.round(navigation.responseStart - navigation.requestStart),
    
    // 文档处理
    domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
    loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
    
    // 渲染相关
    domInteractive: Math.round(navigation.domInteractive - navigation.fetchStart),
    
    // 资源加载
    resources: performance.getEntriesByType('resource').length,
  };

  console.group('📈 页面性能摘要');
  console.log('🌐 DNS查询:', `${summary.dns}ms`);
  console.log('🔗 TCP连接:', `${summary.tcp}ms`);
  console.log('⏱️ TTFB:', `${summary.ttfb}ms`);
  console.log('📄 DOM就绪:', `${summary.domContentLoaded}ms`);
  console.log('✅ 页面加载:', `${summary.loadComplete}ms`);
  console.log('🎨 DOM交互:', `${summary.domInteractive}ms`);
  console.log('📦 资源数量:', summary.resources);
  console.groupEnd();

  return summary;
};

/**
 * 性能优化建议
 */
export const getPerformanceAdvice = () => {
  const advice = [
    '💡 优化建议:',
    '1. 🖼️ 优化图片: 使用 WebP 格式，添加 loading="lazy"',
    '2. 📦 代码分割: 使用动态 import() 和 React.lazy()',
    '3. 🗜️ 资源压缩: 启用 Gzip/Brotli 压缩',
    '4. 🚀 CDN加速: 使用 CDN 分发静态资源',
    '5. 📱 预加载: 使用 <link rel="preload"> 预加载关键资源',
    '6. 🎨 CSS优化: 内联关键CSS，异步加载非关键CSS',
    '7. 🔄 缓存策略: 设置合理的缓存头',
    '8. 📊 监控: 持续监控 Core Web Vitals 指标',
  ];
  
  console.group('💡 性能优化建议');
  advice.forEach(tip => console.log(tip));
  console.groupEnd();
};

// 导出类型定义
export type { WebVitalsConfig, PerformanceRating };