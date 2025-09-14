import React, { useState, useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { diffStore, JSDiffTool, demoData, DiffResult } from '../utils/jsdiff-tool';

// 类型定义
interface JSDiffViewerProps {
  className?: string;
}

interface SplitLineProps {
  leftLine: any;
  rightLine: any;
  index: number;
}

interface UnifiedDiffLineProps {
  line: any;
  index: number;
}

interface ResultTabProps {
  result: DiffResult;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

// 自定义钩子：差异比较逻辑
const useDiffComparison = () => {
  const snap = useSnapshot(diffStore);
  const [oldContent, setOldContent] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [diffType, setDiffType] = useState<'chars' | 'words' | 'lines' | 'json' | 'css' | 'sentences'>('lines');
  const [title, setTitle] = useState<string>('');
  const [fileName, setFileName] = useState<string>('example.txt');

  const handleCompare = useCallback(() => {
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
            JSDiffTool.diffLines(oldContent, newContent, `${diffTitle} (文本模式)`);
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
  }, [oldContent, newContent, diffType, title]);

  const loadDemoData = useCallback((type: 'text' | 'json' | 'css') => {
    switch (type) {
      case 'text':
        setOldContent(demoData.text1);
        setNewContent(demoData.text2);
        setDiffType('lines');
        setTitle('文本行差异演示');
        setFileName('example.txt');
        break;
      case 'json':
        setOldContent(JSON.stringify(demoData.json1, null, 2));
        setNewContent(JSON.stringify(demoData.json2, null, 2));
        setDiffType('json');
        setTitle('JSON对象差异演示');
        setFileName('example.json');
        break;
      case 'css':
        setOldContent(demoData.css1);
        setNewContent(demoData.css2);
        setDiffType('css');
        setTitle('CSS样式差异演示');
        setFileName('example.css');
        break;
    }
  }, []);

  const clearData = useCallback(() => {
    setOldContent('');
    setNewContent('');
    setTitle('');
    setFileName('example.txt');
    JSDiffTool.clearResults();
  }, []);

  return {
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
  };
};

// 自定义钩子：Patch 相关逻辑
const usePatchGeneration = (fileName: string) => {
  const snap = useSnapshot(diffStore);
  const [showPatchModal, setShowPatchModal] = useState<boolean>(false);
  const [patchContent, setPatchContent] = useState<string>('');

  const generatePatch = useCallback(() => {
    if (!snap.currentResult) return;

    const patch = JSDiffTool.createPatch(
      fileName,
      snap.currentResult.oldContent,
      snap.currentResult.newContent
    );

    setPatchContent(patch);
    setShowPatchModal(true);
  }, [snap.currentResult, fileName]);

  const copyPatchToClipboard = useCallback(() => {
    navigator.clipboard.writeText(patchContent).then(
      () => {
        // 使用更现代的通知方式，而不是alert
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300';
        notification.textContent = 'Patch 已复制到剪贴板！';
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
      },
      (err) => {
        console.error('复制失败:', err);
      }
    );
  }, [patchContent]);

  const closePatchModal = useCallback(() => {
    setShowPatchModal(false);
  }, []);

  return {
    showPatchModal,
    patchContent,
    generatePatch,
    copyPatchToClipboard,
    closePatchModal,
  };
};

// 自定义钩子：键盘快捷键
const useKeyboardShortcuts = (
  handleCompare: () => void,
  generatePatch: () => void,
  clearData: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter: 执行比较
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCompare();
      }

      // Ctrl/Cmd + P: 生成 Patch
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        generatePatch();
      }

      // Ctrl/Cmd + Shift + C: 清空所有
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCompare, generatePatch, clearData]);
};

