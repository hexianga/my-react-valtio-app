/**
 * Web Vitals 性能指标显示组件
 * 仅在开发环境显示，用于实时监控页面性能
 */

import { useState, useEffect, useCallback, type FC } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface MetricData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsDisplayProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  minimized?: boolean;
}

export const WebVitalsDisplay: FC<WebVitalsDisplayProps> = ({ 
  position = 'bottom-right',
  minimized = false 
}) => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [isVisible, setIsVisible] = useState(false);

  // 获取评级
  const getRating = (name: string, value: number) => {
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
        return 'good';
    }
  };

  // 格式化值
  const formatValue = (name: string, value: number) => {
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

  // 更新指标
  const updateMetric = useCallback((name: string, value: number) => {
    const rating = getRating(name, value);
    const newMetric: MetricData = {
      name,
      value,
      rating,
      timestamp: Date.now()
    };

    setMetrics(prev => {
      const filtered = prev.filter(m => m.name !== name);
      return [...filtered, newMetric].sort((a, b) => {
        const order = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
    });
  }, []);

  // 初始化监控
  useEffect(() => {
    // 只在开发环境显示
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    setIsVisible(true);

    onCLS((metric) => updateMetric('CLS', metric.value));
    onINP((metric) => updateMetric('INP', metric.value));
    onFCP((metric) => updateMetric('FCP', metric.value));
    onLCP((metric) => updateMetric('LCP', metric.value));
    onTTFB((metric) => updateMetric('TTFB', metric.value));
  }, [updateMetric]);

  // 生产环境不显示
  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  // 位置样式
  const getPositionStyle = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace',
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: '10px', left: '10px' };
      case 'top-right':
        return { ...base, top: '10px', right: '10px' };
      case 'bottom-left':
        return { ...base, bottom: '10px', left: '10px' };
      case 'bottom-right':
        return { ...base, bottom: '10px', right: '10px' };
      default:
        return { ...base, bottom: '10px', right: '10px' };
    }
  };

  // 评级颜色
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return '#22c55e';
      case 'needs-improvement':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // 评级图标
  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return '🟢';
      case 'needs-improvement':
        return '🟡';
      case 'poor':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div style={getPositionStyle()}>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: isMinimized ? '4px 8px' : '8px 12px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          minWidth: isMinimized ? 'auto' : '200px',
          transition: 'all 0.3s ease',
        }}
      >
        {/* 头部 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isMinimized ? 0 : '8px',
            cursor: 'pointer',
          }}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <span style={{ fontWeight: 'bold' }}>
            {isMinimized ? '📊' : '📊 Web Vitals'}
          </span>
          <span style={{ opacity: 0.7, fontSize: '10px' }}>
            {isMinimized ? '' : '(点击收缩)'}
          </span>
        </div>

        {/* 指标列表 */}
        {!isMinimized && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {metrics.length === 0 && (
              <div style={{ opacity: 0.7, textAlign: 'center', padding: '8px 0' }}>
                正在收集指标...
              </div>
            )}
            
            {metrics.map((metric) => (
              <div
                key={metric.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '2px 4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '3px',
                  border: `1px solid ${getRatingColor(metric.rating)}`,
                }}
              >
                <span style={{ fontWeight: '500' }}>
                  {getRatingIcon(metric.rating)} {metric.name}
                </span>
                <span
                  style={{
                    color: getRatingColor(metric.rating),
                    fontWeight: 'bold',
                  }}
                >
                  {formatValue(metric.name, metric.value)}
                </span>
              </div>
            ))}

            {/* 操作按钮 */}
            {metrics.length > 0 && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '4px 0',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.table(metrics);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#60a5fa',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    marginRight: '4px',
                  }}
                >
                  📋 查看详情
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMetrics([]);
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️ 清空
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebVitalsDisplay;