import { useState, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { diffStore, JSDiffTool } from '../../../utils/jsdiff-tool';

/**
 * Patch 生成逻辑钩子
 * 处理 Patch 格式输出的相关逻辑和状态
 */
export const usePatchGeneration = (fileName: string) => {
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
        notification.className =
          'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300';
        notification.textContent = 'Patch 已复制到剪贴板！';
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
      },
      err => {
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

export default usePatchGeneration;
