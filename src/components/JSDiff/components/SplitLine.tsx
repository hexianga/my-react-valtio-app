import React from 'react';

interface SplitLineProps {
  leftLine: any;
  rightLine: any;
  index: number;
}

/**
 * 分割视图行组件
 * 显示分割视图中的每一行差异
 */
export const SplitLine: React.FC<SplitLineProps> = React.memo(
  ({ leftLine, rightLine }) => {
    const getLineStyle = (type: string) => {
      switch (type) {
        case 'added':
          return 'bg-green-50';
        case 'removed':
          return 'bg-red-50';
        case 'empty':
          return 'bg-gray-100';
        default:
          return 'bg-white';
      }
    };

    const getTextColor = (type: string) => {
      switch (type) {
        case 'added':
          return 'text-green-800';
        case 'removed':
          return 'text-red-800';
        case 'empty':
          return 'text-gray-400';
        default:
          return 'text-gray-900';
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
        const highlightClass =
          line.type === 'added'
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
        parts.push(<span key="final">{content.substring(lastIndex)}</span>);
      }

      return <span>{parts}</span>;
    };

    return (
      <div className="flex">
        {/* 左栏（原始内容） */}
        <div
          className={`flex-1 flex ${getLineStyle(leftLine.type)} border-r border-gray-300`}
        >
          <div className="w-12 px-1 py-0.5 text-xs text-gray-500 font-mono text-right bg-gray-50 border-r border-gray-200">
            {leftLine.lineNumber || ''}
          </div>
          <div className="w-6 px-1 py-0.5 text-center text-xs font-mono">
            {leftLine.type === 'removed'
              ? '-'
              : leftLine.type === 'unchanged'
                ? ' '
                : ''}
          </div>
          <div
            className={`flex-1 px-2 py-0.5 font-mono text-xs whitespace-pre-wrap ${getTextColor(leftLine.type)}`}
          >
            {renderContentWithHighlights(leftLine)}
          </div>
        </div>

        {/* 右栏（新内容） */}
        <div className={`flex-1 flex ${getLineStyle(rightLine.type)}`}>
          <div className="w-12 px-1 py-0.5 text-xs text-gray-500 font-mono text-right bg-gray-50 border-r border-gray-200">
            {rightLine.lineNumber || ''}
          </div>
          <div className="w-6 px-1 py-0.5 text-center text-xs font-mono">
            {rightLine.type === 'added'
              ? '+'
              : rightLine.type === 'unchanged'
                ? ' '
                : ''}
          </div>
          <div
            className={`flex-1 px-2 py-0.5 font-mono text-xs whitespace-pre-wrap ${getTextColor(rightLine.type)}`}
          >
            {renderContentWithHighlights(rightLine)}
          </div>
        </div>
      </div>
    );
  }
);

export default SplitLine;
