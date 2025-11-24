import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { diffStore, JsonDiffer } from '../utils/json-diff-demo';

interface JsonDiffViewerProps {
  className?: string;
}

const JsonDiffViewer: React.FC<JsonDiffViewerProps> = ({ className = '' }) => {
  const snap = useSnapshot(diffStore);
  const [beforeJson, setBeforeJson] = useState<string>('');
  const [afterJson, setAfterJson] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCompare = () => {
    try {
      setError('');
      const before = JSON.parse(beforeJson);
      const after = JSON.parse(afterJson);

      JsonDiffer.updateStore(before, after);
    } catch {
      setError('JSON 格式错误，请检查输入');
    }
  };

  const loadDemoData = () => {
    const demoData = {
      before: [
        {
          name: 'a',
          version: '1.0.0',
          children: [
            {
              name: 'b',
              version: '1.0.0',
              children: [{ name: 'c', version: '1.0.0' }],
            },
            {
              name: 'd',
              version: '1.0.0',
              children: [{ name: 'e', version: '1.0.0' }],
            },
          ],
        },
        {
          name: 'f',
          version: '1.0.0',
          children: [
            {
              name: 'g',
              version: '1.0.0',
              children: [{ name: 'h', version: '1.0.0' }],
            },
            {
              name: 'i',
              version: '1.0.0',
              children: [{ name: 'j', version: '1.0.0' }],
            },
          ],
        },
      ],
      after: [
        {
          name: 'f',
          version: '1.0.0',
          children: [
            {
              name: 'g',
              version: '1.0.0',
              children: [{ name: 'h', version: '1.0.1' }],
            },
          ],
        },
        {
          name: 'a',
          version: '1.0.0',
          children: [
            {
              name: 'b',
              version: '1.0.0',
              children: [{ name: 'c', version: '1.0.0' }],
            },
            {
              name: 'd',
              version: '1.0.2',
              children: [{ name: 'e', version: '1.0.0' }],
            },
          ],
        },
      ],
    };

    setBeforeJson(JSON.stringify(demoData.before, null, 2));
    setAfterJson(JSON.stringify(demoData.after, null, 2));
  };

  const clearData = () => {
    setBeforeJson('');
    setAfterJson('');
    setError('');
    JsonDiffer.updateStore(null, null);
  };

  const renderDiffResult = (diff: any, index: number) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'added':
          return '➕';
        case 'removed':
          return '❌';
        case 'modified':
          return '🔄';
        case 'moved':
          return '📦';
        default:
          return '❓';
      }
    };

    const getColor = (type: string) => {
      switch (type) {
        case 'added':
          return 'text-green-600';
        case 'removed':
          return 'text-red-600';
        case 'modified':
          return 'text-blue-600';
        case 'moved':
          return 'text-purple-600';
        default:
          return 'text-gray-600';
      }
    };

    const renderValue = (value: any) => {
      if (value === null || value === undefined) return 'null';
      if (typeof value === 'string') return `"${value}"`;
      return JSON.stringify(value, null, 2);
    };

    return (
      <div
        key={index}
        className={`p-3 border rounded-lg mb-2 ${getColor(diff.type)} bg-gray-50`}
      >
        <div className="flex items-start gap-2">
          <span className="text-lg">{getIcon(diff.type)}</span>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{diff.path}</div>
            <div className="text-sm mt-1">
              {diff.type === 'added' && (
                <span>新增: {renderValue(diff.newValue)}</span>
              )}
              {diff.type === 'removed' && (
                <span>删除: {renderValue(diff.oldValue)}</span>
              )}
              {diff.type === 'modified' && (
                <span>
                  修改: {renderValue(diff.oldValue)} →{' '}
                  {renderValue(diff.newValue)}
                </span>
              )}
              {diff.type === 'moved' && (
                <span>
                  移动: 从位置 {diff.oldIndex} 到位置 {diff.newIndex}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  console.log(snap);

  return (
    <div className={`p-6 ${className}`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        JSON Diff 比较工具
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Before JSON:
          </label>
          <textarea
            value={beforeJson}
            onChange={e => setBeforeJson(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="输入第一个 JSON 对象..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            After JSON:
          </label>
          <textarea
            value={afterJson}
            onChange={e => setAfterJson(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="输入第二个 JSON 对象..."
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={handleCompare}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          disabled={!beforeJson || !afterJson}
        >
          🔍 比较差异
        </button>

        <button
          onClick={loadDemoData}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          📊 加载演示数据
        </button>

        <button
          onClick={clearData}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          🗑️ 清空数据
        </button>
      </div>

      {snap.results && snap.results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            差异结果 ({snap.results.length} 个变化)
          </h2>

          <div className="space-y-2">
            {snap.results.map((diff, index) => renderDiffResult(diff, index))}
          </div>
        </div>
      )}

      {snap.results &&
        snap.results.length === 0 &&
        snap.beforeData &&
        snap.afterData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <span className="text-2xl">✅</span>
            <p className="text-green-700 mt-2">
              没有发现差异，两个 JSON 对象相同！
            </p>
          </div>
        )}
    </div>
  );
};

export default JsonDiffViewer;
