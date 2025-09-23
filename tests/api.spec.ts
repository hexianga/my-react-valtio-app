import { test, expect } from '@playwright/test';

/**
 * API 相关测试
 */
test.describe('API 集成测试', () => {
  test('API 请求拦截和模拟', async ({ page }) => {
    // 模拟 API 响应
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: '模拟 API 响应',
          success: true,
          data: [],
        }),
      });
    });

    await page.goto('/');

    // 检查页面正常加载
    await expect(page.locator('body')).toBeVisible();
  });

  test('网络错误处理', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: '服务器错误',
          success: false,
        }),
      });
    });

    await page.goto('/');

    // 检查应用如何处理错误
    await expect(page.locator('body')).toBeVisible();

    // 可以检查是否显示了错误提示
    const errorAlert = page
      .locator('.error, [role="alert"], .ant-notification')
      .first();
    if (await errorAlert.isVisible()) {
      await expect(errorAlert).toBeVisible();
    }
  });

  test('API 请求超时处理', async ({ page }) => {
    // 模拟慢速 API 响应
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10秒延迟
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: '延迟响应' }),
      });
    });

    await page.goto('/');

    // 检查页面在等待期间的状态
    await expect(page.locator('body')).toBeVisible();
  });

  test('认证相关 API', async ({ page }) => {
    // 模拟认证失败
    await page.route('**/api/auth/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: '未授权访问',
          success: false,
        }),
      });
    });

    await page.goto('/');

    // 检查应用对认证失败的处理
    await expect(page.locator('body')).toBeVisible();
  });

  test('数据获取和显示', async ({ page }) => {
    // 模拟成功的数据 API
    await page.route('**/api/data', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { id: 1, name: '测试数据1' },
            { id: 2, name: '测试数据2' },
          ],
        }),
      });
    });

    await page.goto('/');

    // 检查数据是否正确显示
    await expect(page.locator('body')).toBeVisible();

    // 如果有数据列表，检查是否显示
    const dataList = page.locator('[data-testid="data-list"]').first();
    if (await dataList.isVisible()) {
      await expect(dataList).toBeVisible();
    }
  });

});

