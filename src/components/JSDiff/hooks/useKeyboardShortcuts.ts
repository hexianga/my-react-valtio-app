import { useEffect } from 'react';

/**
 * 键盘快捷键钩子
 * 处理键盘快捷键的绑定和触发
 */
export const useKeyboardShortcuts = (
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

export default useKeyboardShortcuts;
