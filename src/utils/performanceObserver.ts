/**
 * PerformanceObserver 性能监控工具
 *
 * 监听所有支持的 PerformanceEntry 类型：
 * - navigation: 导航计时
 * - resource: 资源加载计时
 * - paint: 绘制计时 (FCP, FP)
 * - measure: 自定义测量
 * - mark: 自定义标记
 * - longtask: 长任务
 * - layout-shift: 布局偏移
 * - largest-contentful-paint: 最大内容绘制
 * - first-input: 首次输入延迟
 * - event: 事件计时
 * - element: 元素计时
 * - user-timing: 用户计时
 */

import * as Sentry from '@sentry/react';

/**
 * 性能观察器配置
 */
interface PerformanceObserverConfig {
  enableConsoleLog?: boolean;
  enableSentryReport?: boolean;
  enableDetailedLogging?: boolean;
  filterByType?: string[];
  excludeTypes?: string[];
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Required<PerformanceObserverConfig> = {
  enableConsoleLog: true,
  enableSentryReport: true,
  enableDetailedLogging: false,
  filterByType: [],
  excludeTypes: [],
};

/**
 * 所有支持的 PerformanceEntry 类型
 */
const SUPPORTED_ENTRY_TYPES = [
  'navigation',
  'resource',
  'paint',
  'measure',
  'mark',
  'longtask',
  'layout-shift',
  'largest-contentful-paint',
  'first-input',
  'event',
  'element',
  'user-timing',
];

/**
 * 获取支持的 entry types
 */
const getSupportedEntryTypes = (): string[] => {
  if (!('PerformanceObserver' in window)) {
    console.warn('⚠️ 当前浏览器不支持 PerformanceObserver');
    return [];
  }

  return SUPPORTED_ENTRY_TYPES.filter(type => {
    try {
      return PerformanceObserver.supportedEntryTypes.includes(type);
    } catch {
      return false;
    }
  });
};

/**
 * 格式化性能条目值
 */
const formatEntryValue = (entry: PerformanceEntry): string => {
  switch (entry.entryType) {
    case 'navigation':
    case 'resource':
      return `${Math.round(entry.duration)}ms`;
    case 'paint':
      return `${Math.round(entry.startTime)}ms`;
    case 'layout-shift': {
      const layoutShift = entry as any;
      return `${layoutShift.value?.toFixed(4) || 'N/A'}`;
    }
    case 'largest-contentful-paint':
      return `${Math.round(entry.startTime)}ms`;
    case 'first-input': {
      const firstInput = entry as any;
      return `${Math.round(firstInput.processingStart - firstInput.startTime)}ms`;
    }
    case 'longtask':
      return `${Math.round(entry.duration)}ms`;
    case 'measure':
    case 'mark':
      return entry.duration
        ? `${Math.round(entry.duration)}ms`
        : `@${Math.round(entry.startTime)}ms`;
    default:
      return entry.duration
        ? `${Math.round(entry.duration)}ms`
        : `@${Math.round(entry.startTime)}ms`;
  }
};

/**
 * 获取条目类型对应的图标和颜色
 */
const getEntryTypeStyle = (entryType: string) => {
  const styles: Record<
    string,
    { icon: string; color: string; bgColor: string }
  > = {
    navigation: { icon: '🧭', color: '#1e40af', bgColor: '#dbeafe' },
    resource: { icon: '📦', color: '#059669', bgColor: '#d1fae5' },
    paint: { icon: '🎨', color: '#dc2626', bgColor: '#fee2e2' },
    measure: { icon: '📏', color: '#7c3aed', bgColor: '#ede9fe' },
    mark: { icon: '📍', color: '#ea580c', bgColor: '#fed7aa' },
    longtask: { icon: '⏳', color: '#dc2626', bgColor: '#fee2e2' },
    'layout-shift': { icon: '📐', color: '#b91c1c', bgColor: '#fecaca' },
    'largest-contentful-paint': {
      icon: '🖼️',
      color: '#059669',
      bgColor: '#d1fae5',
    },
    'first-input': { icon: '👆', color: '#2563eb', bgColor: '#dbeafe' },
    event: { icon: '⚡', color: '#7c2d12', bgColor: '#fed7aa' },
    element: { icon: '🔲', color: '#374151', bgColor: '#f3f4f6' },
    'user-timing': { icon: '⏱️', color: '#6366f1', bgColor: '#e0e7ff' },
  };

  return (
    styles[entryType] || { icon: '📊', color: '#6b7280', bgColor: '#f9fafb' }
  );
};

/**
 * 处理性能条目
 */
const handlePerformanceEntry = (
  entry: PerformanceEntry,
  config: Required<PerformanceObserverConfig>
) => {
  const { entryType, name, startTime, duration } = entry;

  // 过滤检查
  if (
    config.filterByType.length > 0 &&
    !config.filterByType.includes(entryType)
  ) {
    return;
  }

  if (config.excludeTypes.includes(entryType)) {
    return;
  }

  const formattedValue = formatEntryValue(entry);
  const { icon, color, bgColor } = getEntryTypeStyle(entryType);

  // 更新核心性能指标
  updateCoreWebVitals(entry);

  // 控制台输出
  if (config.enableConsoleLog) {
    const style = `
      background: ${bgColor};
      color: ${color};
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: bold;
    `;

    if (config.enableDetailedLogging) {
      console.group(`${icon} PerformanceEntry - ${entryType}`);
      console.log(`%c${entryType}: ${name} - ${formattedValue}`, style);
      console.log('📊 详细信息:', {
        entryType,
        name,
        startTime: Math.round(startTime),
        duration: Math.round(duration),
        timestamp: new Date().toISOString(),
        entry,
      });
      console.groupEnd();
    } else {
      console.log(
        `${icon} %c${entryType}%c: ${name} - ${formattedValue}`,
        style,
        ''
      );
    }
  }

  // Sentry 报告
  if (config.enableSentryReport) {
    // 设置性能标签
    Sentry.setTag(`performance.${entryType}`, true);

    // 记录关键性能指标
    if (
      [
        'navigation',
        'paint',
        'largest-contentful-paint',
        'first-input',
      ].includes(entryType)
    ) {
      Sentry.setMeasurement(
        `${entryType}.${name}`,
        startTime + duration,
        'millisecond'
      );
    }

    // 记录长任务和布局偏移
    if (entryType === 'longtask' && duration > 50) {
      Sentry.captureMessage(`Long Task Detected: ${Math.round(duration)}ms`, {
        level: 'warning',
        tags: {
          performanceObserver: true,
          entryType: 'longtask',
        },
        extra: {
          name,
          duration,
          startTime,
        },
      });
    }

    if (entryType === 'layout-shift') {
      const layoutShift = entry as any;
      const value = layoutShift.value || 0;
      if (value > 0.1) {
        Sentry.captureMessage(`Layout Shift Detected: ${value.toFixed(4)}`, {
          level: 'warning',
          tags: {
            performanceObserver: true,
            entryType: 'layout-shift',
          },
          extra: {
            value,
            startTime,
            sources: layoutShift.sources,
          },
        });
      }
    }
  }
};

/**
 * 性能观察器实例存储
 */
const observers: PerformanceObserver[] = [];

/**
 * 关键性能指标存储
 */
interface CoreWebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  FP?: number; // First Paint
  TTI?: number; // Time to Interactive
  TBT?: number; // Total Blocking Time
}

