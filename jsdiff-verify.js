// JSDiff 工具快速验证脚本
const diffLib = require('diff');

console.log('🚀 JSDiff 库验证测试...\n');

// 测试文本差异
const oldText = 'Hello World\nThis is a test\nLine 3';
const newText = 'Hello Universe\nThis is a test\nLine 3 modified\nNew line';

console.log('1. 测试行差异:');
const lineDiff = diffLib.diffLines(oldText, newText);
lineDiff.forEach(part => {
  const prefix = part.added ? '+' : part.removed ? '-' : ' ';
  console.log(`${prefix} ${part.value.replace(/\n/g, '\\n')}`);
});

console.log('\n2. 测试单词差异:');
const wordDiff = diffLib.diffWords('The quick brown fox', 'The fast brown fox');
wordDiff.forEach(part => {
  const prefix = part.added ? '+' : part.removed ? '-' : ' ';
  console.log(`${prefix} "${part.value}"`);
});

console.log('\n3. 测试JSON差异:');
const obj1 = { name: 'John', age: 30, city: 'NYC' };
const obj2 = { name: 'John', age: 31, city: 'Boston', email: 'john@test.com' };
const jsonDiff = diffLib.diffJson(obj1, obj2);
jsonDiff.forEach(part => {
  const prefix = part.added ? '+' : part.removed ? '-' : ' ';
  console.log(`${prefix} ${part.value.trim()}`);
});

console.log('\n✅ JSDiff 库工作正常！');
console.log('📊 可以在应用中使用 JSDiff 工具。');
