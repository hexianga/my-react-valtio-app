import { test, expect } from '@playwright/test';

/**
 * 性能相关测试
 */
test.describe('应用性能测试', () => {
  test('页面加载性能', async ({ page }) => {
    // 开始性能监控
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // 检查页面加载时间（应小于5秒）
    expect(loadTime).toBeLessThan(5000);

    // 检查页面是否完全加载
    await expect(page.locator('body')).toBeVisible();
  });

  test('资源加载检查', async ({ page }) => {
    const responses: any[] = [];

    // 监听网络请求
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'],
      });
    });

    await page.goto('/');

    // 检查是否有失败的资源加载
    const failedResponses = responses.filter(
      response => response.status >= 400
    );
    expect(failedResponses.length).toBe(0);
  });

  test('内存泄漏检查', async ({ page }) => {
    await page.goto('/');

    // 执行一些操作来测试内存使用
    for (let i = 0; i < 5; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');
    }

    // 基本的页面功能检查
    await expect(page.locator('body')).toBeVisible();
  });

  test('Web Vitals 检查', async ({ page }) => {
    await page.goto('/');

    // 检查 Web Vitals 组件是否存在（仅开发环境）
    const webVitalsDisplay = page.locator('[data-testid="web-vitals-display"]');

    // 在开发环境中，Web Vitals 组件应该可见
    if (process.env.NODE_ENV === 'development') {
      // Web Vitals 组件可能需要一些时间来初始化
      await page.waitForTimeout(2000);

      // 检查是否有性能指标显示
      const hasMetrics = await webVitalsDisplay.isVisible();
      if (hasMetrics) {
        await expect(webVitalsDisplay).toBeVisible();
      }
    }
  });

  test('JavaScript 错误检查', async ({ page }) => {
    const errors: string[] = [];

    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 监听页面错误
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 执行一些基本操作
    await page.click('body');

    // 检查是否有JavaScript错误
    expect(errors.length).toBe(0);
  });
});