// 优化的结果标签组件
const ResultTab = React.memo(({ result, isActive, onSelect, onRemove }: ResultTabProps) => (
  <button
    onClick={() => onSelect(result.id)}
    className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition-all ${
      isActive
        ? 'bg-blue-50 border-blue-500 text-blue-700'
        : 'bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200'
    }`}
  >
    <div className="flex items-center gap-2">
      <span>{result.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(result.id);
        }}
        className="text-gray-400 hover:text-red-500"
        aria-label="删除结果"
      >
        ✕
      </button>
    </div>
  </button>
));

// 优化的统一视图行组件
const UnifiedDiffLine = React.memo(({ line, index }: UnifiedDiffLineProps) => {
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
    return (
      <div className="flex gap-2 text-xs text-gray-500 font-mono w-20 flex-shrink-0">
        <span className="w-8 text-right">{line.lineNumber.old || ''}</span>
        <span className="w-8 text-right">{line.lineNumber.new || ''}</span>
      </div>
    );
  };

  const renderContent = () => {
    if (line.innerChanges && line.innerChanges.length > 0) {
      return (
        <div className="font-mono text-xs flex-1 whitespace-pre-wrap">
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

    return (
      <div className="font-mono text-xs flex-1 whitespace-pre-wrap">
        {line.content}
      </div>
    );
  };

  return (
    <div key={index} className={`flex items-start gap-3 px-3 py-0.5 hover:bg-gray-50 ${getLineStyle()}`}>
      {getLineIcon()}
      {renderLineNumbers()}
      {renderContent()}
    </div>
  );
});

// 优化的分割视图行组件
const SplitLine = React.memo(({ leftLine, rightLine }: SplitLineProps) => {
  const getLineStyle = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-50';
      case 'removed': return 'bg-red-50';
      case 'empty': return 'bg-gray-100';
      default: return 'bg-white';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-800';
      case 'removed': return 'text-red-800';
      case 'empty': return 'text-gray-400';
      default: return 'text-gray-900';
    }
  };

  const renderContentWithHighlights = (line: any) => {
    if (!line.highlightRanges || line.highlightRanges.length === 0) {
      return <span>{line.content}</span>;
    }

    const content = line.content;
    const highlights = line.highlightRanges;
    const parts = [];
    let lastIndex = 0;

    highlights.forEach((range: any, idx: number) => {
      // 添加高亮前的普通文本
      if (lastIndex < range.start) {
        parts.push(
          <span key={`normal-${idx}`}>
            {content.substring(lastIndex, range.start)}
          </span>
        );
      }

      // 添加高亮文本
      const highlightClass = line.type === 'added'
        ? 'bg-green-300 text-green-900 font-medium'
        : line.type === 'removed'
        ? 'bg-red-300 text-red-900 font-medium'
        : 'bg-yellow-200';

      parts.push(
        <span key={`highlight-${idx}`} className={highlightClass}>
          {content.substring(range.start, range.end)}
        </span>
      );

      lastIndex = range.end;
    });

    // 添加剩余的普通文本
    if (lastIndex < content.length) {
      parts.push(
        <span key="final">
          {content.substring(lastIndex)}
        </span>
      );
    }

    return <span>{parts}</span>;
  };

  return (
    <div className="flex">
      {/* 左栏（原始内容） */}
      <div className={`flex-1 flex ${getLineStyle(leftLine.type)} border-r border-gray-300`}>
        <div className="w-12 px-1 py-0.5 text-xs text-gray-500 font-mono text-right bg-gray-50 border-r border-gray-200">
          {leftLine.lineNumber || ''}
        </div>
        <div className="w-6 px-1 py-0.5 text-center text-xs font-mono">
          {leftLine.type === 'removed' ? '-' : leftLine.type === 'unchanged' ? ' ' : ''}
        </div>
        <div className={`flex-1 px-2 py-0.5 font-mono text-xs whitespace-pre-wrap ${getTextColor(leftLine.type)}`}>
          {renderContentWithHighlights(leftLine)}
        </div>
      </div>

      {/* 右栏（新内容） */}
      <div className={`flex-1 flex ${getLineStyle(rightLine.type)}`}>
        <div className="w-12 px-1 py-0.5 text-xs text-gray-500 font-mono text-right bg-gray-50 border-r border-gray-200">
          {rightLine.lineNumber || ''}
        </div>
        <div className="w-6 px-1 py-0.5 text-center text-xs font-mono">
          {rightLine.type === 'added' ? '+' : rightLine.type === 'unchanged' ? ' ' : ''}
        </div>
        <div className={`flex-1 px-2 py-0.5 font-mono text-xs whitespace-pre-wrap ${getTextColor(rightLine.type)}`}>
          {renderContentWithHighlights(rightLine)}
        </div>
      </div>
    </div>
  );
});

// 主组件
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

  // 渲染 Patch 模态框
  const renderPatchModal = () => {
    if (!showPatchModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-xl font-medium text-gray-900">Patch 格式输出</h3>
            <button
              onClick={closePatchModal}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <label htmlFor="fileName" className="text-sm font-medium text-gray-700">文件名:</label>
                <input
                  id="fileName"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <button
                  onClick={generatePatch}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  重新生成
                </button>
              </div>
              <button
                onClick={copyPatchToClipboard}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <span>📋</span>
                <span>复制到剪贴板</span>
              </button>
            </div>

            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto text-xs font-mono whitespace-pre max-h-[60vh]">
              {patchContent}
            </pre>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
            <button
              onClick={closePatchModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 统计信息渲染
  const renderStats = (result: NonNullable<typeof snap.currentResult>) => {
    if (!result) return null;
    return (
      <div className="flex flex-wrap gap-4 text-sm mb-4">
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
        <span className="flex items-center gap-1 text-gray-500 text-xs">
          <span>⌨️</span>
          <span>快捷键: Ctrl+P 生成Patch | Ctrl+Enter 比较</span>
        </span>
      </div>
    );
  };

  // 双栏视图渲染
  const renderSplitDiffView = (result: NonNullable<typeof snap.currentResult>) => {
    if (!result.splitView) {
      return (
        <div className="text-center py-8 text-gray-500">
          双栏视图数据不可用
        </div>
      );
    }

    const { leftLines, rightLines } = result.splitView;
    
    // 生成滚动条高亮标记数据
    const scrollbarMarkers = [];
    const removedRanges = [];
    const addedRanges = [];
    
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
      
      let markerType = 'unchanged';
      
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
            {leftLines.map((leftLine, index) => (
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
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        JSDiff 专业差异比较工具
      </h1>

      {/* 输入区域 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="oldContent" className="block text-sm font-medium text-gray-700 mb-2">
              原始内容:
            </label>
            <textarea
              id="oldContent"
              value={oldContent}
              onChange={(e) => setOldContent(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
              placeholder="输入原始内容..."
              aria-label="原始内容"
            />
          </div>

          <div>
            <label htmlFor="newContent" className="block text-sm font-medium text-gray-700 mb-2">
              新内容:
            </label>
            <textarea
              id="newContent"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
              placeholder="输入新内容..."
              aria-label="新内容"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="diffType" className="block text-sm font-medium text-gray-700 mb-2">
              比较类型:
            </label>
            <select
              id="diffType"
              value={diffType}
              onChange={(e) => setDiffType(e.target.value as any)}
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              标题 (可选):
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="差异比较标题"
              aria-label="比较标题"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCompare}
              disabled={!oldContent.trim() || !newContent.trim() || snap.isLoading}
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
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">比较设置:</h3>
          <div className="flex gap-4 text-sm flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={snap.settings.ignoreWhitespace}
                onChange={(e) => JSDiffTool.updateSettings({ ignoreWhitespace: e.target.checked })}
                className="rounded"
                aria-label="忽略空白字符"
              />
              <span>忽略空白字符</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={snap.settings.ignoreCase}
                onChange={(e) => JSDiffTool.updateSettings({ ignoreCase: e.target.checked })}
                className="rounded"
                aria-label="忽略大小写"
              />
              <span>忽略大小写</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={snap.settings.showInlineDiff}
                onChange={(e) => JSDiffTool.updateSettings({ showInlineDiff: e.target.checked })}
                className="rounded"
                aria-label="内联显示差异"
              />
              <span>内联显示差异</span>
            </label>
            
            {/* 视图模式选择 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700">视图模式:</span>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="viewMode"
                  checked={snap.settings.viewMode === 'unified'}
                  onChange={() => JSDiffTool.updateSettings({ viewMode: 'unified' })}
                  className="rounded"
                  aria-label="统一视图"
                />
                <span>统一</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="viewMode"
                  checked={snap.settings.viewMode === 'split'}
                  onChange={() => JSDiffTool.updateSettings({ viewMode: 'split' })}
                  className="rounded"
                  aria-label="双栏视图"
                />
                <span>双栏</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {snap.error && (
        <div role="alert" className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
          {snap.error}
        </div>
      )}

      {/* 结果区域 */}
      {snap.results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          {/* 结果标签页 - 使用优化的 ResultTab 组件 */}
          <div className="flex gap-1 p-4 pb-0 overflow-x-auto">
            {snap.results.map((result) => (
              <ResultTab
                key={result.id}
                result={result}
                isActive={result.id === snap.currentResult?.id}
                onSelect={(id) => JSDiffTool.setCurrentResult(id)}
                onRemove={(id) => JSDiffTool.removeResult(id)}
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
                    比较时间: {new Date(snap.currentResult.timestamp).toLocaleString()}
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

              {renderStats(snap.currentResult)}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {snap.settings.viewMode === 'split' ? '双栏差异视图:' : '统一差异视图:'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => JSDiffTool.updateSettings({ viewMode: 'unified' })}
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
                      onClick={() => JSDiffTool.updateSettings({ viewMode: 'split' })}
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

                {snap.currentResult.unifiedView && snap.currentResult.unifiedView.length > 0 ? (
                  snap.settings.viewMode === 'split' ? 
                    renderSplitDiffView(snap.currentResult) :
                    (
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
                            {snap.currentResult.unifiedView.map((line, index) => (
                              <UnifiedDiffLine key={index} line={line} index={index} />
                            ))}
                          </div>
                        </div>
                        
                        {/* 右侧滚动条高亮标记 */}
                        <div className="w-4 bg-gray-100 border-l border-gray-200 flex flex-col">
                          <div className="h-10 bg-gray-100 border-b border-gray-200"></div>
                          <div className="flex-1 relative">
                            {/* 统一视图滚动条高亮标记 */}
                            {snap.currentResult.unifiedView.map((line, index) => {
                              if (line.type === 'unchanged') return null;
                              
                              const percentage = (index / (snap.currentResult?.unifiedView.length || 1)) * 100;
                              
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
          <p className="text-sm mt-2">选择比较类型，输入内容，然后点击比较按钮</p>
          <p className="text-xs mt-4 text-gray-400">快捷键: Ctrl+Enter 执行比较 | Ctrl+P 生成Patch | Ctrl+Shift+C 清空所有</p>
        </div>
      )}

      {/* Patch 格式模态框 */}
      {renderPatchModal()}
    </div>
  );
};

export default JSDiffViewer;