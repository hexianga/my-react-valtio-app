import React, { useCallback } from 'react';
import { JSDiffTool } from '../../utils/jsdiff-tool';

// 导入自定义钩子
import useDiffComparison from './hooks/useDiffComparison';
import usePatchGeneration from './hooks/usePatchGeneration';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// 导入子组件
import ResultTab from './components/ResultTab';
import UnifiedDiffLine from './components/UnifiedDiffLine';
import SplitLine from './components/SplitLine';
import PatchModal from './components/PatchModal';
import DiffStats from './components/DiffStats';
import DiffSettings from './components/DiffSettings';

// 定义标记类型
type MarkerType = 'unchanged' | 'added' | 'removed' | 'both';

// 定义滚动条标记接口
interface ScrollbarMarker {
  index: number;
  hasChange: boolean;
  type: MarkerType;
}

interface JSDiffViewerProps {
  className?: string;
}

/**
 * JSDiff 差异比较工具主视图组件
 */
const JSDiffViewer: React.FC<JSDiffViewerProps> = ({ className = '' }) => {
  // 使用自定义钩子
  const {
    snap,
    oldContent,
    setOldContent,
    newContent,
    setNewContent,
    diffType,
    setDiffType,
    title,
    setTitle,
    fileName,
    setFileName,
    handleCompare,
    loadDemoData,
    clearData,
  } = useDiffComparison();

  const {
    showPatchModal,
    patchContent,
    generatePatch,
    copyPatchToClipboard,
    closePatchModal,
  } = usePatchGeneration(fileName);

  // 设置键盘快捷键
  useKeyboardShortcuts(handleCompare, generatePatch, clearData);

  // 双栏视图渲染
  const renderSplitDiffView = useCallback((result: any) => {
    if (!result.splitView) {
      return (
        <div className="text-center py-8 text-gray-500">
          双栏视图数据不可用
        </div>
      );
    }

    const { leftLines, rightLines } = result.splitView;

    // 生成滚动条高亮标记数据
    const scrollbarMarkers: ScrollbarMarker[] = [];
    const removedRanges: number[] = [];
    const addedRanges: number[] = [];

    // 首先收集所有的删除和新增区间
    for (let i = 0; i < leftLines.length; i++) {
      if (leftLines[i].type === 'removed') {
        removedRanges.push(i);
      }
      if (rightLines[i].type === 'added') {
        addedRanges.push(i);
      }
    }

    // 然后为每一行决定其标记类型
    for (let i = 0; i < leftLines.length; i++) {
      const leftLine = leftLines[i];
      const rightLine = rightLines[i];

      const hasLeftRemoval = leftLine.type === 'removed';
      const hasRightAddition = rightLine.type === 'added';

      let markerType: MarkerType = 'unchanged';

      if (hasLeftRemoval || hasRightAddition) {
        // 有变化的行，判断是否为替换操作
        if (hasLeftRemoval && hasRightAddition) {
          // 同一行既有删除又有新增，明确是替换
          markerType = 'both';
        } else {
          // 单一操作，但检查是否与相邻操作构成替换
          if (hasLeftRemoval) {
            // 这是一个删除行，查看附近是否有新增行
            const nearbyAddition = addedRanges.some(addedIndex =>
              Math.abs(addedIndex - i) <= 2 // 在2行范围内
            );
            markerType = nearbyAddition ? 'both' : 'removed';
          } else if (hasRightAddition) {
            // 这是一个新增行，查看附近是否有删除行
            const nearbyRemoval = removedRanges.some(removedIndex =>
              Math.abs(removedIndex - i) <= 2 // 在2行范围内
            );
            markerType = nearbyRemoval ? 'both' : 'added';
          }
        }
      }

      scrollbarMarkers.push({
        index: i,
        hasChange: hasLeftRemoval || hasRightAddition,
        type: markerType
      });
    }

    const handleScrollToLine = (index: number) => {
      const contentEl = document.getElementById('diff-content');
      const lineHeight = 20;
      if (contentEl) {
        contentEl.scrollTop = index * lineHeight;
      }
    };

    return (
      <div className="flex border border-gray-200 rounded-lg overflow-hidden relative">
        {/* 双栏内容区域 */}
        <div className="flex-1">
          {/* 表头 */}
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="flex">
              <div className="flex-1 px-4 py-2 border-r border-gray-300">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="text-red-600">➖</span>
                  <span>原始内容</span>
                </div>
              </div>
              <div className="flex-1 px-4 py-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="text-green-600">➕</span>
                  <span>新内容</span>
                </div>
              </div>
            </div>
          </div>

          {/* 内容区域 - 使用优化的 SplitLine 组件 */}
          <div className="max-h-[800px] overflow-y-auto" id="diff-content">
            {leftLines.map((leftLine: any, index: number) => (
              <SplitLine
                key={index}
                leftLine={leftLine}
                rightLine={rightLines[index]}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* 右侧滚动条高亮标记 */}
        <div className="w-4 bg-gray-100 border-l border-gray-200 flex flex-col">
          <div className="h-12 bg-gray-100 border-b border-gray-200"></div>
          <div className="flex-1 relative">
            {scrollbarMarkers.map((marker) => {
              if (!marker.hasChange) return null;

              const percentage = (marker.index / leftLines.length) * 100;

              // 根据变化类型渲染不同的标记样式
              if (marker.type === 'both') {
                // 同时有删除和新增，渲染一半红色一半绿色
                return (
                  <div
                    key={marker.index}
                    className="absolute w-3 h-1 rounded-sm mx-0.5 cursor-pointer hover:w-4 transition-all overflow-hidden"
                    style={{ top: `${percentage}%` }}
                    title={`第${marker.index + 1}行: 删除和新增`}
                    onClick={() => handleScrollToLine(marker.index)}
                  >
                    {/* 左半部分（红色） */}
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-red-400"></div>
                    {/* 右半部分（绿色） */}
                    <div className="absolute right-0 top-0 w-1.5 h-full bg-green-400"></div>
                  </div>
                );
              } else {
                // 单一类型的变化
                const markerColor = marker.type === 'removed'
                  ? 'bg-red-400'
                  : 'bg-green-400';

                return (
                  <div
                    key={marker.index}
                    className={`absolute w-3 h-1 ${markerColor} rounded-sm mx-0.5 cursor-pointer hover:w-4 transition-all`}
                    style={{ top: `${percentage}%` }}
                    title={`第${marker.index + 1}行: ${marker.type === 'removed' ? '删除' : '新增'}`}
                    onClick={() => handleScrollToLine(marker.index)}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }, []);

  // 统一视图渲染
  const renderUnifiedView = useCallback((result: any) => {
    return (
      <div className="flex border border-gray-200 rounded-lg overflow-hidden relative">
        {/* 统一视图内容区域 */}
        <div className="flex-1">
          {/* 统一视图表头 */}
          <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
            <div className="flex items-center gap-3 text-xs text-gray-600 font-mono">
              <span className="w-4"></span>
              <div className="flex gap-2 w-20">
                <span className="w-8 text-center">原始</span>
                <span className="w-8 text-center">新版</span>
              </div>
              <span className="flex-1">内容</span>
            </div>
          </div>

          {/* 统一视图内容 - 使用优化的 UnifiedDiffLine 组件 */}
          <div className="max-h-[800px] overflow-y-auto" id="unified-diff-content">
            {result.unifiedView.map((line: any, index: number) => (
              <UnifiedDiffLine key={index} line={line} index={index} />
            ))}
          </div>
        </div>

        {/* 右侧滚动条高亮标记 */}
        <div className="w-4 bg-gray-100 border-l border-gray-200 flex flex-col">
          <div className="h-10 bg-gray-100 border-b border-gray-200"></div>
          <div className="flex-1 relative">
            {/* 统一视图滚动条高亮标记 */}
            {result.unifiedView.map((line: any, index: number) => {
              if (line.type === 'unchanged') return null;

              const percentage = (index / (result.unifiedView.length || 1)) * 100;

              // 统一视图中的变化一般是单一类型，但可能存在复合情况
              let markerElement;

              if (line.type === 'context' && line.innerChanges && line.innerChanges.length > 0) {
                // 对于包含内部变化的上下文行，检查是否同时包含删除和新增
                const hasAdded = line.innerChanges.some((change: any) => change.type === 'added');
                const hasRemoved = line.innerChanges.some((change: any) => change.type === 'removed');

                if (hasAdded && hasRemoved) {
                  // 同时有删除和新增
                  markerElement = (
                    <div
                      key={index}
                      className="absolute w-3 h-1 rounded-sm mx-0.5 cursor-pointer hover:w-4 transition-all overflow-hidden"
                      style={{ top: `${percentage}%` }}
                      title={`第${index + 1}行: 删除和新增`}
                      onClick={() => {
                        const contentEl = document.getElementById('unified-diff-content');
                        const lineHeight = 18;
                        if (contentEl) {
                          contentEl.scrollTop = index * lineHeight;
                        }
                      }}
                    >
                      <div className="absolute left-0 top-0 w-1.5 h-full bg-red-400"></div>
                      <div className="absolute right-0 top-0 w-1.5 h-full bg-green-400"></div>
                    </div>
                  );
                } else {
                  const markerColor = hasRemoved ? 'bg-red-400' : 'bg-green-400';
                  markerElement = (
                    <div
                      key={index}
                      className={`absolute w-3 h-1 ${markerColor} rounded-sm mx-0.5 cursor-pointer hover:w-4 transition-all`}
                      style={{ top: `${percentage}%` }}
                      title={`第${index + 1}行: ${hasRemoved ? '删除' : '新增'}`}
                      onClick={() => {
                        const contentEl = document.getElementById('unified-diff-content');
                        const lineHeight = 18;
                        if (contentEl) {
                          contentEl.scrollTop = index * lineHeight;
                        }
                      }}
                    />
                  );
                }
              } else {
                // 单一类型的变化
                const markerColor = line.type === 'removed'
                  ? 'bg-red-400'
                  : line.type === 'added'
                  ? 'bg-green-400'
                  : 'bg-blue-400';

                markerElement = (
                  <div
                    key={index}
                    className={`absolute w-3 h-1 ${markerColor} rounded-sm mx-0.5 cursor-pointer hover:w-4 transition-all`}
                    style={{ top: `${percentage}%` }}
                    title={`第${index + 1}行: ${line.type === 'removed' ? '删除' : line.type === 'added' ? '新增' : line.type === 'context' ? '上下文' : '修改'}`}
                    onClick={() => {
                      const contentEl = document.getElementById('unified-diff-content');
                      const lineHeight = 18;
                      if (contentEl) {
                        contentEl.scrollTop = index * lineHeight;
                      }
                    }}
                  />
                );
              }

              return markerElement;
            })}
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        JSDiff 专业差异比较工具
      </h1>

      {/* 输入区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <div>
            <label
              htmlFor="oldContent"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              原始内容:
            </label>
            <textarea
              id="oldContent"
              value={oldContent}
              onChange={e => setOldContent(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
              placeholder="输入原始内容..."
              aria-label="原始内容"
            />
          </div>

          <div>
            <label
              htmlFor="newContent"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              新内容:
            </label>
            <textarea
              id="newContent"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
              placeholder="输入新内容..."
              aria-label="新内容"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label
              htmlFor="diffType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              比较类型:
            </label>
            <select
              id="diffType"
              value={diffType}
              onChange={e => setDiffType(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              aria-label="比较类型"
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              标题 (可选):
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="差异比较标题"
              aria-label="比较标题"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCompare}
              disabled={
                !oldContent.trim() || !newContent.trim() || snap.isLoading
              }
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="开始比较"
            >
              {snap.isLoading ? '比较中...' : '🔍 开始比较 (Ctrl+Enter)'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => loadDemoData('text')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            aria-label="加载文本演示"
          >
            📄 加载文本演示
          </button>
          <button
            onClick={() => loadDemoData('json')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            aria-label="加载JSON演示"
          >
            📋 加载JSON演示
          </button>
          <button
            onClick={() => loadDemoData('css')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            aria-label="加载CSS演示"
          >
            🎨 加载CSS演示
          </button>
          <button
            onClick={clearData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            aria-label="清空所有"
          >
            🗑️ 清空所有 (Ctrl+Shift+C)
          </button>
        </div>

        {/* 设置面板 */}
        <DiffSettings settings={snap.settings} />
      </div>

      {/* 错误提示 */}
      {snap.error && (
        <div
          role="alert"
          className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6"
        >
          {snap.error}
        </div>
      )}

      {/* 结果区域 */}
      {snap.results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          {/* 结果标签页 - 使用优化的 ResultTab 组件 */}
          <div className="flex gap-1 p-4 pb-0 overflow-x-auto">
            {snap.results.map(result => (
              <ResultTab
                key={result.id}
                result={result as any}
                isActive={result.id === snap.currentResult?.id}
                onSelect={id => JSDiffTool.setCurrentResult(id)}
                onRemove={id => JSDiffTool.removeResult(id)}
              />
            ))}
          </div>

          {/* 当前结果内容 */}
          {snap.currentResult && (
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {snap.currentResult.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    比较时间:{' '}
                    {new Date(snap.currentResult.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Patch 格式输出按钮 */}
                <button
                  onClick={generatePatch}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                  aria-label="生成Patch格式"
                >
                  <span>📝</span>
                  <span>生成 Patch 格式 (Ctrl+P)</span>
                </button>
              </div>

              <DiffStats result={snap.currentResult as any} />

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {snap.settings.viewMode === 'split'
                      ? '双栏差异视图:'
                      : '统一差异视图:'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        JSDiffTool.updateSettings({ viewMode: 'unified' })
                      }
                      className={`px-3 py-1 text-sm rounded ${
                        snap.settings.viewMode === 'unified'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      aria-label="切换到统一视图"
                      aria-pressed={snap.settings.viewMode === 'unified'}
                    >
                      统一视图
                    </button>
                    <button
                      onClick={() =>
                        JSDiffTool.updateSettings({ viewMode: 'split' })
                      }
                      className={`px-3 py-1 text-sm rounded ${
                        snap.settings.viewMode === 'split'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      aria-label="切换到双栏视图"
                      aria-pressed={snap.settings.viewMode === 'split'}
                    >
                      双栏视图
                    </button>
                  </div>
                </div>

                {snap.currentResult.unifiedView &&
                snap.currentResult.unifiedView.length > 0 ? (
                  snap.settings.viewMode === 'split' ? (
                    renderSplitDiffView(snap.currentResult)
                  ) : (
                    renderUnifiedView(snap.currentResult)
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    ✅ 没有发现差异，内容完全相同！
                  </div>
                )}
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
          <p className="text-xs mt-4 text-gray-400">
            快捷键: Ctrl+Enter 执行比较 | Ctrl+P 生成Patch | Ctrl+Shift+C
            清空所有
          </p>
        </div>
      )}

      {/* Patch 格式模态框 */}
      <PatchModal
        isOpen={showPatchModal}
        onClose={closePatchModal}
        fileName={fileName}
        setFileName={setFileName}
        patchContent={patchContent}
        onRegenerate={generatePatch}
        onCopy={copyPatchToClipboard}
      />
    </div>
  );
};

export default JSDiffViewer;
