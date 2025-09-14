/**
 * 测试右侧滚动条高亮标记的显示效果
 * 特别是测试"替换"操作的红绿分割标记
 */

console.log('🔧 测试右侧滚动条高亮标记优化...\n');

// 创建测试用的文本内容，包含各种类型的变化
const testOldContent = `第一行不变
第二行将被删除
第三行也将被删除
第四行不变
第五行将被修改前
第六行不变
第七行纯删除`;

const testNewContent = `第一行不变
第二行新增内容
第三行也是新增
第四行不变
第五行将被修改后
第六行不变
第八行纯新增`;

console.log('📝 测试内容:');
console.log('原始内容:\n' + testOldContent);
console.log('\n新内容:\n' + testNewContent);

console.log('\n🎯 期望的高亮标记效果:');
console.log('- 第1行: 无标记 (不变)');
console.log('- 第2行: 红绿分割 (删除+新增)');
console.log('- 第3行: 红绿分割 (删除+新增)');
console.log('- 第4行: 无标记 (不变)');
console.log('- 第5行: 红绿分割 (修改)');
console.log('- 第6行: 无标记 (不变)');
console.log('- 第7行: 纯红色 (删除)');
console.log('- 第8行: 纯绿色 (新增)');

console.log('\n💡 使用方法:');
console.log('1. 访问浏览器 http://localhost:3005');
console.log('2. 复制上面的测试内容到diff工具');
console.log('3. 选择"行差异"模式');
console.log('4. 切换到"双栏视图"');
console.log('5. 观察右侧滚动条的高亮标记效果');

console.log('\n✅ 优化说明:');
console.log('- 智能检测相邻的删除和新增操作');
console.log('- 将相近的删除+新增视为"替换"操作');
console.log('- 替换操作显示为左红右绿的分割标记');
console.log('- 纯删除显示红色，纯新增显示绿色');