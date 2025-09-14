// JSDiff 工具演示脚本 (Node.js 版本)
const { runDemoComparisons } = require('./src/utils/jsdiff-tool.ts');

console.log('🚀 开始 JSDiff 专业差异比较工具演示...\n');

try {
  const results = runDemoComparisons();
  console.log('\n✅ 演示完成！');
  console.log(`📊 共生成了 ${results.results.length} 个差异结果`);
} catch (error) {
  console.error('❌ 演示失败:', error);
}
