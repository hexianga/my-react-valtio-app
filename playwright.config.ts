import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 测试配置文件
 *
 * 配置说明：
 * - 测试文件位置：tests/ 目录下的 .spec.ts 文件
 * - 支持三种浏览器：Chromium、Firefox、WebKit
 * - 开发环境下启动本地服务器
 * - 生产环境下测试构建后的静态文件
 */
export default defineConfig({
  // 测试目录
  testDir: './tests',

  // 全局测试配置
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // 报告配置
  reporter: [
    // ['html', { outputFolder: 'playwright-report' }],
    ['html', { open: 'always', host: '0.0.0.0', port: 9323 }],
    // ['json', { outputFile: 'test-results/results.json' }],
    // ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // 输出目录
  outputDir: 'test-results/',

  // 全局测试配置
  use: {
    // 基础 URL
    baseURL: 'http://127.0.0.1:3004',

    // 测试追踪
    trace: 'on-first-retry',

    // 截图配置https://steamer.sankuai.com/api/applicationViews/2?needSource=true&needRequirement=true&%24sort=created_at&env=%24like%3Aproduction&%24limit=10&%24skip=0
    screenshot: 'only-on-failure',

    // 视频录制
    video: 'retain-on-failure',

    // 浏览器配置
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // 等待策略
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // 浏览器项目配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // // 移动端测试
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // 本地开发服务器配置
  // webServer: {
  //   command: 'pnpm start',
  //   port: 3004,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
