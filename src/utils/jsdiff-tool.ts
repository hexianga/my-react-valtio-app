import { proxy, snapshot } from 'valtio';
import * as Diff from 'diff';

// Diff 结果类型定义
export interface DiffChange extends Diff.Change {
  lineNumber?: number;
  type: 'added' | 'removed' | 'unchanged';
}

export interface UnifiedDiffLine {
  lineNumber: {
    old: number | null;
    new: number | null;
  };
  type: 'added' | 'removed' | 'unchanged' | 'context';
  content: string;
  changeType?: 'word' | 'char'; // 标识内部变化类型
  innerChanges?: Array<{
    type: 'added' | 'removed' | 'unchanged';
    content: string;
  }>;
}

export interface SplitDiffView {
  leftLines: Array<{
    lineNumber: number | null;
    content: string;
    type: 'removed' | 'unchanged' | 'empty';
    highlightRanges?: Array<{ start: number; end: number }>;
  }>;
  rightLines: Array<{
    lineNumber: number | null;
    content: string;
    type: 'added' | 'unchanged' | 'empty';
    highlightRanges?: Array<{ start: number; end: number }>;
  }>;
}

export interface DiffResult {
  id: string;
  title: string;
  oldContent: string;
  newContent: string;
  changes: DiffChange[];
  unifiedView: UnifiedDiffLine[]; // 统一视图数据
  splitView: SplitDiffView; // 新增双栏视图数据
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  timestamp: number;
  diffType: 'chars' | 'words' | 'lines' | 'json' | 'css' | 'sentences';
}

// 创建 valtio store 来管理 diff 状态
export const diffStore = proxy({
  results: [] as DiffResult[],
  currentResult: null as DiffResult | null,
  isLoading: false,
  error: null as string | null,
  settings: {
    ignoreWhitespace: false,
    ignoreCase: false,
    contextLines: 3,
    showInlineDiff: true,
    viewMode: 'unified' as 'unified' | 'split', // 新增视图模式
  },
});

