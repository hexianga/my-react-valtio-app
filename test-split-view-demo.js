/**
 * 双栏视图功能测试脚本
 * 测试各种类型的差异在双栏视图中的显示效果
 */

// 导入必要的模块
const { JSDiffTool, demoData } = require('./src/utils/jsdiff-tool.ts');

console.log('🚀 开始测试双栏视图功能...\n');

// 测试文本行差异的双栏视图
console.log('1. 测试文本行差异双栏视图:');
const _textDiff = JSDiffTool.diffLines(
  demoData.text1,
  demoData.text2,
  '文本行差异双栏测试'
);

const result = JSDiffTool.getSnapshot().currentResult;
if (result && result.splitView) {
  console.log('✅ 双栏视图数据生成成功');
  console.log(`左栏行数: ${result.splitView.leftLines.length}`);
  console.log(`右栏行数: ${result.splitView.rightLines.length}`);
  
  console.log('\n左栏内容示例:');
  result.splitView.leftLines.slice(0, 3).forEach((line, _index) => {
    console.log(`  行${line.lineNumber || '空'}: [${line.type}] ${line.content.substring(0, 50)}...`);
  });
  
  console.log('\n右栏内容示例:');
  result.splitView.rightLines.slice(0, 3).forEach((line, _index) => {
    console.log(`  行${line.lineNumber || '空'}: [${line.type}] ${line.content.substring(0, 50)}...`);
  });
} else {
  console.log('❌ 双栏视图数据生成失败');
}

// 测试JSON差异的双栏视图
console.log('\n2. 测试JSON差异双栏视图:');
const _jsonDiff = JSDiffTool.diffJson(
  demoData.json1,
  demoData.json2,
  'JSON差异双栏测试'
);

const jsonResult = JSDiffTool.getSnapshot().currentResult;
if (jsonResult && jsonResult.splitView) {
  console.log('✅ JSON双栏视图数据生成成功');
  console.log(`统计: +${jsonResult.stats.additions} -${jsonResult.stats.deletions}`);
} else {
  console.log('❌ JSON双栏视图数据生成失败');
}

// 测试单词差异的双栏视图
console.log('\n3. 测试单词差异双栏视图:');
const _wordDiff = JSDiffTool.diffWords(
  'The quick brown fox jumps over the lazy dog',
  'The fast brown fox leaps over the sleepy cat',
  '单词差异双栏测试'
);

const wordResult = JSDiffTool.getSnapshot().currentResult;
if (wordResult && wordResult.splitView) {
  console.log('✅ 单词双栏视图数据生成成功');
  if (wordResult.splitView.leftLines[0]?.highlightRanges) {
    console.log(`左栏高亮区域数: ${wordResult.splitView.leftLines[0].highlightRanges.length}`);
  }
  if (wordResult.splitView.rightLines[0]?.highlightRanges) {
    console.log(`右栏高亮区域数: ${wordResult.splitView.rightLines[0].highlightRanges.length}`);
  }
} else {
  console.log('❌ 单词双栏视图数据生成失败');
}

console.log('\n📊 最终统计:');
const snapshot = JSDiffTool.getSnapshot();
console.log(`总共生成了 ${snapshot.results.length} 个差异结果`);
console.log(`当前视图模式: ${snapshot.settings.viewMode}`);

console.log('\n✅ 双栏视图功能测试完成！');
console.log('🌐 请打开浏览器访问 http://localhost:3005/jsdiff 查看实际效果');
console.log('💡 在设置面板中可以切换"统一"和"双栏"视图模式');