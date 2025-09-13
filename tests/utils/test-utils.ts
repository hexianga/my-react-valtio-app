import { Page, Locator } from '@playwright/test';

/**
 * 测试工具函数集合
 */
export class TestUtils {
  constructor(private page: Page) {}

  /**
   * 等待元素出现并可见
   */
  async waitForElement(selector: string, timeout = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * 安全点击元素（等待元素可见后点击）
   */
  async safeClick(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click();
  }

  /**
   * 安全填写输入框
   */
  async safeFill(selector: string, value: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.clear();
    await element.fill(value);
  }

  /**
   * 检查元素是否存在
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page
        .locator(selector)
        .waitFor({ state: 'attached', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 截图并保存
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * 等待网络空闲
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 模拟移动设备
   */
  async simulateMobile(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.emulateMedia({ media: 'screen' });
  }

  /**
   * 模拟平板设备
   */
  async simulateTablet(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.page.emulateMedia({ media: 'screen' });
  }

  /**
   * 模拟桌面设备
   */
  async simulateDesktop(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.emulateMedia({ media: 'screen' });
  }

  /**
   * 检查页面性能
   */
  async checkPagePerformance(): Promise<{
    loadTime: number;
    resources: number;
  }> {
    const startTime = Date.now();
    await this.page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    const resources = await this.page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    return { loadTime, resources };
  }

  /**
   * 模拟慢速网络
   */
  async simulateSlowNetwork(): Promise<void> {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50KB/s
      uploadThroughput: 20 * 1024, // 20KB/s
      latency: 500, // 500ms 延迟
    });
  }

  /**
   * 检查可访问性
   */
  async checkAccessibility(): Promise<void> {
    // 检查是否有合适的 alt 文本
    const images = this.page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');

      if (src && !alt) {
        console.warn(`图片缺少 alt 属性: ${src}`);
      }
    }

    // 检查表单标签
    const inputs = this.page.locator(
      'input[type="text"], input[type="email"], textarea'
    );
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');

      if (id) {
        const label = this.page.locator(`label[for="${id}"]`);
        const hasLabel = (await label.count()) > 0;

        if (!hasLabel) {
          console.warn(`输入框缺少标签: ${name || id}`);
        }
      }
    }
  }

  /**
   * 等待 API 请求完成
   */
  async waitForApiRequest(urlPattern: string): Promise<void> {
    await this.page.waitForResponse(
      response =>
        response.url().includes(urlPattern) && response.status() === 200
    );
  }

  /**
   * 清理测试数据
   */
  async cleanup(): Promise<void> {
    // 清理 localStorage
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // 清理 cookies
    await this.page.context().clearCookies();
  }
}

/**
 * 页面对象模式基类
 */
export class BasePage {
  constructor(protected page: Page) {}

  get utils(): TestUtils {
    return new TestUtils(this.page);
  }

  async navigate(path = '/'): Promise<void> {
    await this.page.goto(path);
    await this.utils.waitForNetworkIdle();
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }
}

/**
 * 表单页面对象
 */
export class FormPage extends BasePage {
  get nameInput(): Locator {
    return this.page.locator('input[name="name"]');
  }

  get emailInput(): Locator {
    return this.page.locator('input[name="email"]');
  }

  get submitButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  async fillForm(name: string, email: string): Promise<void> {
    if (await this.nameInput.isVisible()) {
      await this.nameInput.fill(name);
    }
    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(email);
    }
  }

  async submitForm(): Promise<void> {
    if (await this.submitButton.isVisible()) {
      await this.submitButton.click();
    }
  }
}
