#!/usr/bin/env node

/**
 * Git Hooks 安装脚本（Node.js 版本）
 * 用途：跨平台安装 Git hooks（支持 Windows/Mac/Linux）
 * 使用方法：node scripts/install-git-hooks.js
 */

const fs = require('fs');
const path = require('path');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * 打印带颜色的消息
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 打印标题
 */
function printHeader() {
  log('', 'cyan');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          Git Hooks 安装工具（跨平台版本）                 ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log('', 'reset');
}

/**
 * 检查是否在 Git 仓库中
 */
function isGitRepository() {
  const gitDir = path.join(process.cwd(), '.git');
  return fs.existsSync(gitDir);
}

/**
 * 创建 pre-push hook
 */
function createPrePushHook() {
  const hooksDir = path.join(process.cwd(), '.git', 'hooks');
  const hookPath = path.join(hooksDir, 'pre-push');

  // 确保 hooks 目录存在
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Windows 和 Unix 系统的 hook 内容
  const isWindows = process.platform === 'win32';

  let hookContent;
  if (isWindows) {
    // Windows 使用 batch 脚本
    hookContent = `@echo off
REM Git Pre-Push Hook - 分支保护
REM 此文件由 scripts/install-git-hooks.js 自动生成

node scripts/branch-protection.js
exit /b %ERRORLEVEL%
`;
  } else {
    // Unix 系统使用 shell 脚本
    hookContent = `#!/bin/sh
# Git Pre-Push Hook - 分支保护
# 此文件由 scripts/install-git-hooks.js 自动生成

node scripts/branch-protection.js
exit $?
`;
  }

  // 写入 hook 文件
  fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });

  // 在 Unix 系统上确保可执行权限
  if (!isWindows) {
    try {
      fs.chmodSync(hookPath, 0o755);
    } catch (error) {
      log(`⚠ 警告: 无法设置可执行权限: ${error.message}`, 'yellow');
    }
  }

  return hookPath;
}

/**
 * 验证安装
 */
function verifyInstallation(hookPath) {
  if (!fs.existsSync(hookPath)) {
    return false;
  }

  const content = fs.readFileSync(hookPath, 'utf8');
  return content.includes('branch-protection.js');
}

/**
 * 检查依赖文件
 */
function checkDependencies() {
  const branchProtectionScript = path.join(process.cwd(), 'scripts', 'branch-protection.js');

  if (!fs.existsSync(branchProtectionScript)) {
    log('❌ 警告: scripts/branch-protection.js 不存在', 'red');
    log('请确保该文件存在，否则 hook 无法正常工作', 'yellow');
    return false;
  }

  return true;
}

/**
 * 主函数
 */
function main() {
  printHeader();

  // 检查是否在 Git 仓库中
  if (!isGitRepository()) {
    log('❌ 错误: 当前目录不是 Git 仓库', 'red');
    log('请在项目根目录运行此脚本', 'yellow');
    process.exit(1);
  }

  // 安装 pre-push hook
  log('正在安装 pre-push hook...', 'cyan');

  try {
    const hookPath = createPrePushHook();

    // 验证安装
    if (verifyInstallation(hookPath)) {
      log('✓ pre-push hook 安装成功', 'green');
      log(`  位置: ${hookPath}`, 'yellow');
    } else {
      log('✗ pre-push hook 安装失败', 'red');
      process.exit(1);
    }

    // 检查依赖文件
    console.log('');
    checkDependencies();

    // 打印成功信息
    console.log('');
    log('🎉 安装完成！', 'green');
    console.log('');
    log('已安装的 Hooks:', 'bold');
    log('  • pre-push - 分支保护（禁止推送到 master/release 分支）', 'cyan');
    console.log('');
    log('测试安装:', 'bold');
    log('  node scripts/test-branch-protection.js', 'cyan');
    console.log('');
    log('查看 Hook 内容:', 'bold');
    log(`  cat ${hookPath}`, 'cyan');
    console.log('');
    log('💡 注意: .git/hooks 目录不会被 Git 追踪', 'yellow');
    log('   团队成员需要各自运行此安装脚本', 'yellow');
    console.log('');

    // 在 package.json 中添加安装脚本的提示
    log('💡 建议: 在 package.json 中添加以下脚本:', 'yellow');
    log('   "postinstall": "node scripts/install-git-hooks.js"', 'cyan');
    log('   这样 npm install 时会自动安装 hooks', 'yellow');
    console.log('');

  } catch (error) {
    log(`❌ 安装失败: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// 运行主函数
main();
