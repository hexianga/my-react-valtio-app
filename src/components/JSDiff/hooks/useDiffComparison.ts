import { useState, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { diffStore, JSDiffTool, demoData } from '../../../utils/jsdiff-tool';
import { ALL_VERSIONS } from '../data/applicationViews';

/**
 * 差异比较逻辑钩子
 * 处理差异比较的核心逻辑和状态
 */
export const useDiffComparison = () => {
  const snap = useSnapshot(diffStore);
  const [oldContent, setOldContent] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [diffType, setDiffType] = useState<
    'chars' | 'words' | 'lines' | 'json' | 'css' | 'sentences'
  >('lines');
  const [title, setTitle] = useState<string>('');
  const [fileName, setFileName] = useState<string>('example.txt');

  const handleCompare = useCallback(() => {
    if (!oldContent.trim() || !newContent.trim()) {
      return;
    }

    const diffTitle = title || `${diffType}差异比较`;

    try {
      switch (diffType) {
        case 'chars':
          JSDiffTool.diffChars(oldContent, newContent, diffTitle);
          break;
        case 'words':
          JSDiffTool.diffWords(oldContent, newContent, diffTitle);
          break;
        case 'lines':
          JSDiffTool.diffLines(oldContent, newContent, diffTitle);
          break;
        case 'json':
          try {
            const oldObj = JSON.parse(oldContent);
            const newObj = JSON.parse(newContent);
            JSDiffTool.diffJson(oldObj, newObj, diffTitle);
          } catch {
            JSDiffTool.diffLines(
              oldContent,
              newContent,
              `${diffTitle} (文本模式)`
            );
          }
          break;
        case 'css':
          JSDiffTool.diffCss(oldContent, newContent, diffTitle);
          break;
        case 'sentences':
          JSDiffTool.diffSentences(oldContent, newContent, diffTitle);
          break;
      }
    } catch (error) {
      console.error('Diff comparison failed:', error);
    }
  }, [oldContent, newContent, diffType, title]);

  const loadDemoData = useCallback((type: 'text' | 'json' | 'css') => {
    switch (type) {
      case 'text':
        setOldContent(demoData.text1);
        setNewContent(demoData.text2);
        setDiffType('lines');
        setTitle('文本行差异演示');
        setFileName('example.txt');
        break;
      case 'json': {
        const latestVersion = ALL_VERSIONS.rows.find(item => item.message.includes('全量'))?.services
        const latestGrayVersion = ALL_VERSIONS.rows.find(item => item.message.includes('灰度'))?.services
        setOldContent(JSON.stringify({service: latestGrayVersion},  null, 2));
        setNewContent(JSON.stringify({service: latestVersion},  null, 2));

        // setOldContent(JSON.stringify(demoData.json1, null, 2));
        // setNewContent(JSON.stringify(demoData.json2, null, 2));

        console.log('latestVersion', latestVersion, latestGrayVersion, JSON.stringify(demoData.json1, null, 2), JSON.stringify(demoData.json2, null, 2))

        setDiffType('json');
        setTitle('JSON对象差异演示');
        setFileName('example.json');
        break;
      }
      case 'css':
        setOldContent(demoData.css1);
        setNewContent(demoData.css2);
        setDiffType('css');
        setTitle('CSS样式差异演示');
        setFileName('example.css');
        break;
    }
  }, []);

  const clearData = useCallback(() => {
    setOldContent('');
    setNewContent('');
    setTitle('');
    setFileName('example.txt');
    JSDiffTool.clearResults();
  }, []);

  return {
    snap,
    oldContent,
    setOldContent,
    newContent,
    setNewContent,
    diffType,
    setDiffType,
    title,
    setTitle,
    fileName,
    setFileName,
    handleCompare,
    loadDemoData,
    clearData,
  };
};

export default useDiffComparison;
