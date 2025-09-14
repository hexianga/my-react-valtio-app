import React from 'react';
import { JSDiffTool } from '../../../utils/jsdiff-tool';

interface DiffSettingsProps {
  settings: {
    ignoreWhitespace: boolean;
    ignoreCase: boolean;
    showInlineDiff: boolean;
    viewMode: 'unified' | 'split';
  };
}

/**
 * 差异设置组件
 * 显示和控制差异比较的设置选项
 */
export const DiffSettings: React.FC<DiffSettingsProps> = ({ settings }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-3">比较设置:</h3>
      <div className="flex gap-4 text-sm flex-wrap">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.ignoreWhitespace}
            onChange={e =>
              JSDiffTool.updateSettings({ ignoreWhitespace: e.target.checked })
            }
            className="rounded"
            aria-label="忽略空白字符"
          />
          <span>忽略空白字符</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.ignoreCase}
            onChange={e =>
              JSDiffTool.updateSettings({ ignoreCase: e.target.checked })
            }
            className="rounded"
            aria-label="忽略大小写"
          />
          <span>忽略大小写</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showInlineDiff}
            onChange={e =>
              JSDiffTool.updateSettings({ showInlineDiff: e.target.checked })
            }
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
              checked={settings.viewMode === 'unified'}
              onChange={() =>
                JSDiffTool.updateSettings({ viewMode: 'unified' })
              }
              className="rounded"
              aria-label="统一视图"
            />
            <span>统一</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="viewMode"
              checked={settings.viewMode === 'split'}
              onChange={() => JSDiffTool.updateSettings({ viewMode: 'split' })}
              className="rounded"
              aria-label="双栏视图"
            />
            <span>双栏</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DiffSettings;
