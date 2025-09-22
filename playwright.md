# Playwright 测试指南

## 为什么每次运行测试都会启动项目？

Playwright 测试框架在运行测试时会自动启动项目的开发服务器，这是由以下原因导致的：

### 1. WebServer 配置

Playwright 配置文件中通常包含 `webServer` 部分，这会指示 Playwright 在运行测试前启动一个 Web 服务器。这样做是为了确保测试环境与实际应用环境一致，并且可以测试真实的前端交互。

```javascript
// playwright.config.ts 中的典型配置
webServer: {
  command: 'npm run start',
  port: 3000,
  reuseExistingServer: !process.env.CI,
},
```

### 2. 端到端测试的需求

Playwright 主要用于端到端(E2E)测试，这类测试需要一个运行中的应用程序来验证完整的用户流程。启动项目确保了测试可以在真实环境中运行，而不仅仅是模拟环境。

### 3. 自动化测试流程

自动启动项目简化了测试流程，使测试人员不需要手动启动服务器，这在持续集成(CI)环境中尤为重要。

### 4. 端口冲突问题

当我们看到以下错误时，通常是因为 Playwright 尝试启动项目，但指定的端口已被占用：

```
Error: listen EADDRINUSE: address already in use :::3000
```

这表明端口 3000 已经被另一个进程使用，可能是之前启动的开发服务器或其他应用程序。

### 解决方案

#### 1. 使用不同的端口

可以通过 `--webserver-port` 参数指定不同的端口：

```bash
npx playwright test --webserver-port=3006
```

#### 2. 重用现有服务器

在 `playwright.config.ts` 中设置 `reuseExistingServer: true`，这样如果服务器已经运行，Playwright 将不会尝试启动新的服务器。

#### 3. 跳过启动 Web 服务器

对于不需要完整前端环境的测试（如 API 测试或单元测试），可以完全跳过启动 Web 服务器：

```bash
# 使用环境变量跳过启动浏览器和服务器
PLAYWRIGHT_SKIP_BROWSER_LAUNCH=1 npx playwright test

# 或者修改配置文件中的 webServer 部分
```

#### 4. 使用 127.0.0.1 替代 localhost

如果遇到 DNS 解析问题（如 `Error: getaddrinfo ENOTFOUND localhost`），可以在配置中使用 IP 地址 `127.0.0.1` 替代 `localhost`：

```javascript
// 在 webpack.dev.js 中
proxy: {
  '/api': {
    target: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:3001',
    changeOrigin: true,
    secure: false,
  },
},
```

## 执行不需要启动项目的测试脚本

如果您的测试不需要启动 Web 服务器（例如纯 API 测试、单元测试或独立功能测试），可以使用以下方法：

### 1. 修改 Playwright 配置

在 `playwright.config.ts` 中禁用 webServer 配置：

```javascript
// playwright.config.ts
export default defineConfig({
  // 注释掉或删除 webServer 配置
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },

  // 或者创建一个专门的配置文件 playwright.api.config.ts 不包含 webServer 配置
});
```

### 2. 使用环境变量跳过 Web 服务器

```bash
# 完全跳过启动 Web 服务器
PLAYWRIGHT_SKIP_SERVER=1 npx playwright test

# 跳过启动浏览器（适用于 API 测试）
PLAYWRIGHT_SKIP_BROWSER_LAUNCH=1 npx playwright test
```

### 3. 使用专用的测试命令

为不同类型的测试创建专用的 npm 脚本：

```json
// package.json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:api": "PLAYWRIGHT_SKIP_SERVER=1 playwright test tests/api/",
    "test:unit": "PLAYWRIGHT_SKIP_BROWSER_LAUNCH=1 playwright test tests/unit/",
    "test:json-diff": "node tests/json-diff-standalone.js"
  }
}
```

### 4. 创建独立的测试脚本

对于完全独立的功能（如 JSON 差异比较），可以创建不依赖于 Playwright 测试框架的独立脚本：

```javascript
// json-diff-standalone.js
const fs = require('fs');
const path = require('path');
const { JSDiffTool } = require('./src/utils/jsdiff-tool');

async function runJsonDiff() {
  // 测试代码...
  const diffResultId = JSDiffTool.diffJson(oldData, newData, 'JSON比较');
  const result = JSDiffTool.getResult(diffResultId);

  // 生成报告...
  fs.writeFileSync('./test-results/diff-report.html', generateReport(result));
}

runJsonDiff().catch(console.error);
```

