// 测试双栏视图功能
const diffLib = require('diff');

console.log('🚀 测试双栏视图功能...\n');

// 测试数据
const oldCode = `function hello() {
    console.log("Hello World");
    return true;
}`;

const newCode = `function hello() {
    console.log("Hello Universe");
    console.log("Extra line");
    return true;
}`;

// 执行行差异比较
const lineDiff = diffLib.diffLines(oldCode, newCode);

console.log('=== 双栏视图示例 ===');
console.log('左栏（原始）                    |  右栏（新版）');
console.log('--------------------------------|--------------------------------');

const leftLines = [];
const rightLines = [];
let oldLineNum = 1;
let newLineNum = 1;

lineDiff.forEach(change => {
  const lines = change.value.split('\n').filter((line, index, arr) => {
    return !(index === arr.length - 1 && line === '');
  });

  lines.forEach(line => {
    if (change.added) {
      // 只在右侧显示新增的行
      leftLines.push({ num: null, content: '', type: 'empty' });
      rightLines.push({ num: newLineNum, content: line, type: 'added' });
      newLineNum++;
    } else if (change.removed) {
      // 只在左侧显示删除的行
      leftLines.push({ num: oldLineNum, content: line, type: 'removed' });
      rightLines.push({ num: null, content: '', type: 'empty' });
      oldLineNum++;
    } else {
      // 双侧都显示未变化的行
      leftLines.push({ num: oldLineNum, content: line, type: 'unchanged' });
      rightLines.push({ num: newLineNum, content: line, type: 'unchanged' });
      oldLineNum++;
      newLineNum++;
    }
  });
});

// 输出双栏格式
leftLines.forEach((leftLine, index) => {
  const rightLine = rightLines[index];
  const leftStr = leftLine.type === 'empty' 
    ? ''.padEnd(30, ' ')
    : `${String(leftLine.num || '').padStart(3)} ${leftLine.type === 'removed' ? '-' : ' '} ${leftLine.content}`.padEnd(30);
  const rightStr = rightLine.type === 'empty'
    ? ''
    : `${String(rightLine.num || '').padStart(3)} ${rightLine.type === 'added' ? '+' : ' '} ${rightLine.content}`;
  
  console.log(`${leftStr} | ${rightStr}`);
});

console.log('\n✅ 双栏视图功能测试完成！');
console.log('📊 左右对比更直观，适合查看完整的文件结构。');