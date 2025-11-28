#!/usr/bin/env node

/**
 * Git Hooks 诊断工具
 * 用途：检查 Git hooks 配置是否正确，帮助排查问题
 * 使用方法：node scripts/diagnose-hooks.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader() {
  log('', 'cyan');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          Git Hooks 诊断工具                               ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log('', 'reset');
}

function checkItem(name, check, fix = null) {
  process.stdout.write(`检查: ${name}... `);

  try {
    const result = check();
    if (result.success) {
      log(`✓ ${result.message || '通过'}`, 'green');
      return true;
    } else {
      log(`✗ ${result.message || '失败'}`, 'red');
      if (result.detail) {
        log(`  ${result.detail}`, 'yellow');
      }
      if (fix) {
        log(`  修复方法: ${fix}`, 'cyan');
      }
      return false;
    }
  } catch (error) {
    log(`✗ 错误: ${error.message}`, 'red');
    if (fix) {
      log(`  修复方法: ${fix}`, 'cyan');
    }
    return false;
  }
}

function main() {
  printHeader();

  let allPassed = true;

  // 1. 检查是否在 Git 仓库中
  allPassed &= checkItem(
    '是否在 Git 仓库中',
    () => {
      const gitDir = path.join(process.cwd(), '.git');
      return {
        success: fs.existsSync(gitDir),
        message: fs.existsSync(gitDir) ? '是' : '否',
      };
    },
    '在项目根目录运行此脚本'
  );

  // 2. 检查 Git hooks 路径配置
  allPassed &= checkItem(
    'Git hooks 路径配置',
    () => {
      try {
        const hooksPath = execSync('git config core.hooksPath', { encoding: 'utf8' }).trim();
        const isNativeHooks = hooksPath === '.git/hooks' || !hooksPath;
        return {
          success: isNativeHooks,
          message: hooksPath || '.git/hooks (默认)',
          detail: !isNativeHooks ? '当前使用原生 Git Hooks，应该设置为 .git/hooks' : null,
        };
      } catch {
        // 未设置时使用默认值 .git/hooks
        return {
          success: true,
          message: '.git/hooks (默认)',
        };
      }
    },
    'git config core.hooksPath .git/hooks'
  );

  // 3. 检查 .git/hooks/pre-push 是否存在
  allPassed &= checkItem(
    '.git/hooks/pre-push 文件存在',
    () => {
      const hookPath = path.join(process.cwd(), '.git', 'hooks', 'pre-push');
      return {
        success: fs.existsSync(hookPath),
        message: fs.existsSync(hookPath) ? '存在' : '不存在',
      };
    },
    'node scripts/install-git-hooks.js'
  );

  // 4. 检查 .git/hooks/pre-push 是否可执行
  allPassed &= checkItem(
    '.git/hooks/pre-push 可执行权限',
    () => {
      const hookPath = path.join(process.cwd(), '.git', 'hooks', 'pre-push');
      if (!fs.existsSync(hookPath)) {
        return { success: false, message: '文件不存在' };
      }

      try {
        const stats = fs.statSync(hookPath);
        const isExecutable = !!(stats.mode & 0o111);
        return {
          success: isExecutable,
          message: isExecutable ? '是' : '否',
        };
      } catch {
        return { success: false, message: '无法检查' };
      }
    },
    'chmod +x .git/hooks/pre-push'
  );

  // 5. 检查 .git/hooks/pre-push 内容
  allPassed &= checkItem(
    '.git/hooks/pre-push 包含分支保护脚本',
    () => {
      const hookPath = path.join(process.cwd(), '.git', 'hooks', 'pre-push');
      if (!fs.existsSync(hookPath)) {
        return { success: false, message: '文件不存在' };
      }

      const content = fs.readFileSync(hookPath, 'utf8');
      const hasScript = content.includes('branch-protection.js');
      const isCommented = content.includes('# node scripts/branch-protection.js');

      if (isCommented) {
        return {
          success: false,
          message: '脚本被注释了',
          detail: '需要取消注释',
        };
      }

      return {
        success: hasScript,
        message: hasScript ? '是' : '否',
      };
    },
    '编辑 .git/hooks/pre-push，确保包含: node scripts/branch-protection.js'
  );

  // 6. 检查 scripts/branch-protection.js 是否存在
  allPassed &= checkItem(
    'scripts/branch-protection.js 存在',
    () => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'branch-protection.js');
      return {
        success: fs.existsSync(scriptPath),
        message: fs.existsSync(scriptPath) ? '存在' : '不存在',
      };
    },
    '从项目仓库恢复该文件'
  );

  // 7. 检查 scripts/branch-protection.js 是否可执行
  allPassed &= checkItem(
    'scripts/branch-protection.js 可执行权限',
    () => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'branch-protection.js');
      if (!fs.existsSync(scriptPath)) {
        return { success: false, message: '文件不存在' };
      }

      try {
        const stats = fs.statSync(scriptPath);
        const isExecutable = !!(stats.mode & 0o111);
        return {
          success: isExecutable,
          message: isExecutable ? '是' : '否',
        };
      } catch (error) {
        return { success: false, message: '无法检查' };
      }
    },
    'chmod +x scripts/branch-protection.js'
  );

  // 8. 检查 Node.js 是否可用
  allPassed &= checkItem(
    'Node.js 可用',
    () => {
      try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        return {
          success: true,
          message: nodeVersion,
        };
      } catch {
        return {
          success: false,
          message: '未安装或不可用',
        };
      }
    },
    '安装 Node.js: https://nodejs.org/'
  );

  // 9. 测试分支保护脚本
  allPassed &= checkItem(
    '分支保护脚本功能测试',
    () => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'branch-protection.js');
      if (!fs.existsSync(scriptPath)) {
        return { success: false, message: '脚本不存在' };
      }

      try {
        // 测试拦截 master 分支
        const testInput = 'refs/heads/feature/test abc123 refs/heads/master def456\n';
        const result = execSync(`echo "${testInput}" | node "${scriptPath}"`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        // 如果没有抛出错误，说明没有拦截（不正常）
        return {
          success: false,
          message: '未能拦截 master 分支',
        };
      } catch (error) {
        // 应该抛出错误（退出码非0），说明正确拦截了
        if (error.status === 1) {
          return {
            success: true,
            message: '正常工作',
          };
        }
        return {
          success: false,
          message: `错误: ${error.message}`,
        };
      }
    },
    'node scripts/test-branch-protection.js'
  );

  // 总结
  console.log('');
  log('═'.repeat(60), 'cyan');

  if (allPassed) {
    log('✓ 所有检查通过！分支保护功能应该正常工作。', 'green');
  } else {
    log('✗ 发现问题，请根据上面的提示进行修复。', 'red');
    console.log('');
    log('常见问题快速修复:', 'bold');
    log('  1. 重新安装 hooks: node scripts/install-git-hooks.js', 'cyan');
    log('  2. 设置 hooks 路径: git config core.hooksPath .git/hooks', 'cyan');
    log('  3. 添加执行权限: chmod +x .git/hooks/pre-push scripts/branch-protection.js', 'cyan');
    log('  4. 运行完整测试: node scripts/test-branch-protection.js', 'cyan');
  }

  console.log('');
  log('查看详细文档: BRANCH_PROTECTION.md', 'yellow');
  log('═'.repeat(60), 'cyan');
  console.log('');

  process.exit(allPassed ? 0 : 1);
}

main();
