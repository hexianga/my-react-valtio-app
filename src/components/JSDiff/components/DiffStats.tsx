import React from 'react';
import { DiffResult } from '../../../utils/jsdiff-tool';

interface DiffStatsProps {
  result: DiffResult;
}

/**
 * 差异统计组件
 * 显示差异比较的统计信息
 */
export const DiffStats: React.FC<DiffStatsProps> = ({ result }) => {
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

export default DiffStats;
