// 测试统一视图功能
const diffLib = require('diff');

console.log('🚀 测试 Git 风格的统一视图功能...\n');

// 测试数据
const oldCode = `function hello() {
    console.log("Hello World");
    return true;
}

function goodbye() {
    console.log("Goodbye");
}`;

const newCode = `function hello() {
    console.log("Hello Universe");
    console.log("Extra line");
    return true;
}

function farewell() {
    console.log("Farewell");
}`;

// 执行行差异比较
const lineDiff = diffLib.diffLines(oldCode, newCode);

console.log('=== Git 风格统一视图 ===');
let oldLineNum = 1;
let newLineNum = 1;

lineDiff.forEach(change => {
  const lines = change.value.split('\n').filter((line, index, arr) => {
    return !(index === arr.length - 1 && line === '');
  });

  lines.forEach(line => {
    if (change.added) {
      console.log(`${String(newLineNum).padStart(3, ' ')} | + ${line}`);
      newLineNum++;
    } else if (change.removed) {
      console.log(`${String(oldLineNum).padStart(3, ' ')} | - ${line}`);
      oldLineNum++;
    } else {
      console.log(`${String(oldLineNum).padStart(3, ' ')} |   ${line}`);
      oldLineNum++;
      newLineNum++;
    }
  });
});

console.log('\n✅ 统一视图功能测试完成！');
console.log('📊 这种格式更像 git diff，便于查看完整的文件结构。');