然后直接使用 Node.js 运行：

```bash
node json-diff-standalone.js
```

### 5. 使用特定的测试配置文件

```bash
# 使用特定的配置文件运行测试
npx playwright test --config=playwright.api.config.ts
```

## 为什么测试会多次执行并生成多个输出

当您运行 Playwright 测试时，可能会看到类似以下的输出：

```
npx playwright test --grep "@JSON Diff"

Running 5 tests using 5 workers
…] › tests/api.spec.ts:125:7 › API 集成测试 › JSON差异比较和可视化 @JSON Diff
JSON差异比较报告已生成: /Users/hexiang09/demo/my-react-valtio-app/test-results/json-diff-report.html
…] › tests/api.spec.ts:125:7 › API 集成测试 › JSON差异比较和可视化 @JSON Diff
JSON差异比较报告已生成: /Users/hexiang09/demo/my-react-valtio-app/test-results/json-diff-report.html
…] › tests/api.spec.ts:125:7 › API 集成测试 › JSON差异比较和可视化 @JSON Diff
JSON差异比较报告已生成: /Users/hexiang09/demo/my-react-valtio-app/test-results/json-diff-report.html
…] › tests/api.spec.ts:125:7 › API 集成测试 › JSON差异比较和可视化 @JSON Diff
JSON差异比较报告已生成: /Users/hexiang09/demo/my-react-valtio-app/test-results/json-diff-report.html
…] › tests/api.spec.ts:125:7 › API 集成测试 › JSON差异比较和可视化 @JSON Diff
JSON差异比较报告已生成: /Users/hexiang09/demo/my-react-valtio-app/test-results/json-diff-report.html
  5 passed (631ms)
```

这种情况发生的原因有以下几点：

### 1. 项目配置中的多浏览器设置

Playwright 默认配置通常包含多个浏览器项目（projects），例如：

```javascript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

当您运行测试时，Playwright 会在每个配置的浏览器项目中执行相同的测试，这就是为什么您看到"Running 5 tests using 5 workers"并且同一个测试被执行了5次。

### 2. 解决方法

#### 指定单一浏览器项目

如果您只想在一个浏览器中运行测试，可以使用 `--project` 参数：

```bash
npx playwright test --grep "@JSON Diff" --project=chromium
```

#### 修改配置文件

您也可以修改 `playwright.config.ts` 文件，减少项目数量：

```javascript
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // 注释掉其他浏览器项目
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

#### 为特定测试设置项目

您可以在测试级别指定项目：

```typescript
// 只在 Chromium 中运行此测试
test.describe('API 集成测试', () => {
  test.use({ project: 'chromium' });

  test('JSON差异比较和可视化', { tag: ["@JSON Diff"] }, async () => {
    // 测试代码...
  });
});
```

#### 避免文件覆盖

如果您在测试中生成文件，可以使用唯一的文件名避免覆盖：

```typescript
const reportPath = path.join(
  process.cwd(),
  'test-results',
  `json-diff-report-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.html`
);
```

或者使用浏览器名称作为文件名的一部分：

```typescript
test('JSON差异比较和可视化', async ({ browserName }) => {
  // ...
  const reportPath = path.join(
    process.cwd(),
    'test-results',
    `json-diff-report-${browserName}.html`
  );
  // ...
});
```

### 3. 使用 workers 参数

您也可以限制并行执行的工作进程数量：

```bash
npx playwright test --grep "@JSON Diff" --workers=1
```

这将使测试按顺序执行，而不是并行执行，但仍会在每个配置的浏览器项目中运行测试。

## 常用 Playwright 测试命令

```bash
# 运行所有测试
npx playwright test

# 运行特定文件的测试
npx playwright test tests/api.spec.ts

# 运行特定测试用例（使用测试名称）
npx playwright test -g "JSON差异比较和可视化"

# 运行带有特定标签的测试
npx playwright test --grep @json-diff

# 指定浏览器运行测试
npx playwright test --project=chromium

# 在有界面的浏览器中运行测试（可视化）
npx playwright test --headed

# 在调试模式下运行测试
npx playwright test --debug

# 生成 HTML 报告
npx playwright test --reporter=html

# 查看最近的 HTML 报告
npx playwright show-report
```
