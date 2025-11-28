# Scripts 目录

本目录包含项目的各种工具脚本。

## 📁 文件列表

### 🛡️ branch-protection.js

**用途**: Git pre-push hook 的分支保护脚本

**功能**:

- 禁止直接推送到 `master`、`main` 分支
- 禁止直接推送到 `release/` 和 `release-` 开头的分支
- 强制使用 Pull Request 工作流程

**调用方式**:

- 自动：通过 `.husky/pre-push` hook 在 `git push` 时自动执行
- 手动：`node scripts/branch-protection.js` (需要通过 stdin 提供推送信息)

**配置**:
修改脚本中的 `PROTECTED_BRANCHES` 对象来自定义保护规则

```javascript
const PROTECTED_BRANCHES = {
  exact: ['master', 'main'], // 精确匹配
  prefixes: ['release/', 'release-'], // 前缀匹配
};
```

---

### 🧪 test-branch-protection.js

**用途**: 测试分支保护功能

**功能**:

- 模拟 Git pre-push hook 的输入
- 测试各种分支名称的保护规则
- 验证工具是否正常工作

**使用方法**:

```bash
node scripts/test-branch-protection.js
```

**测试用例**:

- ✅ 允许推送到 feature 分支
- ❌ 禁止推送到 master 分支
- ❌ 禁止推送到 main 分支
- ❌ 禁止推送到 release/\* 分支
- ✅ 允许推送到 develop 分支
- ✅ 允许推送到 hotfix 分支

---

## 🚀 快速开始

### 安装 Git Hooks

```bash
npm install
```

这会自动通过 husky 安装所有 Git hooks，包括分支保护功能。

### 测试分支保护

```bash
node scripts/test-branch-protection.js
```

### 验证安装

```bash
# 查看 pre-push hook
cat .husky/pre-push

# 检查文件权限
ls -la .husky/pre-push scripts/branch-protection.js
```

---

## 📚 相关文档

- [BRANCH_PROTECTION.md](../BRANCH_PROTECTION.md) - 分支保护工具的详细文档
- [Git Hooks 官方文档](https://git-scm.com/docs/githooks)
- [Husky 官方文档](https://typicode.github.io/husky/)

---

## 🔧 故障排除

### Hook 没有生效？

1. 确认 husky 已安装：`npm install`
2. 检查文件权限：`chmod +x .husky/pre-push scripts/branch-protection.js`
3. 检查 Git hooks 路径：`git config core.hooksPath`
4. 手动设置：`git config core.hooksPath .husky`

### 需要临时绕过保护？

```bash
# 方法 1: 使用 --no-verify 标志（不推荐）
git push --no-verify origin master

# 方法 2: 通过 Pull Request（推荐）
git checkout -b feature/my-changes
git push origin feature/my-changes
# 然后在 GitHub/GitLab 创建 PR
```

---

**维护者**: 项目团队
**最后更新**: 2024
