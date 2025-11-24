import React, { useState, useEffect } from 'react';
import {
  createPerformanceMark,
  createPerformanceMeasure,
  getPerformanceEntriesSummary,
  stopPerformanceObserver,
  initPerformanceObserver,
} from '../utils/performanceObserver';
import CoreWebVitalsDisplay from '../components/CoreWebVitalsDisplay';

/**
 * 性能监控演示页面
 * 展示 PerformanceObserver 的各种功能
 */
const PerformancePage: React.FC = () => {
  const [isObserverActive, setIsObserverActive] = useState(true);
  const [performanceData, setPerformanceData] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    // 页面加载时获取性能数据
    const data = getPerformanceEntriesSummary();
    setPerformanceData(data || {});
  }, []);

  // 创建性能标记
  const handleCreateMark = () => {
    const markName = `user-action-${Date.now()}`;
    createPerformanceMark(markName);

    // 延迟更新数据以显示新的标记
    setTimeout(() => {
      const data = getPerformanceEntriesSummary();
      setPerformanceData(data || {});
    }, 100);
  };

  // 创建性能测量
  const handleCreateMeasure = () => {
    const startMark = `measure-start-${Date.now()}`;
    const endMark = `measure-end-${Date.now()}`;
    const measureName = `user-measure-${Date.now()}`;

    createPerformanceMark(startMark);

    // 模拟一些操作
    setTimeout(
      () => {
        createPerformanceMark(endMark);
        createPerformanceMeasure(measureName, startMark, endMark);

        // 更新数据
        setTimeout(() => {
          const data = getPerformanceEntriesSummary();
          setPerformanceData(data || {});
        }, 100);
      },
      Math.random() * 1000 + 500
    ); // 随机延迟 500-1500ms
  };

  // 模拟长任务
  const handleLongTask = () => {
    const start = performance.now();
    // 创建一个长任务（超过50ms）
    while (performance.now() - start < 100) {
      // 忙等待
    }
    console.log('🐌 长任务执行完成');
  };

  // 模拟布局偏移
  const handleLayoutShift = () => {
    const element = document.createElement('div');
    element.style.cssText = `
      position: absolute;
      top: 50px;
      left: 50px;
      width: 200px;
      height: 100px;
      background: #ff6b6b;
      transition: all 0.3s ease;
    `;
    element.textContent = '我会引起布局偏移！';
    document.body.appendChild(element);

    setTimeout(() => {
      element.style.top = '200px';
      element.style.left = '300px';
    }, 100);

    setTimeout(() => {
      document.body.removeChild(element);
    }, 2000);
  };

  // 加载大图片（模拟资源加载）
  const handleLoadResource = () => {
    const img = new Image();
    img.onload = () => {
      console.log('📸 图片加载完成');
      setTimeout(() => {
        const data = getPerformanceEntriesSummary();
        setPerformanceData(data || {});
      }, 100);
    };
    // 使用一个大图片URL
    img.src = `https://picsum.photos/800/600?random=${Date.now()}`;
  };

  // 切换观察器状态
  const handleToggleObserver = () => {
    if (isObserverActive) {
      stopPerformanceObserver();
      setIsObserverActive(false);
    } else {
      initPerformanceObserver({
        enableConsoleLog: true,
        enableSentryReport: false,
        enableDetailedLogging: true,
      });
      setIsObserverActive(true);
    }
  };

  // 刷新性能数据
  const handleRefreshData = () => {
    const data = getPerformanceEntriesSummary();
    setPerformanceData(data || {});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 PerformanceObserver 演示
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            这个页面演示了 PerformanceObserver 如何监听所有类型的性能条目。
            打开浏览器开发者工具的控制台查看详细的性能日志。
          </p>
        </div>

        {/* 控制面板 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🎮 控制面板
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <button onClick={handleCreateMark} className="btn btn-primary">
              📍 创建性能标记
            </button>

            <button onClick={handleCreateMeasure} className="btn btn-secondary">
              📏 创建性能测量
            </button>

            <button onClick={handleLongTask} className="btn btn-warning">
              🐌 模拟长任务
            </button>

            <button onClick={handleLayoutShift} className="btn btn-danger">
              📐 触发布局偏移
            </button>

            <button onClick={handleLoadResource} className="btn btn-info">
              📦 加载资源
            </button>

            <button onClick={handleRefreshData} className="btn btn-success">
              🔄 刷新数据
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">观察器状态:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isObserverActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isObserverActive ? '🟢 运行中' : '🔴 已停止'}
              </span>
            </div>

            <button
              onClick={handleToggleObserver}
              className={`btn ${isObserverActive ? 'btn-danger' : 'btn-success'}`}
            >
              {isObserverActive ? '🛑 停止观察器' : '▶️ 启动观察器'}
            </button>
          </div>
        </div>

        {/* Core Web Vitals 显示 */}
        <CoreWebVitalsDisplay />

        {/* 性能数据展示 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            📊 性能条目统计
          </h2>

          {Object.keys(performanceData).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>暂无性能数据，请点击"刷新数据"按钮</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(performanceData).map(([type, count]) => {
                const getTypeIcon = (entryType: string) => {
                  const icons: Record<string, string> = {
                    navigation: '🧭',
                    resource: '📦',
                    paint: '🎨',
                    measure: '📏',
                    mark: '📍',
                    longtask: '⏳',
                    'layout-shift': '📐',
                    'largest-contentful-paint': '🖼️',
                    'first-input': '👆',
                    event: '⚡',
                    element: '🔲',
                    'user-timing': '⏱️',
                  };
                  return icons[entryType] || '📊';
                };

                return (
                  <div
                    key={type}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl mb-2">{getTypeIcon(type)}</div>
                    <div className="text-sm text-gray-600 mb-1">{type}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 使用说明
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>
              • <strong>性能标记</strong>：创建时间点标记，用于测量特定时刻
            </li>
            <li>
              • <strong>性能测量</strong>：测量两个标记之间的时间差
            </li>
            <li>
              • <strong>长任务</strong>：执行超过50ms的任务，会被自动检测
            </li>
            <li>
              • <strong>布局偏移</strong>：页面元素位置变化，影响用户体验
            </li>
            <li>
              • <strong>资源加载</strong>：监控图片、脚本等资源的加载性能
            </li>
            <li>
              • <strong>控制台日志</strong>：所有性能事件都会在控制台中详细记录
            </li>
          </ul>
        </div>

        {/* 支持的条目类型 */}
        <div className="bg-green-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            🎯 支持的 PerformanceEntry 类型
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-green-800">
            {[
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
            ].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
