import React, { useState } from 'react';
import { message } from 'antd';
import { parseJSON } from '../utils/jsonParser';
import JsonViewer from '../components/JsonViewer';

const JsonParserPage: React.FC = () => {
  const [input, setInput] = useState<string>(
    '{"kvs":{"api-duration":[1]},"tags":{},"ts":1763699178,"extraData":"{\\"duration\\":193,\\"url\\":\\"/apiwg_v2/m_qualification/sjst.m.qualification/CustomerQualificationThriftService/grayControl\\",\\"status\\":200,\\"pageUrl\\":\\"https://1960-jhhus-sl-seagull.sjst.test.sankuai.com/steamer/sy/#/steamer-qualificationslist\\",\\"platform\\":\\"mac\\"}"}'
  );

  // 实时解析
  const parseResult = parseJSON(input);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请重试');
      });
  };

  const renderRawTab = () => (
    <div className="flex flex-col h-full">
      {/* 两栏布局 - 占满全部空间 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* 左栏：原始输入 */}
        <div className="flex flex-col min-h-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            原始 JSON 输入
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="粘贴 JSON 数据..."
          />
        </div>

        {/* 右栏：格式化输出或错误提示 */}
        <div className="flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2 flex-shrink-0 w-1/3">
            <label className="block text-sm font-medium text-gray-700">
              {parseResult.success ? '格式化 JSON' : '错误信息'}
            </label>
            {parseResult.success && (
              <button
                onClick={() =>
                  handleCopyToClipboard(parseResult.formattedJson!)
                }
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                复制
              </button>
            )}
          </div>
          {parseResult.success ? (
            <div className="flex-1 overflow-auto border border-gray-300 rounded-lg">
              <JsonViewer data={parseResult.data} defaultExpanded={true} />
            </div>
          ) : (
            <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded-lg overflow-auto">
              <p className="text-red-700 font-medium mb-2">❌ 解析错误</p>
              <p className="text-red-600 text-sm font-mono whitespace-pre-wrap break-words">
                {parseResult.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* 标题区域 */}
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">JSON 解析工具</h1>
        <p className="text-sm text-gray-600 mt-2">
          实时解析和格式化 JSON 数据，支持递归解析嵌套的 JSON 字符串
        </p>
      </div>

      {/* 内容区域 - 占满剩余空间 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-1 min-h-0 p-6">
        {renderRawTab()}
      </div>
    </div>
  );
};

export default JsonParserPage;