const coreWebVitals: CoreWebVitals = {};
const vitalsCallbacks: Array<(vitals: CoreWebVitals) => void> = [];

// TTI 和 TBT 计算相关的状态
const longTasks: PerformanceEntry[] = [];
let fcpTime = 0;
let ttiCalculated = false;

/**
 * 计算 Total Blocking Time (TBT)
 * TBT 是所有长任务（>50ms）超出50ms部分的总和
 */
const calculateTBT = (): number => {
  return longTasks.reduce((total, task) => {
    const blockingTime = Math.max(0, task.duration - 50);
    return total + blockingTime;
  }, 0);
};

/**
 * 计算 Time to Interactive (TTI)
 * TTI 是从 FCP 开始，找到一个5秒窗口期内没有长任务的时间点
 */
const calculateTTI = (): number | undefined => {
  if (!fcpTime || ttiCalculated) return undefined;

  // 获取所有长任务，按开始时间排序
  const sortedLongTasks = [...longTasks].sort(
    (a, b) => a.startTime - b.startTime
  );

  // 从 FCP 开始查找 TTI
  let searchStart = fcpTime;
  const windowSize = 5000; // 5秒窗口

  // 如果没有长任务，TTI 就是 FCP
  if (sortedLongTasks.length === 0) {
    return fcpTime;
  }

  // 查找5秒内没有长任务的窗口
  for (let i = 0; i < sortedLongTasks.length; i++) {
    const task = sortedLongTasks[i];

    // 如果当前任务开始时间距离搜索起点超过5秒，找到了TTI
    if (task.startTime - searchStart >= windowSize) {
      return searchStart;
    }

    // 更新搜索起点到当前任务结束时间
    searchStart = Math.max(searchStart, task.startTime + task.duration);
  }

  // 检查最后一个任务后是否有5秒窗口
  const lastTask = sortedLongTasks[sortedLongTasks.length - 1];
  const lastTaskEnd = lastTask.startTime + lastTask.duration;
  const currentTime = performance.now();

  if (currentTime - lastTaskEnd >= windowSize) {
    return lastTaskEnd;
  }

  // 如果还没找到，返回 undefined（TTI 还未确定）
  return undefined;
};

