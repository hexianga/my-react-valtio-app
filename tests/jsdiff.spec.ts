import { test, expect } from '@playwright/test';

/**
 * JSDiff 工具测试
 */
test.describe('JSDiff 专业差异比较工具', () => {
  test('页面应该正常加载并显示 JSDiff 工具', async ({ page }) => {
    await page.goto('/jsdiff');

    // 检查页面标题
    await expect(page.locator('h1')).toContainText('JSDiff 专业差异比较工具');

    // 检查输入区域
    await expect(page.locator('label:has-text("原始内容")')).toBeVisible();
    await expect(page.locator('label:has-text("新内容")')).toBeVisible();

    // 检查比较类型选择器
    await expect(page.locator('select')).toBeVisible();

    // 检查比较按钮
    await expect(page.locator('button:has-text("开始比较")')).toBeVisible();

    // 检查演示按钮
    await expect(page.locator('button:has-text("加载文本演示")')).toBeVisible();
    await expect(page.locator('button:has-text("加载JSON演示")')).toBeVisible();
    await expect(page.locator('button:has-text("加载CSS演示")')).toBeVisible();
  });

  test('应该能够加载文本演示数据并进行比较', async ({ page }) => {
    await page.goto('/jsdiff');

    // 点击加载文本演示按钮
    await page.click('button:has-text("加载文本演示")');

    // 检查文本框是否填充了内容
    const oldContentTextarea = page.locator('textarea').first();
    const newContentTextarea = page.locator('textarea').nth(1);

    await expect(oldContentTextarea).not.toHaveValue('');
    await expect(newContentTextarea).not.toHaveValue('');

    // 点击比较按钮
    await page.click('button:has-text("开始比较")');

    // 等待比较结果出现
    await page.waitForSelector('.bg-white.rounded-lg.shadow-md:has(h2)', {
      timeout: 5000,
    });

    // 检查差异结果是否显示
    await expect(page.locator('h2')).toContainText('文本行差异演示');

    // 检查统计信息
    await expect(page.locator('text=新增')).toBeVisible();
    await expect(page.locator('text=删除')).toBeVisible();
    await expect(page.locator('text=个变化')).toBeVisible();
  });

  test('应该能够加载JSON演示数据并进行比较', async ({ page }) => {
    await page.goto('/jsdiff');

    // 点击加载JSON演示按钮
    await page.click('button:has-text("加载JSON演示")');

    // 检查比较类型是否自动设置为JSON
    const selectElement = page.locator('select');
    await expect(selectElement).toHaveValue('json');

    // 点击比较按钮
    await page.click('button:has-text("开始比较")');

    // 等待比较结果出现
    await page.waitForSelector('h2:has-text("JSON对象差异演示")', {
      timeout: 5000,
    });

    // 检查差异结果标题
    await expect(page.locator('h2')).toContainText('JSON对象差异演示');

    // 检查是否显示了JSON类型标签
    await expect(
      page.locator('.text-blue-600 span:has-text("json")')
    ).toBeVisible();
  });

  test('应该能够加载CSS演示数据并进行比较', async ({ page }) => {
    await page.goto('/jsdiff');

    // 点击加载CSS演示按钮
    await page.click('button:has-text("加载CSS演示")');

    // 检查比较类型是否自动设置为CSS
    const selectElement = page.locator('select');
    await expect(selectElement).toHaveValue('css');

    // 点击比较按钮
    await page.click('button:has-text("开始比较")');

    // 等待比较结果出现
    await page.waitForSelector('h2:has-text("CSS样式差异演示")', {
      timeout: 5000,
    });

    // 检查差异结果标题
    await expect(page.locator('h2')).toContainText('CSS样式差异演示');

    // 检查是否显示了CSS类型标签
    await expect(
      page.locator('.text-blue-600 span:has-text("css")')
    ).toBeVisible();
  });

  test('应该能够切换不同的比较类型', async ({ page }) => {
    await page.goto('/jsdiff');

    const selectElement = page.locator('select');

    // 测试各种比较类型
    const compareTypes = [
      { value: 'lines', text: '行差异' },
      { value: 'words', text: '单词差异' },
      { value: 'chars', text: '字符差异' },
      { value: 'json', text: 'JSON差异' },
      { value: 'css', text: 'CSS差异' },
      { value: 'sentences', text: '句子差异' },
    ];

    for (const type of compareTypes) {
      await selectElement.selectOption(type.value);
      await expect(selectElement).toHaveValue(type.value);
    }
  });

  test('应该能够使用设置选项', async ({ page }) => {
    await page.goto('/jsdiff');

    // 检查设置选项是否存在
    await expect(page.locator('text=比较设置')).toBeVisible();
    await expect(page.locator('text=忽略空白字符')).toBeVisible();
    await expect(page.locator('text=忽略大小写')).toBeVisible();
    await expect(page.locator('text=内联显示差异')).toBeVisible();

    // 测试设置选项的切换
    const ignoreWhitespaceCheckbox = page
      .locator('input[type="checkbox"]')
      .first();
    const ignoreCaseCheckbox = page.locator('input[type="checkbox"]').nth(1);
    const showInlineDiffCheckbox = page
      .locator('input[type="checkbox"]')
      .nth(2);

    // 切换选项
    await ignoreWhitespaceCheckbox.check();
    await expect(ignoreWhitespaceCheckbox).toBeChecked();

    await ignoreCaseCheckbox.check();
    await expect(ignoreCaseCheckbox).toBeChecked();

    await showInlineDiffCheckbox.uncheck();
    await expect(showInlineDiffCheckbox).not.toBeChecked();
  });

  test('应该能够清空所有数据', async ({ page }) => {
    await page.goto('/jsdiff');

    // 先加载一些演示数据
    await page.click('button:has-text("加载文本演示")');

    // 验证数据已加载
    const oldContentTextarea = page.locator('textarea').first();
    const newContentTextarea = page.locator('textarea').nth(1);
    await expect(oldContentTextarea).not.toHaveValue('');
    await expect(newContentTextarea).not.toHaveValue('');

    // 点击清空按钮
    await page.click('button:has-text("清空所有")');

    // 验证数据已清空
    await expect(oldContentTextarea).toHaveValue('');
    await expect(newContentTextarea).toHaveValue('');
  });

  test('应该正确处理多个比较结果的标签页', async ({ page }) => {
    await page.goto('/jsdiff');

    // 进行第一次比较
    await page.click('button:has-text("加载文本演示")');
    await page.click('button:has-text("开始比较")');
    await page.waitForSelector('h2:has-text("文本行差异演示")', {
      timeout: 5000,
    });

    // 进行第二次比较
    await page.click('button:has-text("加载JSON演示")');
    await page.click('button:has-text("开始比较")');
    await page.waitForSelector('h2:has-text("JSON对象差异演示")', {
      timeout: 5000,
    });

    // 检查是否有多个标签页
    const tabs = page.locator('.px-4.py-2.text-sm.rounded-t-lg.border-b-2');
    await expect(tabs).toHaveCount(2);

    // 检查标签页文本
    await expect(tabs.first()).toContainText('文本行差异演示');
    await expect(tabs.nth(1)).toContainText('JSON对象差异演示');

    // 点击第一个标签页
    await tabs.first().click();
    await expect(page.locator('h2')).toContainText('文本行差异演示');

    // 点击第二个标签页
    await tabs.nth(1).click();
    await expect(page.locator('h2')).toContainText('JSON对象差异演示');
  });
});