// JSDiff 工具类
export class JSDiffTool {
  private static generateId(): string {
    return `diff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static normalizeContent(
    content: string,
    ignoreCase: boolean = false
  ): string {
    let normalized = content;
    if (ignoreCase) {
      normalized = normalized.toLowerCase();
    }
    return normalized;
  }

  private static generateUnifiedView(
    oldContent: string,
    newContent: string,
    changes: DiffChange[],
    diffType: string
  ): UnifiedDiffLine[] {
    const unifiedLines: UnifiedDiffLine[] = [];
    let oldLineNum = 1;
    let newLineNum = 1;

    if (diffType === 'lines') {
      // 行模式：按行处理
      changes.forEach(change => {
        const lines = change.value.split('\n').filter((line, index, arr) => {
          // 过滤掉最后一个空行（如果存在）
          return !(index === arr.length - 1 && line === '');
        });

        lines.forEach(line => {
          if (change.added) {
            unifiedLines.push({
              lineNumber: { old: null, new: newLineNum },
              type: 'added',
              content: line,
            });
            newLineNum++;
          } else if (change.removed) {
            unifiedLines.push({
              lineNumber: { old: oldLineNum, new: null },
              type: 'removed',
              content: line,
            });
            oldLineNum++;
          } else {
            unifiedLines.push({
              lineNumber: { old: oldLineNum, new: newLineNum },
              type: 'unchanged',
              content: line,
            });
            oldLineNum++;
            newLineNum++;
          }
        });
      });
    } else {
      // 非行模式：按单词/字符处理，合并到一行显示
      const currentLine: UnifiedDiffLine = {
        lineNumber: { old: 1, new: 1 },
        type: 'context',
        content: '',
        changeType: diffType as 'word' | 'char',
        innerChanges: [],
      };

      changes.forEach(change => {
        const type = change.added
          ? 'added'
          : change.removed
            ? 'removed'
            : 'unchanged';
        currentLine.innerChanges!.push({
          type,
          content: change.value,
        });
        currentLine.content += change.value;
      });

      unifiedLines.push(currentLine);
    }

    return unifiedLines;
  }

  private static generateSplitView(
    oldContent: string,
    newContent: string,
    changes: DiffChange[],
    diffType: string
  ): SplitDiffView {
    const leftLines: SplitDiffView['leftLines'] = [];
    const rightLines: SplitDiffView['rightLines'] = [];
    
    if (diffType === 'lines') {
      let oldLineNum = 1;
      let newLineNum = 1;
      
      // 预处理变更，将连续的相同类型的变更合并
      const mergedChanges: DiffChange[] = [];
      let currentChange: DiffChange | null = null;

      changes.forEach(change => {
        if (!currentChange) {
          currentChange = { ...change };
          mergedChanges.push(currentChange);
        } else if (
          (change.added && currentChange.added) ||
          (change.removed && currentChange.removed)
        ) {
          // 如果当前变更与上一个变更类型相同（都是添加或都是删除），则合并
          currentChange.value += change.value;
        } else {
          // 否则添加为新的变更
          currentChange = { ...change };
          mergedChanges.push(currentChange);
        }
      });

      // 使用合并后的变更生成视图
      mergedChanges.forEach(change => {
        const lines = change.value.split('\n').filter((line, index, arr) => {
          return !(index === arr.length - 1 && line === '');
        });
        
        if (change.added) {
          // 只在右侧显示新增的行
          lines.forEach(line => {
            leftLines.push({
              lineNumber: null,
              content: '',
              type: 'empty'
            });
            rightLines.push({
              lineNumber: newLineNum,
              content: line,
              type: 'added'
            });
            newLineNum++;
          });
        } else if (change.removed) {
          // 只在左侧显示删除的行
          lines.forEach(line => {
            leftLines.push({
              lineNumber: oldLineNum,
              content: line,
              type: 'removed'
            });
            rightLines.push({
              lineNumber: null,
              content: '',
              type: 'empty'
            });
            oldLineNum++;
          });
        } else {
          // 双侧都显示未变化的行
          lines.forEach(line => {
            leftLines.push({
              lineNumber: oldLineNum,
              content: line,
              type: 'unchanged'
            });
            rightLines.push({
              lineNumber: newLineNum,
              content: line,
              type: 'unchanged'
            });
            oldLineNum++;
            newLineNum++;
          });
        }
      });
    } else {
      // 非行模式：合并到一行中，但在双栏中分别显示
      let leftContent = '';
      let rightContent = '';
      const leftHighlights: Array<{ start: number; end: number }> = [];
      const rightHighlights: Array<{ start: number; end: number }> = [];
      
      changes.forEach(change => {
        if (change.removed) {
          const start = leftContent.length;
          leftContent += change.value;
          leftHighlights.push({ start, end: leftContent.length });
        } else if (change.added) {
          const start = rightContent.length;
          rightContent += change.value;
          rightHighlights.push({ start, end: rightContent.length });
        } else {
          leftContent += change.value;
          rightContent += change.value;
        }
      });
      
      leftLines.push({
        lineNumber: 1,
        content: leftContent,
        type: leftHighlights.length > 0 ? 'removed' : 'unchanged',
        highlightRanges: leftHighlights
      });
      
      rightLines.push({
        lineNumber: 1,
        content: rightContent,
        type: rightHighlights.length > 0 ? 'added' : 'unchanged',
        highlightRanges: rightHighlights
      });
    }
    
    return { leftLines, rightLines };
  }

  private static calculateStats(changes: DiffChange[]): {
    additions: number;
    deletions: number;
    total: number;
  } {
    const additions = changes.filter(c => c.added).length;
    const deletions = changes.filter(c => c.removed).length;
    const total = changes.length;
    return { additions, deletions, total };
  }

  private static processChanges(
    rawChanges: Diff.Change[],
    diffType: string
  ): DiffChange[] {
    let lineNumber = 1;
    return rawChanges.map(change => {
      const processedChange: DiffChange = {
        ...change,
        lineNumber,
        type: change.added ? 'added' : change.removed ? 'removed' : 'unchanged',
      };

      // 根据类型计算行号
      if (diffType === 'lines' && change.value) {
        lineNumber += (change.value.match(/\n/g) || []).length;
      } else if (diffType !== 'chars') {
        lineNumber++;
      }

      return processedChange;
    });
  }

  /**
   * 字符级别差异比较
   */
  static diffChars(
    oldStr: string,
    newStr: string,
    title: string = '字符差异'
  ): string {
    try {
      diffStore.isLoading = true;
      diffStore.error = null;

      const options = {
        ignoreCase: diffStore.settings.ignoreCase,
      };

      const rawChanges = Diff.diffChars(
        this.normalizeContent(oldStr, options.ignoreCase),
        this.normalizeContent(newStr, options.ignoreCase)
      );

      const changes = this.processChanges(rawChanges, 'chars');
      const stats = this.calculateStats(changes);
      const unifiedView = this.generateUnifiedView(
        oldStr,
        newStr,
        changes,
        'chars'
      );

      const splitView = this.generateSplitView(
        oldStr,
        newStr,
        changes,
        'chars'
      );

      const result: DiffResult = {
        id: this.generateId(),
        title,
        oldContent: oldStr,
        newContent: newStr,
        changes,
        unifiedView,
        splitView,
        stats,
        timestamp: Date.now(),
        diffType: 'chars',
      };

      diffStore.results.unshift(result);
      diffStore.currentResult = result;
      diffStore.isLoading = false;

      return result.id;
    } catch (error) {
      diffStore.error = `字符差异比较失败: ${error}`;
      diffStore.isLoading = false;
      throw error;
    }
  }

  /**
   * 单词级别差异比较
   */
  static diffWords(
    oldStr: string,
    newStr: string,
    title: string = '单词差异'
  ): string {
    try {
      diffStore.isLoading = true;
      diffStore.error = null;

      const options = {
        ignoreWhitespace: diffStore.settings.ignoreWhitespace,
        ignoreCase: diffStore.settings.ignoreCase,
      };

      const rawChanges = Diff.diffWords(oldStr, newStr, options);
      const changes = this.processChanges(rawChanges, 'words');
      const stats = this.calculateStats(changes);
      const unifiedView = this.generateUnifiedView(
        oldStr,
        newStr,
        changes,
        'words'
      );

      const splitView = this.generateSplitView(
        oldStr,
        newStr,
        changes,
        'words'
      );

      const result: DiffResult = {
        id: this.generateId(),
        title,
        oldContent: oldStr,
        newContent: newStr,
        changes,
        unifiedView,
        splitView,
        stats,
        timestamp: Date.now(),
        diffType: 'words',
      };

      diffStore.results.unshift(result);
      diffStore.currentResult = result;
      diffStore.isLoading = false;

      return result.id;
    } catch (error) {
      diffStore.error = `单词差异比较失败: ${error}`;
      diffStore.isLoading = false;
      throw error;
    }
  }

  /**
   * 行级别差异比较
   */
  static diffLines(
    oldStr: string,
    newStr: string,
    title: string = '行差异'
  ): string {
    try {
      diffStore.isLoading = true;
      diffStore.error = null;

      const options = {
        ignoreWhitespace: diffStore.settings.ignoreWhitespace,
        newlineIsToken: true,
      };

      const rawChanges = Diff.diffLines(oldStr, newStr, options);
      const changes = this.processChanges(rawChanges, 'lines');
      const stats = this.calculateStats(changes);
      const unifiedView = this.generateUnifiedView(
        oldStr,
        newStr,
        changes,
        'lines'
      );

      const splitView = this.generateSplitView(
        oldStr,
        newStr,
        changes,
        'lines'
      );

      const result: DiffResult = {
        id: this.generateId(),
        title,
        oldContent: oldStr,
        newContent: newStr,
        changes,
        unifiedView,
        splitView,
        stats,
        timestamp: Date.now(),
        diffType: 'lines',
      };

      diffStore.results.unshift(result);
      diffStore.currentResult = result;
      diffStore.isLoading = false;

      return result.id;
    } catch (error) {
      diffStore.error = `行差异比较失败: ${error}`;
      diffStore.isLoading = false;
      throw error;
    }
  }

  /**
   * JSON 差异比较
   */
  static diffJson(
    oldObj: any,
    newObj: any,
    title: string = 'JSON差异'
  ): string {
    try {
      diffStore.isLoading = true;
      diffStore.error = null;

      const oldStr =
        typeof oldObj === 'string' ? oldObj : JSON.stringify(oldObj, null, 2);
      const newStr =
        typeof newObj === 'string' ? newObj : JSON.stringify(newObj, null, 2);

      // 使用行差异比较而不是JSON差异比较，以便更好地显示JSON差异
      const rawChanges = Diff.diffLines(oldStr, newStr, {
        ignoreWhitespace: diffStore.settings.ignoreWhitespace,
        newlineIsToken: true,
      });

      const changes = this.processChanges(rawChanges, 'lines');
      const stats = this.calculateStats(changes);
      const unifiedView = this.generateUnifiedView(
        oldStr,
        newStr,
        changes,
        'lines'
      );

      const splitView = this.generateSplitView(
        oldStr,
        newStr,
        changes,
        'lines'
      );

      const result: DiffResult = {
        id: this.generateId(),
        title,
        oldContent: oldStr,
        newContent: newStr,
        changes,
        unifiedView,
        splitView,
        stats,
        timestamp: Date.now(),
        diffType: 'json',
      };

      diffStore.results.unshift(result);
      diffStore.currentResult = result;
      diffStore.isLoading = false;

      return result.id;
    } catch (error) {
      diffStore.error = `JSON差异比较失败: ${error}`;
      diffStore.isLoading = false;
      throw error;
    }
  }

  /**
   * CSS 差异比较
   */
  static diffCss(
    oldCss: string,
    newCss: string,
    title: string = 'CSS差异'
  ): string {
    try {
      diffStore.isLoading = true;
      diffStore.error = null;

      const rawChanges = Diff.diffCss(oldCss, newCss);
      const changes = this.processChanges(rawChanges, 'css');
      const stats = this.calculateStats(changes);
      const unifiedView = this.generateUnifiedView(
        oldCss,
        newCss,
        changes,
        'css'
      );

      const splitView = this.generateSplitView(
        oldCss,
        newCss,
        changes,
        'css'
      );

      const result: DiffResult = {
        id: this.generateId(),
        title,
        oldContent: oldCss,
        newContent: newCss,
        changes,
        unifiedView,
        splitView,
        stats,
        timestamp: Date.now(),
        diffType: 'css',
      };

      diffStore.results.unshift(result);
      diffStore.currentResult = result;
      diffStore.isLoading = false;

      return result.id;
    } catch (error) {
      diffStore.error = `CSS差异比较失败: ${error}`;
      diffStore.isLoading = false;
      throw error;
    }
  }

  /**
   * 句子级别差异比较
   */
  static diffSentences(
    oldStr: string,
    newStr: string,
    title: string = '句子差异'
  ): string {
    try {
      diffStore.isLoading = true;
      diffStore.error = null;

      const rawChanges = Diff.diffSentences(oldStr, newStr);
      const changes = this.processChanges(rawChanges, 'sentences');
      const stats = this.calculateStats(changes);
      const unifiedView = this.generateUnifiedView(
        oldStr,
        newStr,
        changes,
        'sentences'
      );

      const splitView = this.generateSplitView(
        oldStr,
        newStr,
        changes,
        'sentences'
      );

      const result: DiffResult = {
        id: this.generateId(),
        title,
        oldContent: oldStr,
        newContent: newStr,
        changes,
        unifiedView,
        splitView,
        stats,
        timestamp: Date.now(),
        diffType: 'sentences',
      };

      diffStore.results.unshift(result);
      diffStore.currentResult = result;
      diffStore.isLoading = false;

      return result.id;
    } catch (error) {
      diffStore.error = `句子差异比较失败: ${error}`;
      diffStore.isLoading = false;
      throw error;
    }
  }

  /**
   * 创建补丁
   */
  static createPatch(
    fileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string
  ): string {
    return Diff.createPatch(fileName, oldStr, newStr, oldHeader, newHeader);
  }

  /**
   * 应用补丁
   */
  static applyPatch(source: string, patch: string): string | false {
    return Diff.applyPatch(source, patch);
  }

  /**
   * 获取当前结果快照
   */
  static getSnapshot() {
    return snapshot(diffStore);
  }

  /**
   * 清除所有结果
   */
  static clearResults(): void {
    diffStore.results = [];
    diffStore.currentResult = null;
    diffStore.error = null;
  }

  /**
   * 删除指定结果
   */
  static removeResult(id: string): void {
    diffStore.results = diffStore.results.filter(result => result.id !== id);
    if (diffStore.currentResult?.id === id) {
      diffStore.currentResult = diffStore.results[0] || null;
    }
  }

  /**
   * 设置当前结果
   */
  static setCurrentResult(id: string): void {
    const result = diffStore.results.find(r => r.id === id);
    if (result) {
      diffStore.currentResult = result;
    }
  }

  /**
   * 根据ID获取差异比较结果
   * @param resultId 结果ID
   * @returns 差异比较结果，如果未找到则返回null
   */
  static getResult(resultId: string): DiffResult | null {
    return diffStore.results.find(r => r.id === resultId) || null;
  }

  /**
   * 更新设置
   */
  static updateSettings(newSettings: Partial<typeof diffStore.settings>): void {
    Object.assign(diffStore.settings, newSettings);
  }

  /**
   * 格式化输出差异结果
   */
  static formatResult(resultId?: string): string {
    const snap = this.getSnapshot();
    const result = resultId
      ? snap.results.find(r => r.id === resultId)
      : snap.currentResult;

    if (!result) {
      return '没有找到差异结果';
    }

    let output = `=== ${result.title} ===\n`;
    output += `类型: ${result.diffType}\n`;
    output += `时间: ${new Date(result.timestamp).toLocaleString()}\n`;
    output += `统计: +${result.stats.additions} -${result.stats.deletions} (共${result.stats.total}个变化)\n\n`;

      result.changes.forEach(change => {
        const prefix = change.added ? '+' : change.removed ? '-' : ' ';
        const value = change.value.replace(/\n$/, '');
        if (value) {
          output += `${prefix} ${value}\n`;
        }
      });

    return output;
  }
}

// 演示数据
export const demoData = {
  text1: `Hello World
This is the first line
This is the second line
Common line
End of file`,

  text2: `Hello Universe
This is the first line modified
This is the third line
Common line
New line added
End of file`,

  json1: {
    name: 'John',
    age: 30,
    city: 'New York',
    hobbies: ['reading', 'swimming'],
    address: {
      street: '123 Main St',
      zip: '10001',
    },
  },

  json2: {
    name: 'John',
    age: 31,
    city: 'Boston',
    hobbies: ['reading', 'cycling', 'cooking'],
    address: {
      street: '456 Oak Ave',
      zip: '02101',
    },
    email: 'john@example.com',
  },

  css1: `.container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background: blue;
  color: white;
  border: none;
}`,

  css2: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.button {
  background: green;
  color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.header {
  font-size: 2rem;
  font-weight: bold;
}`,
};

  // 使用示例函数
