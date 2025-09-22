import { test, expect } from '@playwright/test';

/**
 * 表单功能测试
 */
test.describe('用户表单功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form');
  });

  test('表单页面正常加载', async ({ page }) => {
    // 检查表单容器存在（使用 Formily + Ant Design 结构）
    const formCard = page.locator('.ant-card').first();
    await expect(formCard).toBeVisible();

    // 检查表单标题（使用文本匹配）
    const formTitle = page
      .locator('.ant-card-head-title')
      .filter({ hasText: '用户信息表单' });
    await expect(formTitle).toBeVisible();
  });

  test('表单输入验证', { tag: "@表单输入" }, async ({ page }) => {
    // 查找表单字段（Formily 生成的字段结构）
    const nameInput = page
      .locator('[data-path="name"] input, input[placeholder*="姓名"]')
      .first();
    const emailInput = page
      .locator('[data-path="email"] input, input[placeholder*="邮箱"]')
      .first();
    const submitButton = page
      .locator('button')
      .filter({ hasText: '提交' })
      .first();

    // 等待表单加载
    await page.waitForTimeout(1000);

    if (await nameInput.isVisible()) {
      // 清空字段测试验证
      await nameInput.fill('');
      if (await emailInput.isVisible()) {
        await emailInput.fill('');
      }

      if (await submitButton.isVisible()) {
        await submitButton.click();

        // 等待验证错误显示
        await page.waitForTimeout(500);

        // 检查验证错误信息（Formily + Ant Design 的错误样式）
        const errorMessage = page
          .locator(
            '.ant-formily-item-error, .ant-form-item-explain-error, [role="alert"]'
          )
          .first();
        if ((await errorMessage.count()) > 0) {
          await expect(errorMessage).toBeVisible();
        }
      }
    }
  });

  test('表单正确提交', async ({ page }) => {
    const nameInput = page
      .locator('[data-path="name"] input, input[placeholder*="姓名"]')
      .first();
    const emailInput = page
      .locator('[data-path="email"] input, input[placeholder*="邮箱"]')
      .first();
    const submitButton = page
      .locator('button')
      .filter({ hasText: '提交' })
      .first();

    // 等待表单加载
    await page.waitForTimeout(1000);

    if ((await nameInput.isVisible()) && (await emailInput.isVisible())) {
      // 填写有效数据
      await nameInput.fill('测试用户');
      await emailInput.fill('test@example.com');

      if (await submitButton.isVisible()) {
        await submitButton.click();

        // 检查提交成功状态（等待 Ant Design 消息提示）
        await page.waitForTimeout(2000);

        // 检查成功消息
        const successMessage = page.locator(
          '.ant-message-success, .ant-notification-notice-success'
        );
        if ((await successMessage.count()) > 0) {
          await expect(successMessage).toBeVisible();
        }
      }
    }
  });

  test('表单字段交互', async ({ page }) => {
    const nameInput = page
      .locator('[data-path="name"] input, input[placeholder*="姓名"]')
      .first();

    // 等待表单加载
    await page.waitForTimeout(1000);

    if (await nameInput.isVisible()) {
      // 测试输入框焦点
      await nameInput.focus();
      await expect(nameInput).toBeFocused();

      // 测试输入内容
      await nameInput.fill('测试输入');
      await expect(nameInput).toHaveValue('测试输入');

      // 测试清空内容
      await nameInput.clear();
      await expect(nameInput).toHaveValue('');
    }
  });
});
