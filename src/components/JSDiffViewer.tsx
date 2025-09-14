import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { diffStore, JSDiffTool, demoData } from '../utils/jsdiff-tool';

interface JSDiffViewerProps {
  className?: string;
}

const JSDiffViewer: React.FC<JSDiffViewerProps> = ({ className = '' }) => {
  const snap = useSnapshot(diffStore);
  const [oldContent, setOldContent] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [diffType, setDiffType] = useState<
    'chars' | 'words' | 'lines' | 'json' | 'css' | 'sentences'
  >('lines');
  const [title, setTitle] = useState<string>('');

  const handleCompare = () => {
    if (!oldContent.trim() || !newContent.trim()) {
      return;
    }

    const diffTitle = title || `${diffType}差异比较`;

    try {
      switch (diffType) {
        case 'chars':
          JSDiffTool.diffChars(oldContent, newContent, diffTitle);
          break;
        case 'words':
          JSDiffTool.diffWords(oldContent, newContent, diffTitle);
          break;
        case 'lines':
          JSDiffTool.diffLines(oldContent, newContent, diffTitle);
          break;
        case 'json':
          try {
            const oldObj = JSON.parse(oldContent);
            const newObj = JSON.parse(newContent);
            JSDiffTool.diffJson(oldObj, newObj, diffTitle);
          } catch {
            JSDiffTool.diffLines(
              oldContent,
              newContent,
              `${diffTitle} (文本模式)`
            );
          }
          break;
        case 'css':
          JSDiffTool.diffCss(oldContent, newContent, diffTitle);
          break;
        case 'sentences':
          JSDiffTool.diffSentences(oldContent, newContent, diffTitle);
          break;
      }
    } catch (error) {
      console.error('Diff comparison failed:', error);
    }
  };

  const loadDemoData = (type: 'text' | 'json' | 'css') => {
    switch (type) {
      case 'text':
        setOldContent(demoData.text1);
        setNewContent(demoData.text2);
        setDiffType('lines');
        setTitle('文本行差异演示');
        break;
      case 'json':
        setOldContent(JSON.stringify(demoData.json1, null, 2));
        setNewContent(JSON.stringify(demoData.json2, null, 2));
        setDiffType('json');
        setTitle('JSON对象差异演示');
        break;
      case 'css':
        setOldContent(demoData.css1);
        setNewContent(demoData.css2);
        setDiffType('css');
        setTitle('CSS样式差异演示');
        break;
    }
  };

  const clearData = () => {
    setOldContent('');
    setNewContent('');
    setTitle('');
    JSDiffTool.clearResults();
  };

  const renderUnifiedDiffLine = (line: any, index: number) => {
    const getLineStyle = () => {
      switch (line.type) {
        case 'added':
          return 'bg-green-50 border-l-4 border-green-500';
        case 'removed':
          return 'bg-red-50 border-l-4 border-red-500';
        case 'unchanged':
          return 'bg-white';
        case 'context':
          return 'bg-gray-50';
        default:
          return 'bg-white';
      }
    };

    const getLineIcon = () => {
      switch (line.type) {
        case 'added':
          return <span className="text-green-600 font-mono">+</span>;
        case 'removed':
          return <span className="text-red-600 font-mono">-</span>;
        case 'unchanged':
          return <span className="text-gray-400 font-mono"> </span>;
        case 'context':
          return <span className="text-blue-600 font-mono">~</span>;
        default:
          return <span className="text-gray-400 font-mono"> </span>;
      }
    };

    const renderLineNumbers = () => {
      if (line.type === 'context') {
        return (
          <div className="flex gap-2 text-xs text-gray-500 font-mono w-20 flex-shrink-0">
            <span className="w-8 text-right">{line.lineNumber.old || ''}</span>
            <span className="w-8 text-right">{line.lineNumber.new || ''}</span>
          </div>
        );
      }

      return (
        <div className="flex gap-2 text-xs text-gray-500 font-mono w-20 flex-shrink-0">
          <span className="w-8 text-right">{line.lineNumber.old || ''}</span>
          <span className="w-8 text-right">{line.lineNumber.new || ''}</span>
        </div>
      );
    };

    const renderContent = () => {
      if (line.innerChanges && line.innerChanges.length > 0) {
        // 单词/字符级别的内联变化
        return (
          <div className="font-mono text-sm flex-1 whitespace-pre-wrap">
            {line.innerChanges.map((change: any, changeIndex: number) => {
              const changeStyle =
                change.type === 'added'
                  ? 'bg-green-200 text-green-800'
                  : change.type === 'removed'
                    ? 'bg-red-200 text-red-800'
                    : '';

              return (
                <span key={changeIndex} className={changeStyle}>
                  {change.content}
                </span>
              );
            })}
          </div>
        );
      }

      // 普通行内容
      return (
        <div className="font-mono text-sm flex-1 whitespace-pre-wrap">
          {line.content}
        </div>
      );
    };

    return (
      <div
        key={index}
        className={`flex items-start gap-3 px-4 py-1 hover:bg-gray-100 ${getLineStyle()}`}
      >
        {getLineIcon()}
        {renderLineNumbers()}
        {renderContent()}
      </div>
    );
  };

  const renderStats = (result: NonNullable<typeof snap.currentResult>) => (
    <div className="flex gap-4 text-sm mb-4">
      <span className="flex items-center gap-1 text-green-600">
        <span>➕</span>
        <span>{result.stats.additions} 新增</span>
      </span>
      <span className="flex items-center gap-1 text-red-600">
        <span>➖</span>
        <span>{result.stats.deletions} 删除</span>
      </span>
      <span className="flex items-center gap-1 text-gray-600">
        <span>📊</span>
        <span>共 {result.stats.total} 个变化</span>
      </span>
      <span className="flex items-center gap-1 text-blue-600">
        <span>🏷️</span>
        <span>{result.diffType}</span>
      </span>
    </div>
  );

  const renderResultTab = (
    result: (typeof snap.results)[0],
    isActive: boolean
  ) => (
    <button
      key={result.id}
      onClick={() => JSDiffTool.setCurrentResult(result.id)}
      className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition-all ${
        isActive
          ? 'bg-blue-50 border-blue-500 text-blue-700'
          : 'bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{result.title}</span>
        <button
          onClick={e => {
            e.stopPropagation();
            JSDiffTool.removeResult(result.id);
          }}
          className="text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </button>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        JSDiff 专业差异比较工具
      </h1>

      {/* 输入区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              原始内容:
            </label>
            <textarea
              value={oldContent}
              onChange={e => setOldContent(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
              placeholder="输入原始内容..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新内容:
            </label>
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
              placeholder="输入新内容..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              比较类型:
            </label>
            <select
              value={diffType}
              onChange={e => setDiffType(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="lines">行差异</option>
              <option value="words">单词差异</option>
              <option value="chars">字符差异</option>
              <option value="json">JSON差异</option>
              <option value="css">CSS差异</option>
              <option value="sentences">句子差异</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题 (可选):
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="差异比较标题"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCompare}
              disabled={
                !oldContent.trim() || !newContent.trim() || snap.isLoading
              }
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {snap.isLoading ? '比较中...' : '🔍 开始比较'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => loadDemoData('text')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            📄 加载文本演示
          </button>
          <button
            onClick={() => loadDemoData('json')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            📋 加载JSON演示
          </button>
          <button
            onClick={() => loadDemoData('css')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            🎨 加载CSS演示
          </button>
          <button
            onClick={clearData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            🗑️ 清空所有
          </button>
        </div>

        {/* 设置面板 */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">比较设置:</h3>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={snap.settings.ignoreWhitespace}
                onChange={e =>
                  JSDiffTool.updateSettings({
                    ignoreWhitespace: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span>忽略空白字符</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={snap.settings.ignoreCase}
                onChange={e =>
                  JSDiffTool.updateSettings({ ignoreCase: e.target.checked })
                }
                className="rounded"
              />
              <span>忽略大小写</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={snap.settings.showInlineDiff}
                onChange={e =>
                  JSDiffTool.updateSettings({
                    showInlineDiff: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span>内联显示差异</span>
            </label>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {snap.error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
          {snap.error}
        </div>
      )}

      {/* 结果区域 */}
      {snap.results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          {/* 结果标签页 */}
          <div className="flex gap-1 p-4 pb-0 overflow-x-auto">
            {snap.results.map(result =>
              renderResultTab(result, result.id === snap.currentResult?.id)
            )}
          </div>

          {/* 当前结果内容 */}
          {snap.currentResult && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {snap.currentResult.title}
                </h2>
                <p className="text-sm text-gray-500">
                  比较时间:{' '}
                  {new Date(snap.currentResult.timestamp).toLocaleString()}
                </p>
              </div>

              {renderStats(snap.currentResult)}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  统一差异视图:
                </h3>
                {snap.currentResult.unifiedView &&
                snap.currentResult.unifiedView.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* 表头 */}
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center gap-3 text-xs text-gray-600 font-mono">
                        <span className="w-4"></span>
                        <div className="flex gap-2 w-20">
                          <span className="w-8 text-center">原始</span>
                          <span className="w-8 text-center">新版</span>
                        </div>
                        <span className="flex-1">内容</span>
                      </div>
                    </div>

                    {/* 差异内容 */}
                    <div className="max-h-96 overflow-y-auto">
                      {snap.currentResult.unifiedView.map((line, index) =>
                        renderUnifiedDiffLine(line, index)
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    ✅ 没有发现差异，内容完全相同！
                  </div>
                )}

                {/* 原始变化列表（可折叠） */}
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    📋 查看详细变化列表
                  </summary>
                  <div className="mt-4 space-y-1 max-h-64 overflow-y-auto border border-gray-200 rounded p-3">
                    {snap.currentResult.changes.map((change, index) => (
                      <div key={index} className="text-xs font-mono">
                        <span
                          className={
                            change.added
                              ? 'text-green-600'
                              : change.removed
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }
                        >
                          {change.added ? '+' : change.removed ? '-' : ' '}{' '}
                          {change.value.replace(/\n/g, '\\n')}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>
      )}

      {snap.results.length === 0 && !snap.isLoading && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg">开始你的第一次差异比较吧！</p>
          <p className="text-sm mt-2">
            选择比较类型，输入内容，然后点击比较按钮
          </p>
        </div>
      )}
    </div>
  );
};

export default JSDiffViewer;
