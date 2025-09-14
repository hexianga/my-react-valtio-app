import React from 'react';

interface UnifiedDiffLineProps {
  line: any;
  index: number;
}

/**
 * 统一视图行组件
 * 显示统一视图中的每一行差异
 */
export const UnifiedDiffLine: React.FC<UnifiedDiffLineProps> = React.memo(
  ({ line }) => {
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
      <div
        className={`flex items-start gap-3 px-3 py-0.5 hover:bg-gray-50 ${getLineStyle()}`}
      >
        {getLineIcon()}
        {renderLineNumbers()}
        {renderContent()}
      </div>
    );
  }
);

export default UnifiedDiffLine;
