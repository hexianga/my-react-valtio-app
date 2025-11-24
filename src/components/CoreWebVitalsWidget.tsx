import React, { useState, useEffect } from 'react';
import {
  subscribeToCoreWebVitals,
  formatVitalValue,
  getVitalRating,
  type CoreWebVitals,
} from '../utils/performanceObserver';

/**
 * Core Web Vitals 小部件
 * 显示关键性能指标的简化版本
 */
const CoreWebVitalsWidget: React.FC = () => {
  const [vitals, setVitals] = useState<CoreWebVitals>({});

  useEffect(() => {
    // 订阅性能指标更新
    const unsubscribe = subscribeToCoreWebVitals(newVitals => {
      setVitals(newVitals);
    });

    return unsubscribe;
  }, []);

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

  // 主要性能指标
  const mainVitals = [
    {
      key: 'FCP' as keyof CoreWebVitals,
      name: 'FCP',
      icon: '🎨',
      unit: 'ms' as const,
    },
    {
      key: 'LCP' as keyof CoreWebVitals,
      name: 'LCP',
      icon: '🖼️',
      unit: 'ms' as const,
    },
    {
      key: 'TTFB' as keyof CoreWebVitals,
      name: 'TTFB',
      icon: '⚡',
      unit: 'ms' as const,
    },
  ];

  const hasData = Object.values(vitals).some(v => v !== undefined);

  if (!hasData) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="animate-spin text-2xl">⏳</div>
          <div>
            <h3 className="font-semibold text-blue-900">性能监控中</h3>
            <p className="text-sm text-blue-600">
              正在收集 Core Web Vitals 数据...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
          <span>📊</span>
          <span>Core Web Vitals</span>
        </h3>
        <a
          href="/performance"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          查看详情 →
        </a>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {mainVitals.map(({ key, name, icon, unit }) => {
          const value = vitals[key];
          const rating = getVitalRating(key, value);
          const formattedValue = formatVitalValue(value, unit);
          const ratingIcon = getRatingIcon(rating);

          return (
            <div
              key={key}
              className="text-center p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-lg">{icon}</span>
                <span className="text-xs font-medium text-gray-600">
                  {name}
                </span>
                <span className="text-sm">{ratingIcon}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {formattedValue}
              </div>
            </div>
          );
        })}
      </div>

      {/* 快速状态指示 */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">性能状态:</span>
          <div className="flex items-center space-x-2">
            {mainVitals.map(({ key }) => {
              const value = vitals[key];
              const rating = getVitalRating(key, value);
              const icon = getRatingIcon(rating);
              return <span key={key}>{icon}</span>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreWebVitalsWidget;
