import React, { useState, useEffect } from 'react';
import {
  subscribeToCoreWebVitals,
  formatVitalValue,
  getVitalRating,
  type CoreWebVitals,
} from '../utils/performanceObserver';

/**
 * Core Web Vitals 显示组件
 * 实时显示关键性能指标
 */
const CoreWebVitalsDisplay: React.FC = () => {
  const [vitals, setVitals] = useState<CoreWebVitals>({});

  useEffect(() => {
    // 订阅性能指标更新
    const unsubscribe = subscribeToCoreWebVitals(newVitals => {
      setVitals(newVitals);
    });

    return unsubscribe;
  }, []);

  // 获取评级对应的样式
  const getRatingStyle = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  // 获取评级图标
  const getRatingIcon = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return '🟢';
      case 'needs-improvement':
        return '🟡';
      case 'poor':
        return '🔴';
    }
  };

  // 性能指标配置
  const vitalConfigs = [
    {
      key: 'FCP' as keyof CoreWebVitals,
      name: 'First Contentful Paint',
      description: '首次内容绘制',
      icon: '🎨',
      unit: 'ms' as const,
    },
    {
      key: 'LCP' as keyof CoreWebVitals,
      name: 'Largest Contentful Paint',
      description: '最大内容绘制',
      icon: '🖼️',
      unit: 'ms' as const,
    },
    {
      key: 'FID' as keyof CoreWebVitals,
      name: 'First Input Delay',
      description: '首次输入延迟',
      icon: '👆',
      unit: 'ms' as const,
    },
    {
      key: 'CLS' as keyof CoreWebVitals,
      name: 'Cumulative Layout Shift',
      description: '累积布局偏移',
      icon: '📐',
      unit: 'score' as const,
    },
    {
      key: 'TTFB' as keyof CoreWebVitals,
      name: 'Time to First Byte',
      description: '首字节时间',
      icon: '⚡',
      unit: 'ms' as const,
    },
    {
      key: 'FP' as keyof CoreWebVitals,
      name: 'First Paint',
      description: '首次绘制',
      icon: '🎯',
      unit: 'ms' as const,
    },
    {
      key: 'TTI' as keyof CoreWebVitals,
      name: 'Time to Interactive',
      description: '可交互时间',
      icon: '🔄',
      unit: 'ms' as const,
    },
    {
      key: 'TBT' as keyof CoreWebVitals,
      name: 'Total Blocking Time',
      description: '总阻塞时间',
      icon: '⏸️',
      unit: 'ms' as const,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          📊 Core Web Vitals
        </h2>
        <div className="text-sm text-gray-500">实时性能指标</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitalConfigs.map(({ key, description, icon, unit }) => {
          const value = vitals[key];
          const rating = getVitalRating(key, value);
          const formattedValue = formatVitalValue(value, unit);
          const ratingStyle = getRatingStyle(rating);
          const ratingIcon = getRatingIcon(rating);

          return (
            <div
              key={key}
              className={`border rounded-lg p-4 transition-all duration-300 ${ratingStyle}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-medium text-sm">{key}</span>
                </div>
                <span className="text-lg">{ratingIcon}</span>
              </div>

              <div className="mb-2">
                <div className="text-2xl font-bold">{formattedValue}</div>
                <div className="text-xs opacity-75">{description}</div>
              </div>

              <div className="text-xs font-medium capitalize">
                {rating.replace('-', ' ')}
              </div>

              {/* 性能阈值提示 */}
              <div className="mt-2 text-xs opacity-60">
                {key === 'FCP' && '良好: ≤1.8s, 需改进: 1.8-3s'}
                {key === 'LCP' && '良好: ≤2.5s, 需改进: 2.5-4s'}
                {key === 'FID' && '良好: ≤100ms, 需改进: 100-300ms'}
                {key === 'CLS' && '良好: ≤0.1, 需改进: 0.1-0.25'}
                {key === 'TTFB' && '良好: ≤800ms, 需改进: 800-1.8s'}
                {key === 'FP' && '良好: ≤1s, 需改进: 1-2s'}
                {key === 'TTI' && '良好: ≤3.8s, 需改进: 3.8-7.3s'}
                {key === 'TBT' && '良好: ≤200ms, 需改进: 200-600ms'}
              </div>
            </div>
          );
        })}
      </div>

      {/* 总体评分 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          📈 性能评分概览
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-800">
              {
                vitalConfigs.filter(
                  ({ key }) => getVitalRating(key, vitals[key]) === 'good'
                ).length
              }
            </div>
            <div className="text-sm text-green-600">🟢 良好</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-800">
              {
                vitalConfigs.filter(
                  ({ key }) =>
                    getVitalRating(key, vitals[key]) === 'needs-improvement'
                ).length
              }
            </div>
            <div className="text-sm text-yellow-600">🟡 需改进</div>
          </div>
          <div className="bg-red-100 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-800">
              {
                vitalConfigs.filter(
                  ({ key }) => getVitalRating(key, vitals[key]) === 'poor'
                ).length
              }
            </div>
            <div className="text-sm text-red-600">🔴 较差</div>
          </div>
        </div>
      </div>

      {/* 性能建议 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 性能优化建议
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          {vitals.FCP && vitals.FCP > 1800 && (
            <div>• 优化 FCP：减少关键资源大小，使用服务端渲染</div>
          )}
          {vitals.LCP && vitals.LCP > 2500 && (
            <div>• 优化 LCP：优化图片加载，使用 CDN 加速</div>
          )}
          {vitals.FID && vitals.FID > 100 && (
            <div>• 优化 FID：减少 JavaScript 执行时间，使用 Web Workers</div>
          )}
          {vitals.CLS && vitals.CLS > 0.1 && (
            <div>• 优化 CLS：为图片和广告设置尺寸，避免动态内容插入</div>
          )}
          {vitals.TTFB && vitals.TTFB > 800 && (
            <div>• 优化 TTFB：优化服务器响应时间，使用缓存</div>
          )}
          {vitals.TTI && vitals.TTI > 3800 && (
            <div>• 优化 TTI：减少主线程工作，延迟非关键 JavaScript</div>
          )}
          {vitals.TBT && vitals.TBT > 200 && (
            <div>• 优化 TBT：拆分长任务，使用 requestIdleCallback</div>
          )}
          {Object.values(vitals).every(v => v === undefined) && (
            <div className="text-gray-600">🔄 正在收集性能数据，请稍候...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoreWebVitalsDisplay;
