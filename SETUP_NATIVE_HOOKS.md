# 原生 Git Hooks 设置说明

## ✅ 当前配置

你的项目现在使用的是**原生 Git Hooks**（不依赖 Husky），配置如下：

### 配置信息

- **Hooks 位置**: `.git/hooks/pre-push`
- **Git 配置**: `core.hooksPath = .git/hooks`
- **核心脚本**: `scripts/branch-protection.js`

### 文件结构

```
my-react-valtio-app/
├── .git/
│   └── hooks/
│       └── pre-push              # ← Git 会执行这个文件
├── scripts/
│   ├── branch-protection.js      # ← 核心分支保护逻辑
│   ├── install-git-hooks.js      # ← 安装脚本（跨平台）
│   ├── install-git-hooks.sh      # ← 安装脚本（Shell）
│   ├── uninstall-git-hooks.sh    # ← 卸载脚本
│   ├── test-branch-protection.js # ← 测试脚本
│   └── diagnose-hooks.js         # ← 诊断工具
└── .husky/                       # ← 不再使用（已禁用）
```

---

## 🚀 使用方法

### 正常使用

配置已完成，直接使用 Git 命令即可：

```bash
# ✅ 允许推送到功能分支
git push origin feature/my-feature

# ❌ 禁止推送到 master 分支（会被拦截）
git push origin master

# ❌ 禁止推送到 release 分支（会被拦截）
git push origin release/v1.0
```

### 测试验证

```bash
# 运行完整测试套件
node scripts/test-branch-protection.js

# 运行诊断工具（检查配置是否正确）
node scripts/diagnose-hooks.js
```

---

## 🔧 团队成员安装

**重要**：`.git/hooks/` 目录不会被 Git 追踪，所以每个团队成员需要手动安装。

### 方法 1: 使用 Node.js 脚本（推荐，跨平台）

```bash
node scripts/install-git-hooks.js
```

### 方法 2: 使用 Shell 脚本（Mac/Linux）

```bash
bash scripts/install-git-hooks.sh
```

### 方法 3: 配置自动安装

在 `package.json` 中添加（可选）：

```json
{
  "scripts": {
    "postinstall": "node scripts/install-git-hooks.js"
  }
}
```

这样每次 `npm install` 时会自动安装 hooks。

---

## 📋 保护的分支

默认情况下，以下分支受到保护：

- ✅ `master` - 主分支
- ✅ `main` - 主分支
- ✅ `release/*` - 所有 release/ 开头的分支
- ✅ `release-*` - 所有 release- 开头的分支

### 修改保护规则

编辑 `scripts/branch-protection.js`：

```javascript
const PROTECTED_BRANCHES = {
  exact: ['master', 'main'],           // 精确匹配
  prefixes: ['release/', 'release-'],  // 前缀匹配
};
```

---

## 🔍 故障排除

### 问题 1: Hook 没有生效

**诊断**：
```bash
node scripts/diagnose-hooks.js
```

**常见原因**：
1. Git hooks 路径配置错误
2. pre-push 文件不存在或没有执行权限
3. 脚本内容被注释

**快速修复**：
```bash
# 重新安装
node scripts/install-git-hooks.js

# 或手动设置
git config core.hooksPath .git/hooks
chmod +x .git/hooks/pre-push
```

### 问题 2: 需要临时绕过保护

```bash
# 方法 1: 使用 --no-verify（不推荐）
git push --no-verify origin master

# 方法 2: 通过 Pull Request（推荐）
git checkout -b feature/my-changes
git push origin feature/my-changes
# 然后创建 PR
```

### 问题 3: 新成员忘记安装

**解决方案**：

1. 在 README 中添加安装说明
2. 配置 `postinstall` 脚本自动安装
3. 在团队文档中强调

---

## 🆚 与 Husky 的区别

| 特性 | 原生 Git Hooks（当前） | Husky |
|------|----------------------|-------|
| **依赖** | 无需额外依赖 | 需要 husky npm 包 |
| **安装** | 手动运行脚本 | `npm install` 自动 |
| **版本控制** | ❌ 不能提交 | ✅ 可以提交 |
| **团队同步** | ❌ 需要手动 | ✅ 自动同步 |
| **灵活性** | ✅ 完全控制 | 中等 |
| **适用场景** | 个人项目、学习 | 团队协作 |

---

## 📚 相关命令

```bash
# 查看当前 hooks 路径
git config core.hooksPath

# 切换到原生 Git Hooks
git config core.hooksPath .git/hooks

# 切换回 Husky（如果需要）
git config core.hooksPath .husky

# 查看 pre-push hook 内容
cat .git/hooks/pre-push

# 测试 hook
echo "refs/heads/test abc refs/heads/master def" | .git/hooks/pre-push

# 卸载 hooks
bash scripts/uninstall-git-hooks.sh
```

---

## 📖 详细文档

- **[BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md)** - 分支保护功能详解
- **[NATIVE_GIT_HOOKS_GUIDE.md](./NATIVE_GIT_HOOKS_GUIDE.md)** - 原生 Git Hooks 完整指南
- **[scripts/README.md](./scripts/README.md)** - 脚本使用说明

---

## ✅ 验证安装

运行诊断工具确认一切正常：

```bash
node scripts/diagnose-hooks.js
```

期望输出：

```
╔════════════════════════════════════════════════════════════╗
║          Git Hooks 诊断工具                               ║
╚════════════════════════════════════════════════════════════╝

检查: 是否在 Git 仓库中... ✓ 是
检查: Git hooks 路径配置... ✓ .git/hooks
检查: .git/hooks/pre-push 文件存在... ✓ 存在
检查: .git/hooks/pre-push 可执行权限... ✓ 是
检查: scripts/branch-protection.js 存在... ✓ 存在
检查: 分支保护脚本功能测试... ✓ 正常工作

✓ 所有检查通过！分支保护功能应该正常工作。
```

---

## 🎯 总结

✅ **已完成配置**：
- Git hooks 路径设置为 `.git/hooks`
- pre-push hook 已安装并可执行
- 分支保护脚本正常工作

✅ **功能正常**：
- 禁止推送到 master/main 分支
- 禁止推送到 release 开头的分支
- 允许推送到其他分支

⚠️ **注意事项**：
- 团队成员需要各自运行安装脚本
- 更新脚本后需要重新安装
- 建议在 README 中说明安装步骤

---

**维护者**: 项目团队
**最后更新**: 2024-11-28


