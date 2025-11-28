#!/usr/bin/env node

/**
 * 分支保护工具测试脚本
 *
 * 用途：模拟 Git pre-push hook 的输入，测试分支保护功能
 * 使用方法：node scripts/test-branch-protection.js
 */

const { spawn } = require('child_process');
const path = require('path');

// 测试用例
const testCases = [
  {
    name: '✅ 允许推送到 feature 分支',
    input:
      'refs/heads/feature/new-feature 67890abcdef refs/heads/feature/new-feature 12345abcdef\n',
    shouldPass: true,
  },
  {
    name: '❌ 禁止推送到 master 分支',
    input:
      'refs/heads/feature/test 67890abcdef refs/heads/master 12345abcdef\n',
    shouldPass: false,
  },
  {
    name: '❌ 禁止推送到 main 分支',
    input: 'refs/heads/feature/test 67890abcdef refs/heads/main 12345abcdef\n',
    shouldPass: false,
  },
  {
    name: '❌ 禁止推送到 release/v1.0 分支',
    input:
      'refs/heads/feature/test 67890abcdef refs/heads/release/v1.0 12345abcdef\n',
    shouldPass: false,
  },
  {
    name: '❌ 禁止推送到 release-1.0 分支',
    input:
      'refs/heads/feature/test 67890abcdef refs/heads/release-1.0 12345abcdef\n',
    shouldPass: false,
  },
  {
    name: '✅ 允许推送到 develop 分支',
    input:
      'refs/heads/feature/test 67890abcdef refs/heads/develop 12345abcdef\n',
    shouldPass: true,
  },
  {
    name: '✅ 允许推送到 hotfix 分支',
    input:
      'refs/heads/hotfix/bug-fix 67890abcdef refs/heads/hotfix/bug-fix 12345abcdef\n',
    shouldPass: true,
  },
];

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * 运行单个测试用例
 */
function runTest(testCase) {
  return new Promise(resolve => {
    console.log(
      `\n${colors.cyan}${colors.bold}测试: ${testCase.name}${colors.reset}`
    );
    console.log(
      `${colors.yellow}输入: ${testCase.input.trim()}${colors.reset}`
    );

    const scriptPath = path.join(__dirname, 'branch-protection.js');
    const child = spawn('node', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => {
      stdout += data.toString();
    });

    child.stderr.on('data', data => {
      stderr += data.toString();
    });

    child.on('close', code => {
      const passed = (code === 0) === testCase.shouldPass;

      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);

      if (passed) {
        console.log(`${colors.green}${colors.bold}✓ 测试通过${colors.reset}`);
      } else {
        console.log(`${colors.red}${colors.bold}✗ 测试失败${colors.reset}`);
        console.log(`  期望: ${testCase.shouldPass ? '允许推送' : '拒绝推送'}`);
        console.log(`  实际: ${code === 0 ? '允许推送' : '拒绝推送'}`);
      }

      resolve(passed);
    });

    // 写入测试数据到标准输入
    child.stdin.write(testCase.input);
    child.stdin.end();
  });
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log(`${colors.bold}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          分支保护工具 - 测试套件                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  let passedCount = 0;
  let failedCount = 0;

  for (const testCase of testCases) {
    const passed = await runTest(testCase);
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
  }

  // 输出测试总结
  console.log(`\n${colors.bold}${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}测试总结:${colors.reset}`);
  console.log(`  ${colors.green}✓ 通过: ${passedCount}${colors.reset}`);
  console.log(`  ${colors.red}✗ 失败: ${failedCount}${colors.reset}`);
  console.log(`  总计: ${passedCount + failedCount}`);
  console.log(`${colors.cyan + '═'.repeat(60) + colors.reset}\n`);

  if (failedCount === 0) {
    console.log(
      `${colors.green}${colors.bold}🎉 所有测试通过！${colors.reset}\n`
    );
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}❌ 有测试失败${colors.reset}\n`);
    process.exit(1);
  }
}

// 运行测试
runAllTests().catch(error => {
  console.error(`${colors.red}测试执行出错: ${error.message}${colors.reset}`);
  process.exit(1);
});
