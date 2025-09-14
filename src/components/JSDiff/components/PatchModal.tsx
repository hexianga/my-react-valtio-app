import React from 'react';

interface PatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  setFileName: (name: string) => void;
  patchContent: string;
  onRegenerate: () => void;
  onCopy: () => void;
}

/**
 * Patch 模态框组件
 * 显示 Patch 格式输出的模态框
 */
export const PatchModal: React.FC<PatchModalProps> = ({
  isOpen,
  onClose,
  fileName,
  setFileName,
  patchContent,
  onRegenerate,
  onCopy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-medium text-gray-900">Patch 格式输出</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="fileName"
                className="text-sm font-medium text-gray-700"
              >
                文件名:
              </label>
              <input
                id="fileName"
                type="text"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button
                onClick={onRegenerate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                重新生成
              </button>
            </div>
            <button
              onClick={onCopy}
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
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatchModal;
