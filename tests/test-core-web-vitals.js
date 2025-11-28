/**
 * Core Web Vitals 功能测试脚本
 * 在浏览器控制台中运行此脚本来测试性能监控功能
 */

console.log('🚀 开始测试 Core Web Vitals 功能...');

// 测试性能标记创建
function testPerformanceMarks() {
  console.log('\n📍 测试性能标记创建...');

  if ('performance' in window && 'mark' in performance) {
    performance.mark('test-mark-start');
    console.log('✅ 创建测试标记: test-mark-start');

    setTimeout(() => {
      performance.mark('test-mark-end');
      console.log('✅ 创建测试标记: test-mark-end');

      // 创建测量
      performance.measure('test-measure', 'test-mark-start', 'test-mark-end');
      console.log('✅ 创建测试测量: test-measure');
    }, 100);
  } else {
    console.warn('⚠️ 浏览器不支持 Performance API');
  }
}

// 测试长任务
function testLongTask() {
  console.log('\n⏳ 测试长任务检测...');

  const start = performance.now();
  // 创建一个长任务（超过50ms）
  while (performance.now() - start < 100) {
    // 忙等待
  }
  console.log('✅ 长任务执行完成，应该被 PerformanceObserver 检测到');
  console.log('💡 这将影响 TBT (Total Blocking Time) 指标');
}

// 测试多个长任务（用于 TTI 计算）
function testMultipleLongTasks() {
  console.log('\n⏳ 测试多个长任务（影响 TTI）...');

  let taskCount = 0;
  const maxTasks = 3;

  function createLongTask() {
    if (taskCount >= maxTasks) return;

    taskCount++;
    console.log(`🔄 执行第 ${taskCount} 个长任务...`);

    const start = performance.now();
    while (performance.now() - start < 80) {
      // 忙等待
    }

    console.log(`✅ 第 ${taskCount} 个长任务完成`);

    // 间隔一段时间后执行下一个任务
    if (taskCount < maxTasks) {
      setTimeout(createLongTask, 1000);
    } else {
      console.log('💡 多个长任务将影响 TTI (Time to Interactive) 的计算');
    }
  }

  createLongTask();
}

// 测试布局偏移
function testLayoutShift() {
  console.log('\n📐 测试布局偏移...');

  const element = document.createElement('div');
  element.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    width: 100px;
    height: 50px;
    background: #ff6b6b;
    z-index: 9999;
  `;
  element.textContent = '测试元素';
  document.body.appendChild(element);

  setTimeout(() => {
    element.style.top = '100px';
    element.style.left = '200px';
    console.log('✅ 触发布局偏移，应该被 PerformanceObserver 检测到');

    setTimeout(() => {
      document.body.removeChild(element);
      console.log('✅ 清理测试元素');
    }, 2000);
  }, 100);
}

// 测试资源加载
function testResourceLoading() {
  console.log('\n📦 测试资源加载监控...');

  const img = new Image();
  img.onload = () => {
    console.log('✅ 图片加载完成，应该被 PerformanceObserver 检测到');
  };
  img.onerror = () => {
    console.log('❌ 图片加载失败');
  };

  // 使用一个小图片进行测试
  img.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwNzNlNiIvPjwvc3ZnPg==';
}

// 检查 PerformanceObserver 支持
function checkPerformanceObserverSupport() {
  console.log('\n🔍 检查 PerformanceObserver 支持...');

  if ('PerformanceObserver' in window) {
    console.log('✅ PerformanceObserver 支持');

    const supportedTypes = PerformanceObserver.supportedEntryTypes;
    console.log('📊 支持的 entryTypes:', supportedTypes);

    // 检查关键类型
    const keyTypes = [
      'navigation',
      'paint',
      'largest-contentful-paint',
      'first-input',
      'layout-shift',
      'longtask',
    ];
    keyTypes.forEach(type => {
      if (supportedTypes.includes(type)) {
        console.log(`✅ ${type}: 支持`);
      } else {
        console.log(`❌ ${type}: 不支持`);
      }
    });
  } else {
    console.warn('⚠️ 浏览器不支持 PerformanceObserver');
  }
}

// 获取当前性能条目
function getCurrentPerformanceEntries() {
  console.log('\n📈 当前性能条目统计:');

  const entryTypes = [
    'navigation',
    'resource',
    'paint',
    'measure',
    'mark',
    'longtask',
    'layout-shift',
    'largest-contentful-paint',
    'first-input',
  ];

  entryTypes.forEach(type => {
    try {
      const entries = performance.getEntriesByType(type);
      console.log(`${type}: ${entries.length} 条`);
    } catch {
      console.log(`${type}: 不支持`);
    }
  });
}

// 运行所有测试
function runAllTests() {
  checkPerformanceObserverSupport();
  getCurrentPerformanceEntries();
  testPerformanceMarks();
  testLongTask();
  testLayoutShift();
  testResourceLoading();

  // 延迟执行多个长任务测试
  setTimeout(() => {
    testMultipleLongTasks();
  }, 2000);

  console.log('\n🎯 测试完成！请查看控制台中的 PerformanceObserver 日志输出。');
  console.log('💡 提示：打开 Network 面板可以看到资源加载的详细信息。');
  console.log('🔄 TTI 和 TBT 指标将在长任务执行后更新。');
}

// 导出测试函数到全局作用域
window.testCoreWebVitals = runAllTests;
window.testPerformanceMarks = testPerformanceMarks;
window.testLongTask = testLongTask;
window.testMultipleLongTasks = testMultipleLongTasks;
window.testLayoutShift = testLayoutShift;
window.testResourceLoading = testResourceLoading;

console.log('📋 可用的测试函数:');
console.log('- testCoreWebVitals(): 运行所有测试');
console.log('- testPerformanceMarks(): 测试性能标记');
console.log('- testLongTask(): 测试单个长任务（影响 TBT）');
console.log('- testMultipleLongTasks(): 测试多个长任务（影响 TTI）');
console.log('- testLayoutShift(): 测试布局偏移');
console.log('- testResourceLoading(): 测试资源加载');

// 自动运行测试
setTimeout(runAllTests, 1000);
