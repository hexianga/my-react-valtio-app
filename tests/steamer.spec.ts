import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { JSDiffTool } from '../src/utils/jsdiff-tool';
import { LatestGrayVersion, LatestVersion } from './mock';
import { htmlBody } from './report-html/template';
import { generateDiffView } from './report-html/generate-diff-view';

// 提取公共的组件处理函数
const processComponents = (components: any[]) => {
  return components
    .map(item => {
      const { exact, path, id, version, linkType, name, type } = item;
      return { exact, path, id, version, linkType, name, type };
    })
    .sort((a, b) => a.id - b.id);
};

/**
 * API 相关测试
 */
test.describe('Steamer 部署自动化测试工具', () => {
  /**
   * JSON差异比较测试用例
   */
  test('JSON差异比较和可视化', { tag: ['@JSON Diff'] }, async () => {
    // 定义需要比较的模块
    const modules = [
      {
        key: 'template_config',
        name: '宿主模板',
        oldData: LatestVersion.template_config,
        newData: LatestGrayVersion.template_config,
      },
      {
        key: 'middlewares',
        name: '中间件',
        oldData: LatestVersion.middlewares,
        newData: LatestGrayVersion.middlewares,
      },
      {
        key: 'services',
        name: '服务模块',
        oldData: LatestVersion.services,
        newData: LatestGrayVersion.services,
      },
      {
        key: 'components',
        name: '业务模块',
        oldData: processComponents(LatestVersion.components),
        newData: processComponents(LatestGrayVersion.components),
      },
    ];

    // 使用map方法处理每个模块的差异比较
    const diffResults = modules.map(module => {
      // 使用JSDiffTool比较两个JSON对象
      const resultId = JSDiffTool.diffJson(
        module.oldData,
        module.newData,
        module.name
      );

      // 获取差异结果
      const diffResult = JSDiffTool.getResult(resultId);
      expect(diffResult).toBeTruthy();

      return {
        key: module.key,
        name: module.name,
        result: diffResult,
      };
    });

    // 创建变更摘要
    const summaryItems = diffResults
      .map(item => {
        const hasChanges =
          item.result &&
          (item.result.stats.additions > 0 || item.result.stats.deletions > 0);
        const totalChanges = item.result
          ? item.result.stats.additions + item.result.stats.deletions
          : 0;
        return `
        <div class="summary-item ${hasChanges ? 'has-changes' : 'no-changes'}">
          <div class="summary-module">${item.name}</div>
          <div class="summary-status">
            ${
              hasChanges
                ? `<span class="status-changed">有变更 (${totalChanges})</span>`
                : '<span class="status-unchanged">无变更</span>'
            }
          </div>
          <div class="summary-details">
            ${
              item.result
                ? `<span class="additions">+${item.result.stats.additions}</span> / <span class="deletions">-${item.result.stats.deletions}</span>`
                : ''
            }
          </div>
        </div>
      `;
      })
      .join('');

    const summaryHtml = `
      <div class="change-summary">
        <h2>变更摘要</h2>
        <div class="summary-container">
          ${summaryItems}
        </div>
      </div>
    `;

    // 使用map方法生成HTML报告
    const htmlReports = diffResults
      .map(item => (item.result ? generateDiffView(item.result, item.key) : ''))
      .filter(Boolean); // 过滤掉空字符串

    // 创建模块内容
    const moduleContents = modules
      .map((module, index) => {
        const report = htmlReports[index] || '';
        return `<div id="${module.key}-content" class="module-content ${index === 0 ? 'active' : ''}">
        <div class="${module.key}">${report}</div>
      </div>`;
      })
      .join('');

    // 创建模块标签
    const moduleTabs = modules
      .map((module, index) => {
        const hasChanges =
          diffResults[index].result &&
          (diffResults[index].result.stats.additions > 0 ||
            diffResults[index].result.stats.deletions > 0);
        const changeIndicator = hasChanges
          ? `<span class="change-indicator">•</span>`
          : '';
        return `<div class="module-tab ${index === 0 ? 'active' : ''} ${hasChanges ? 'has-changes' : ''}" data-module="${module.key}" onclick="switchModule('${module.key}')">${module.name}${changeIndicator}</div>`;
      })
      .join('');

    const mainModuleTabs = `<div class="module-tabs">${moduleTabs}</div>`;

    // 合并所有HTML报告
    const combinedHtmlReport = htmlBody(
      summaryHtml,
      mainModuleTabs,
      moduleContents
    );

    // 保存HTML报告到文件
    const reportPath = path.join(
      process.cwd(),
      'test-results',
      'json-diff-report.html'
    );

    // 确保目录存在
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportPath, combinedHtmlReport);

    console.log(`JSON差异比较报告已生成: ${reportPath}`);
  });
});