export function runDemoComparisons() {
  console.log('🚀 开始 JSDiff 工具演示...\n');

  // 文本行差异
  console.log('1. 文本行差异比较:');
  const linesId = JSDiffTool.diffLines(
    demoData.text1,
    demoData.text2,
    '文本行差异示例'
  );
  console.log(JSDiffTool.formatResult(linesId));

  // JSON 差异
  console.log('\n2. JSON差异比较:');
  const jsonId = JSDiffTool.diffJson(
    demoData.json1,
    demoData.json2,
    'JSON对象差异示例'
  );
  console.log(JSDiffTool.formatResult(jsonId));

  // 单词差异
  console.log('\n3. 单词差异比较:');
  const wordsId = JSDiffTool.diffWords(
    'The quick brown fox jumps over the lazy dog',
    'The fast brown fox jumps over the sleepy cat',
    '单词差异示例'
  );
  console.log(JSDiffTool.formatResult(wordsId));

  // CSS 差异
  console.log('\n4. CSS差异比较:');
  const cssId = JSDiffTool.diffCss(
    demoData.css1,
    demoData.css2,
    'CSS样式差异示例'
  );
  console.log(JSDiffTool.formatResult(cssId));

  // 显示 store 状态
  const snap = JSDiffTool.getSnapshot();
  console.log(`\n📊 Store 状态:`);
  console.log(`- 总共 ${snap.results.length} 个差异结果`);
  console.log(`- 当前结果: ${snap.currentResult?.title || '无'}`);

  return snap;
}
