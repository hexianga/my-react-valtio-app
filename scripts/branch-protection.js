#!/usr/bin/env node

/**
 * Git Pre-Push Hook - 分支保护工具
 *
 * 功能：禁止本地向 master 和 release 打头的分支推送代码
 *
 * 原理：
 * 1. Git pre-push hook 会在执行 git push 之前触发
 * 2. Git 会通过标准输入(stdin)传递推送信息，格式为：
 *    <local ref> <local sha1> <remote ref> <remote sha1>
 * 3. 脚本解析这些信息，提取目标分支名称
 * 4. 检查目标分支是否匹配保护规则（master 或 release/*）
 * 5. 如果匹配，返回非零退出码，Git 会中止推送操作
 *
 * 使用场景：
 * - 防止开发人员误操作直接推送到主分支
 * - 强制使用 Pull Request 流程
 * - 保护生产环境分支的代码质量
 */

const readline = require('readline');

// 配置受保护的分支规则
const PROTECTED_BRANCHES = {
  exact: ['master', 'main'], // 精确匹配的分支名
  prefixes: ['release/', 'release-'], // 前缀匹配的分支名
};

// ANSI 颜色代码，用于终端输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * 检查分支名是否受保护
 * @param {string} branchName - 要检查的分支名
 * @returns {boolean} - 如果分支受保护返回 true
 */
function isProtectedBranch(branchName) {
  // 移除 refs/heads/ 前缀（如果存在）
  const cleanBranchName = branchName.replace(/^refs\/heads\//, '');

  // 检查精确匹配
  if (PROTECTED_BRANCHES.exact.includes(cleanBranchName)) {
    return true;
  }

  // 检查前缀匹配
  return PROTECTED_BRANCHES.prefixes.some(prefix =>
    cleanBranchName.startsWith(prefix)
  );
}

/**
 * 格式化输出错误信息
 * @param {string} branchName - 受保护的分支名
 */
function printError(branchName) {
  console.error('');
  console.error(
    `${colors.red}${colors.bold}╔════════════════════════════════════════════════════════════╗${colors.reset}`
  );
  console.error(
    `${colors.red}${colors.bold}║           🚫  分支保护：推送被拒绝                        ║${colors.reset}`
  );
  console.error(
    `${colors.red}${colors.bold}╚════════════════════════════════════════════════════════════╝${colors.reset}`
  );
  console.error('');
  console.error(
    `${colors.yellow}目标分支：${colors.cyan}${branchName}${colors.reset}`
  );
  console.error('');
  console.error(`${colors.red}❌ 禁止直接推送到以下分支：${colors.reset}`);
  console.error(`   • ${colors.cyan}master${colors.reset}`);
  console.error(`   • ${colors.cyan}main${colors.reset}`);
  console.error(
    `   • ${colors.cyan}release/*${colors.reset} (所有 release 开头的分支)`
  );
  console.error('');
  console.error(`${colors.green}✅ 正确的操作流程：${colors.reset}`);
  console.error(
    `   1. 创建功能分支：${colors.cyan}git checkout -b feature/your-feature${colors.reset}`
  );
  console.error(
    `   2. 提交并推送功能分支：${colors.cyan}git push origin feature/your-feature${colors.reset}`
  );
  console.error(`   3. 在代码托管平台创建 Pull Request/Merge Request`);
  console.error(`   4. 经过代码审查后合并到主分支`);
  console.error('');
  console.error(
    `${colors.yellow}💡 提示：如果您确实需要推送到这些分支，请联系项目管理员${colors.reset}`
  );
  console.error('');
}

/**
 * 主函数：处理 pre-push hook
 */
async function main() {
  // 创建 readline 接口读取标准输入
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let hasProtectedBranch = false;
  const protectedBranches = [];

  // 逐行读取 Git 传递的推送信息
  // 格式：<local ref> <local sha1> <remote ref> <remote sha1>
  // 例如：refs/heads/feature-branch abc123... refs/heads/feature-branch def456...
  for await (const line of rl) {
    if (!line.trim()) continue;

    const parts = line.split(' ');
    if (parts.length < 3) continue;

    // parts[0]: 本地引用 (local ref)
    // parts[1]: 本地 SHA1
    // parts[2]: 远程引用 (remote ref) - 这是我们要检查的目标分支
    // parts[3]: 远程 SHA1
    const remoteRef = parts[2];

    // 检查目标分支是否受保护
    if (isProtectedBranch(remoteRef)) {
      hasProtectedBranch = true;
      const branchName = remoteRef.replace(/^refs\/heads\//, '');
      protectedBranches.push(branchName);
    }
  }

  // 如果检测到推送到受保护分支，拒绝推送
  if (hasProtectedBranch) {
    protectedBranches.forEach(branch => printError(branch));
    process.exit(1); // 非零退出码会让 Git 中止推送
  }

  // 允许推送
  console.log(`${colors.green}✓ 分支检查通过${colors.reset}`);
  process.exit(0);
}

// 执行主函数
main().catch(error => {
  console.error(`${colors.red}错误：${error.message}${colors.reset}`);
  process.exit(1);
});
