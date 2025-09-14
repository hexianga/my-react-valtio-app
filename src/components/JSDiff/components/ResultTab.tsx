import React from 'react';
import { DiffResult } from '../../../utils/jsdiff-tool';

interface ResultTabProps {
  result: DiffResult;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

/**
 * 结果标签页组件
 * 显示差异比较结果的标签页
 */
export const ResultTab: React.FC<ResultTabProps> = React.memo(
  ({ result, isActive, onSelect, onRemove }) => (
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
          onClick={e => {
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
  )
);

export default ResultTab;
