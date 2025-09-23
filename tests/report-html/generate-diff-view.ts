import { DiffResult } from "@/utils/jsdiff-tool";
import { escapeHtml } from "./template";

/**
 * 生成包含内联CSS和JS的HTML报告
 * @param diffResult 差异比较结果
 * @returns HTML字符串
 */
export function generateDiffView(diffResult: DiffResult, type: string): string {
  // 生成分割视图HTML
  let splitViewHtml = '';
  if (diffResult.splitView) {
    splitViewHtml = `
      <div class="split-view">
        <div class="split-header">
          <div class="split-header-row">
            <div class="split-header-cell">
              <span style="color: #b31d28;">➖</span> 原始内容
            </div>
            <div class="split-header-cell">
              <span style="color: #22863a;">➕</span> 新内容
            </div>
          </div>
        </div>
        <div class="split-content">
    `;

    // 遍历行
    const leftLines = diffResult.splitView.leftLines;
    const rightLines = diffResult.splitView.rightLines;

    for (let i = 0; i < leftLines.length; i++) {
      const leftLine = leftLines[i];
      const rightLine = rightLines[i];

      splitViewHtml += `<div class="split-row">`;

      // 左侧单元格
      splitViewHtml += `<div class="split-cell ${leftLine.type}">`;
      if (leftLine.lineNumber) {
        splitViewHtml += `<span class="line-number">${leftLine.lineNumber}</span>`;
      } else {
        splitViewHtml += `<span class="line-number"></span>`;
      }

      // 处理高亮范围
      if (leftLine.highlightRanges && leftLine.highlightRanges.length > 0) {
        const content = leftLine.content;
        let result = '';
        let lastIndex = 0;

        leftLine.highlightRanges.forEach(range => {
          // 添加高亮前的普通文本
          if (lastIndex < range.start) {
            result += escapeHtml(content.substring(lastIndex, range.start));
          }

          // 添加高亮文本
          const highlightClass =
            leftLine.type === 'removed' ? 'highlight-removed' : '';
          result += `<span class="${highlightClass}">${escapeHtml(content.substring(range.start, range.end))}</span>`;

          lastIndex = range.end;
        });

        // 添加剩余的普通文本
        if (lastIndex < content.length) {
          result += escapeHtml(content.substring(lastIndex));
        }

        splitViewHtml += `<span class="content">${result}</span>`;
      } else {
        splitViewHtml += `<span class="content">${escapeHtml(leftLine.content)}</span>`;
      }

      splitViewHtml += `</div>`;

      // 右侧单元格
      splitViewHtml += `<div class="split-cell ${rightLine.type}">`;
      if (rightLine.lineNumber) {
        splitViewHtml += `<span class="line-number">${rightLine.lineNumber}</span>`;
      } else {
        splitViewHtml += `<span class="line-number"></span>`;
      }

      // 处理高亮范围
      if (rightLine.highlightRanges && rightLine.highlightRanges.length > 0) {
        const content = rightLine.content;
        let result = '';
        let lastIndex = 0;

        rightLine.highlightRanges.forEach(range => {
          // 添加高亮前的普通文本
          if (lastIndex < range.start) {
            result += escapeHtml(content.substring(lastIndex, range.start));
          }

          // 添加高亮文本
          const highlightClass =
            rightLine.type === 'added' ? 'highlight-added' : '';
          result += `<span class="${highlightClass}">${escapeHtml(content.substring(range.start, range.end))}</span>`;

          lastIndex = range.end;
        });

        // 添加剩余的普通文本
        if (lastIndex < content.length) {
          result += escapeHtml(content.substring(lastIndex));
        }

        splitViewHtml += `<span class="content">${result}</span>`;
      } else {
        splitViewHtml += `<span class="content">${escapeHtml(rightLine.content)}</span>`;
      }

      splitViewHtml += `</div>`;
      splitViewHtml += `</div>`;
    }

    splitViewHtml += `
        </div>
      </div>
    `;
  }

  // 生成统一视图HTML
  let unifiedViewHtml = '';
  if (diffResult.unifiedView) {
    unifiedViewHtml = `
      <div class="unified-view">
    `;

    diffResult.unifiedView.forEach(line => {
      unifiedViewHtml += `<div class="unified-line ${line.type}">`;

      // 行号
      unifiedViewHtml += `<span class="line-numbers">`;
      if (line.lineNumber.old !== null) {
        unifiedViewHtml += line.lineNumber.old;
      } else {
        unifiedViewHtml += ' ';
      }
      unifiedViewHtml += '<span class="line-split">';
      if (line.lineNumber.old !== null && line.lineNumber.new !== null) {
        unifiedViewHtml += ' : ';
      }
      unifiedViewHtml += '</span>';
      if (line.lineNumber.new !== null) {
        unifiedViewHtml += line.lineNumber.new;
      } else {
        unifiedViewHtml += ' ';
      }
      unifiedViewHtml += `</span>`;

      // 内容
      unifiedViewHtml += `<span class="line-content ${line.type}">${escapeHtml(line.content)}</span>`;

      unifiedViewHtml += `</div>`;
    });

    unifiedViewHtml += `
      </div>
    `;
  }

// <header>
//     <h1>${diffResult.title}</h1>
//     <p>生成时间: ${new Date(diffResult.timestamp).toLocaleString()}</p>
// </header>

 return `
  <div class="${type}">
    <div class="stats">
        <div class="stat-item">
        <div class="stat-value additions">+${diffResult.stats.additions}</div>
        <div class="stat-label">新增</div>
        </div>
        <div class="stat-item">
        <div class="stat-value deletions">-${diffResult.stats.deletions}</div>
        <div class="stat-label">删除</div>
        </div>
        <div class="stat-item">
        <div class="stat-value total">${diffResult.stats.additions + diffResult.stats.deletions || 0}</div>
        <div class="stat-label">总变更</div>
        </div>
    </div>

    <div class="tabs">
        <div class="tab active" data-tab="${type}-split-view-tab" onclick="switchTab('${type}-split-view-tab')">双栏视图</div>
        <div class="tab" data-tab="${type}-unified-view-tab" onclick="switchTab('${type}-unified-view-tab')">统一视图</div>
    </div>

    <div id="${type}-split-view-tab" class="tab-content active">
        ${splitViewHtml}
    </div>

    <div id="${type}-unified-view-tab" class="tab-content">
        ${unifiedViewHtml}
    </div>
  </div>`;
}