/**
 * 更新核心性能指标
 */
const updateCoreWebVitals = (entry: PerformanceEntry) => {
  let updated = false;

  switch (entry.entryType) {
    case 'paint':
      if (entry.name === 'first-contentful-paint') {
        coreWebVitals.FCP = entry.startTime;
        fcpTime = entry.startTime;
        updated = true;

        // FCP 确定后，尝试计算 TTI
        setTimeout(() => {
          const tti = calculateTTI();
          if (tti !== undefined && !ttiCalculated) {
            coreWebVitals.TTI = tti;
            ttiCalculated = true;
            // 通知订阅者 TTI 更新
            vitalsCallbacks.forEach(callback => {
              try {
                callback({ ...coreWebVitals });
              } catch (error) {
                console.warn('⚠️ 性能指标回调执行失败:', error);
              }
            });
          }
        }, 6000); // 等待6秒后计算 TTI
      } else if (entry.name === 'first-paint') {
        coreWebVitals.FP = entry.startTime;
        updated = true;
      }
      break;
    case 'largest-contentful-paint':
      coreWebVitals.LCP = entry.startTime;
      updated = true;
      break;
    case 'first-input': {
      const firstInput = entry as any;
      coreWebVitals.FID = firstInput.processingStart - firstInput.startTime;
      updated = true;
      break;
    }
    case 'layout-shift': {
      const layoutShift = entry as any;
      if (layoutShift.value) {
        coreWebVitals.CLS = (coreWebVitals.CLS || 0) + layoutShift.value;
        updated = true;
      }
      break;
    }
    case 'navigation': {
      const navigation = entry as PerformanceNavigationTiming;
      coreWebVitals.TTFB = navigation.responseStart - navigation.requestStart;
      updated = true;
      break;
    }
    case 'longtask': {
      // 收集长任务用于 TTI 和 TBT 计算
      longTasks.push(entry);

      // 实时更新 TBT
      coreWebVitals.TBT = calculateTBT();
      updated = true;

      // 如果 FCP 已确定且 TTI 还未计算，尝试重新计算 TTI
      if (fcpTime && !ttiCalculated) {
        const tti = calculateTTI();
        if (tti !== undefined) {
          coreWebVitals.TTI = tti;
          ttiCalculated = true;
        }
      }
      break;
    }
  }

  if (updated) {
    // 通知所有订阅者
    vitalsCallbacks.forEach(callback => {
      try {
        callback({ ...coreWebVitals });
      } catch (error) {
        console.warn('⚠️ 性能指标回调执行失败:', error);
      }
    });
  }
};

/**
 * 初始化 PerformanceObserver
 */
export const initPerformanceObserver = (
  userConfig: PerformanceObserverConfig = {}
) => {
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  if (!('PerformanceObserver' in window)) {
    console.warn('⚠️ 当前浏览器不支持 PerformanceObserver');
    return;
  }

  try {
    const supportedTypes = getSupportedEntryTypes();

    if (supportedTypes.length === 0) {
      console.warn('⚠️ 没有找到支持的 PerformanceEntry 类型');
      return;
    }

    console.log('🚀 初始化 PerformanceObserver');
    console.log('📊 支持的类型:', supportedTypes);

    // 为每种类型创建观察器（某些类型需要单独观察）
    const singleTypeObservers = [
      'navigation',
      'longtask',
      'layout-shift',
      'largest-contentful-paint',
      'first-input',
    ];
    const batchTypes: string[] = [];

    supportedTypes.forEach(type => {
      if (singleTypeObservers.includes(type)) {
        try {
          const observer = new PerformanceObserver(list => {
            list
              .getEntries()
              .forEach(entry => handlePerformanceEntry(entry, config));
          });

          observer.observe({ type: type as any, buffered: true });
          observers.push(observer);

          console.log(`✅ ${type} 观察器已启动`);
        } catch (observerError) {
          console.warn(`⚠️ 无法创建 ${type} 观察器:`, observerError);
        }
      } else {
        batchTypes.push(type);
      }
    });

    // 批量观察其他类型
    if (batchTypes.length > 0) {
      try {
        const batchObserver = new PerformanceObserver(list => {
          list
            .getEntries()
            .forEach(entry => handlePerformanceEntry(entry, config));
        });

        batchObserver.observe({
          entryTypes: batchTypes as any,
          buffered: true,
        });
        observers.push(batchObserver);

        console.log(`✅ 批量观察器已启动，监听类型:`, batchTypes);
      } catch (batchError) {
        console.warn('⚠️ 无法创建批量观察器:', batchError);
      }
    }

    console.log(
      `🎯 PerformanceObserver 初始化完成，共创建 ${observers.length} 个观察器`
    );
  } catch (error) {
    console.error('❌ PerformanceObserver 初始化失败:', error);

    if (config.enableSentryReport) {
      Sentry.captureException(error, {
        tags: { component: 'performanceObserver' },
      });
    }
  }
};

