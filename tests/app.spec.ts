import { test, expect } from '@playwright/test';

/**
 * 应用基础功能测试
 */
test.describe('应用基础功能', () => {
  test('页面正常加载', async ({ page }) => {
    await page.goto('/');

    // 检查页面标题
    await expect(page).toHaveTitle(/React Valtio App/);

    // 检查主要内容存在
    await expect(page.locator('body')).toBeVisible();
  });

  test('导航功能正常', async ({ page }) => {
    await page.goto('/');

    // 查找并点击导航链接（如果存在）
    const homeLink = page.locator('a[href="/"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page.url()).toBe('http://127.0.0.1:3004/');
    }

    // 检查关于页面导航
    const aboutLink = page.locator('a[href="/about"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForURL('/about');
      await expect(page.url()).toContain('/about');
    }
  });

  test('响应式设计检查', async ({ page }) => {
    await page.goto('/');

    // 桌面端视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();

    // 平板端视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // 移动端视图
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});
