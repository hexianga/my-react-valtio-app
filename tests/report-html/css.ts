// 基础样式
const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fafafa;
  }
  header {
    margin-bottom: 30px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2c3e50;
  }
  h2 {
    font-size: 22px;
    font-weight: 500;
    margin: 0px 0 15px;
    color: #34495e;
  }
`;

// 变更摘要样式
const summaryStyles = `
  /* 变更摘要样式 */
  .change-summary {
    margin: 25px 0;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border-left: 4px solid #3498db;
  }
  .summary-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .summary-item {
    flex: 1;
    min-width: 250px;
    padding: 18px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
  }
  .summary-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
  .summary-item.has-changes {
    background-color: #fff8e6;
    border-left: 4px solid #f0b400;
  }
  .summary-item.no-changes {
    background-color: #f0f7f0;
    border-left: 4px solid #28a745;
  }
  .summary-module {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
    color: #2c3e50;
  }
  .summary-status {
    margin-bottom: 8px;
    font-size: 15px;
  }
  .status-changed {
    color: #e67e22;
    font-weight: 500;
  }
  .status-unchanged {
    color: #27ae60;
    font-weight: 500;
  }
  .summary-details {
    font-size: 15px;
    display: flex;
    gap: 15px;
  }
  .change-indicator {
    display: inline-block;
    margin-left: 6px;
    color: #e67e22;
    font-size: 20px;
    font-weight: bold;
  }
`;

// 统计信息样式
const statsStyles = `
  .stats {
    display: flex;
    gap: 25px;
    margin-bottom: 10px;
    padding: 18px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .stat-item {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 6px;
    background-color: #f8f9fa;
  }
  .stat-value {
    font-size: 26px;
    font-weight: bold;
  }
  .stat-label {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
    margin-left: 4px;
  }
  .additions { color: #28a745; }
  .deletions { color: #dc3545; }
  .total { color: #0366d6; }
`;

// 标签页样式
const tabStyles = `
  .tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    background-color: #f8f9fa;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }
  .tab {
    padding: 12px 24px;
    cursor: pointer;
    border: 1px solid transparent;
    border-bottom: none;
    margin-bottom: -1px;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  .tab:hover {
    background-color: #e9ecef;
  }
  .tab.active {
    border-color: #ddd;
    border-radius: 8px 8px 0 0;
    background-color: white;
    border-bottom: 1px solid white;
    color: #3498db;
  }
  .tab-content {
    display: none;
    background-color: #fff;
    border-radius: 0 0 8px 8px;
    padding: 5px;
  }
  .tab-content.active {
    display: block;
  }
`;

// 模块标签样式
const moduleTabStyles = `
  /* 模块标签样式 */
  .module-tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin: 25px 0 20px;
    background-color: #f8f9fa;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }
  .module-tab {
    padding: 15px 30px;
    cursor: pointer;
    border: 1px solid transparent;
    margin-right: 2px;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
  }
  .module-tab:hover {
    background-color: #e9ecef;
  }
  .module-tab.active {
    background-color: white;
    border-color: #ddd;
    border-bottom-color: white;
    margin-bottom: -1px;
    border-radius: 8px 8px 0 0;
    color: #3498db;
    font-weight: 600;
  }
  .module-tab.has-changes {
    color: #e67e22;
  }
  .module-tab.has-changes.active {
    color: #d35400;
  }
  .module-content {
    display: none;
    margin-bottom: 30px;
    background-color: #fff;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    padding: 20px;
  }
  .module-content.active {
    display: block;
  }
`;

// 分割视图样式
const splitViewStyles = `
  /* 分割视图样式 */
  .split-view {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .split-header {
    background-color: #f1f1f1;
    border-bottom: 1px solid #ddd;
  }
  .split-header-row {
    display: flex;
  }
  .split-header-cell {
    flex: 1;
    padding: 10px 15px;
    font-weight: 600;
    border-right: 1px solid #ddd;
  }
  .split-header-cell:last-child {
    border-right: none;
  }
  .split-content {
    max-height: 800px;
    overflow-y: auto;
    font-size: 12px;
  }
  .split-row {
    display: flex;
  }
  .split-cell {
    flex: 1;
    padding: 0px 15px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    white-space: pre-wrap;
    border-right: 1px solid #ddd;
    position: relative;
    line-height: 1.5;
  }
  .split-cell:last-child {
    border-right: none;
  }
  .line-number {
    color: #999;
    text-align: right;
    padding-right: 10px;
    user-select: none;
    border-right: 1px solid #ddd;
    margin-right: 10px;
    min-width: 40px;
    display: inline-block;
  }
  .removed { background-color: #ffeef0; }
  .removed .content { color: #b31d28; }
  .added { background-color: #e6ffed; }
  .added .content { color: #22863a; }
  .empty { background-color: #f6f8fa; }
`;

// 统一视图样式
const unifiedViewStyles = `
  /* 统一视图样式 */
  .unified-view {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    font-size: 12px;
  }
  .unified-line {
    padding: 0px 15px;
    white-space: pre-wrap;
    display: flex;
    line-height: 1.5;
  }
  .unified-line.added { background-color: #e6ffed; }
  .unified-line.removed { background-color: #ffeef0; }
  .unified-line.context { background-color: #f6f8fa; }
  .line-numbers {
    color: #999;
    text-align: right;
    padding-right: 10px;
    user-select: none;
    border-right: 1px solid #ddd;
    margin-right: 10px;
    min-width: 80px;
    display: flex;
    justify-content: space-between;
  }
  .line-split {
    margin: 0px 0px;
  }
  .line-content {
    flex: 1;
  }
  .line-content.added { color: #22863a; }
  .line-content.removed { color: #b31d28; }
`;

// 高亮和响应式样式
const highlightAndResponsiveStyles = `
  /* 高亮样式 */
  .highlight-added {
    background-color: #acf2bd;
    color: #1a7f37;
    font-weight: 500;
  }
  .highlight-removed {
    background-color: #ffd7d5;
    color: #cf222e;
    font-weight: 500;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .split-view {
      flex-direction: column;
    }
    .split-header-row, .split-row {
      flex-direction: column;
    }
    .split-cell, .split-header-cell {
      border-right: none;
      border-bottom: 1px solid #ddd;
    }
    .split-cell:last-child, .split-header-cell:last-child {
      border-bottom: none;
    }
    .summary-container {
      flex-direction: column;
    }
  }
`;

// 将所有样式拼接在一起
export const styles = `
  ${baseStyles}
  ${summaryStyles}
  ${statsStyles}
  ${tabStyles}
  ${moduleTabStyles}
  ${splitViewStyles}
  ${unifiedViewStyles}
  ${highlightAndResponsiveStyles}
`;
