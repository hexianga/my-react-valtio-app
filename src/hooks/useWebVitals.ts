/**
 * Web Vitals React Hook
 * 提供在 React 组件中监控性能指标的能力
 */

import { useEffect, useState, useCallback } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

interface UseWebVitalsOptions {
  /**
   * 是否启用监控
   * @default true
   */
  enabled?: boolean;
  
  /**
   * 性能阈值配置
   */
  thresholds?: {
    CLS: number;
    FID: number;
    FCP: number;
    LCP: number;
    TTFB: number;
  };
  
  /**
   * 指标更新回调
   */
  onMetric?: (metric: WebVitalsMetric) => void;
}

const DEFAULT_THRESHOLDS = {
  CLS: 0.1,
  INP: 200,
  FCP: 1800,
  LCP: 2500,
  TTFB: 800,
};

/**
 * 获取性能评级
 */
const getPerformanceRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
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

/**
 * Web Vitals Hook
 */
export const useWebVitals = (options: UseWebVitalsOptions = {}) => {
  const {
    enabled = true,
    thresholds: _thresholds = DEFAULT_THRESHOLDS,
    onMetric,
  } = options;

  const [metrics, setMetrics] = useState<Map<string, WebVitalsMetric>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 处理指标更新
  const handleMetric = useCallback((metric: Metric) => {
    try {
      const webVitalsMetric: WebVitalsMetric = {
        name: metric.name,
        value: metric.value,
        rating: getPerformanceRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
      };

      setMetrics(prev => new Map(prev.set(metric.name, webVitalsMetric)));
      
      // 调用回调函数
      onMetric?.(webVitalsMetric);
      
    } catch (err) {
      setError(err as Error);
    }
  }, [onMetric]);

  // 初始化监控
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      // 开始监控各项指标
      onCLS(handleMetric);
      onINP(handleMetric);
      onFCP(handleMetric);
      onLCP(handleMetric);
      onTTFB(handleMetric);

      // 设置加载完成
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
      
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [enabled, handleMetric]);

  // 获取特定指标
  const getMetric = useCallback((name: string): WebVitalsMetric | undefined => {
    return metrics.get(name);
  }, [metrics]);

  // 获取所有指标
  const getAllMetrics = useCallback((): WebVitalsMetric[] => {
    return Array.from(metrics.values());
  }, [metrics]);

  // 获取性能评分
  const getPerformanceScore = useCallback((): number => {
    const allMetrics = getAllMetrics();
    if (allMetrics.length === 0) return 0;

    const scores = allMetrics.map(metric => {
      switch (metric.rating) {
        case 'good':
          return 100;
        case 'needs-improvement':
          return 50;
        case 'poor':
          return 0;
        default:
          return 0;
      }
    });

    return Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length);
  }, [getAllMetrics]);

  // 获取性能摘要
  const getPerformanceSummary = useCallback(() => {
    const allMetrics = getAllMetrics();
    const summary = {
      total: allMetrics.length,
      good: allMetrics.filter(m => m.rating === 'good').length,
      needsImprovement: allMetrics.filter(m => m.rating === 'needs-improvement').length,
      poor: allMetrics.filter(m => m.rating === 'poor').length,
      score: getPerformanceScore(),
    };

    return summary;
  }, [getAllMetrics, getPerformanceScore]);

  // 重置指标
  const resetMetrics = useCallback(() => {
    setMetrics(new Map());
    setError(null);
  }, []);

  // 格式化指标值
  const formatMetricValue = useCallback((name: string, value: number): string => {
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
  }, []);

  return {
    // 数据
    metrics: Array.from(metrics.values()),
    loading,
    error,
    
    // 方法
    getMetric,
    getAllMetrics,
    getPerformanceScore,
    getPerformanceSummary,
    resetMetrics,
    formatMetricValue,
    
    // 工具方法
    isGoodPerformance: getPerformanceScore() >= 80,
    hasMetrics: metrics.size > 0,
  };
};

/**
 * 简化版 Hook - 仅获取性能评分
 */
export const usePerformanceScore = () => {
  const { getPerformanceScore, loading } = useWebVitals();
  
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    if (!loading) {
      setScore(getPerformanceScore());
    }
  }, [getPerformanceScore, loading]);
  
  return { score, loading };
};

/**
 * Web Vitals 指标常量
 */
export const WEB_VITALS_METRICS = {
  CLS: 'Cumulative Layout Shift',
  INP: 'Interaction to Next Paint', 
  FCP: 'First Contentful Paint',
  LCP: 'Largest Contentful Paint',
  TTFB: 'Time to First Byte',
} as const;

/**
 * 性能评级常量
 */
export const PERFORMANCE_RATINGS = {
  GOOD: 'good',
  NEEDS_IMPROVEMENT: 'needs-improvement', 
  POOR: 'poor',
} as const;

// 导出类型
export type { WebVitalsMetric, UseWebVitalsOptions };