/**
 * 停止所有性能观察器
 */
export const stopPerformanceObserver = () => {
  observers.forEach(observer => {
    try {
      observer.disconnect();
    } catch (disconnectError) {
      console.warn('⚠️ 停止观察器时出错:', disconnectError);
    }
  });

  observers.length = 0;
  console.log('🛑 所有 PerformanceObserver 已停止');
};

/**
 * 获取当前性能条目摘要
 */
export const getPerformanceEntriesSummary = () => {
  const summary: Record<string, number> = {};

  getSupportedEntryTypes().forEach(type => {
    try {
      const entries = performance.getEntriesByType(type);
      summary[type] = entries.length;
    } catch {
      summary[type] = 0;
    }
  });

  console.group('📈 性能条目摘要');
  Object.entries(summary).forEach(([type, count]) => {
    const { icon } = getEntryTypeStyle(type);
    console.log(`${icon} ${type}: ${count} 条`);
  });
  console.groupEnd();

  return summary;
};

/**
 * 创建自定义性能标记
 */
export const createPerformanceMark = (name: string) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(name);
    console.log(`📍 创建性能标记: ${name}`);
  }
};

/**
 * 创建自定义性能测量
 */
export const createPerformanceMeasure = (
  name: string,
  startMark?: string,
  endMark?: string
) => {
  if ('performance' in window && 'measure' in performance) {
    try {
      if (startMark && endMark) {
        performance.measure(name, startMark, endMark);
      } else if (startMark) {
        performance.measure(name, startMark);
      } else {
        performance.measure(name);
      }
      console.log(`📏 创建性能测量: ${name}`);
    } catch (measureError) {
      console.warn(`⚠️ 创建性能测量失败: ${name}`, measureError);
    }
  }
};

/**
 * 获取当前核心性能指标
 */
export const getCoreWebVitals = (): CoreWebVitals => {
  return { ...coreWebVitals };
};

/**
 * 订阅核心性能指标更新
 */
export const subscribeToCoreWebVitals = (
  callback: (vitals: CoreWebVitals) => void
) => {
  vitalsCallbacks.push(callback);

  // 立即调用一次回调，传递当前值
  callback({ ...coreWebVitals });

  // 返回取消订阅函数
  return () => {
    const index = vitalsCallbacks.indexOf(callback);
    if (index > -1) {
      vitalsCallbacks.splice(index, 1);
    }
  };
};

/**
 * 格式化性能指标值
 */
export const formatVitalValue = (
  value: number | undefined,
  unit: 'ms' | 'score' = 'ms'
): string => {
  if (value === undefined) return 'N/A';

  if (unit === 'score') {
    return value.toFixed(4);
  }

  return `${Math.round(value)}ms`;
};

/**
 * 获取性能指标评级
 */
export const getVitalRating = (
  metric: keyof CoreWebVitals,
  value: number | undefined
): 'good' | 'needs-improvement' | 'poor' => {
  if (value === undefined) return 'poor';

  switch (metric) {
    case 'FCP':
      return value <= 1800
        ? 'good'
        : value <= 3000
          ? 'needs-improvement'
          : 'poor';
    case 'LCP':
      return value <= 2500
        ? 'good'
        : value <= 4000
          ? 'needs-improvement'
          : 'poor';
    case 'FID':
      return value <= 100
        ? 'good'
        : value <= 300
          ? 'needs-improvement'
          : 'poor';
    case 'CLS':
      return value <= 0.1
        ? 'good'
        : value <= 0.25
          ? 'needs-improvement'
          : 'poor';
    case 'TTFB':
      return value <= 800
        ? 'good'
        : value <= 1800
          ? 'needs-improvement'
          : 'poor';
    case 'FP':
      return value <= 1000
        ? 'good'
        : value <= 2000
          ? 'needs-improvement'
          : 'poor';
    case 'TTI':
      return value <= 3800
        ? 'good'
        : value <= 7300
          ? 'needs-improvement'
          : 'poor';
    case 'TBT':
      return value <= 200
        ? 'good'
        : value <= 600
          ? 'needs-improvement'
          : 'poor';
    default:
      return 'poor';
  }
};

// 导出类型定义
export type { PerformanceObserverConfig, CoreWebVitals };
