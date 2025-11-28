#!/bin/bash

# Git Hooks 安装脚本（不使用 Husky）
# 用途：将分支保护 hook 直接安装到 .git/hooks 目录

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          Git Hooks 安装工具（原生方式）                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# 检查是否在 Git 仓库中
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 错误: 当前目录不是 Git 仓库${NC}"
    echo -e "${YELLOW}请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 创建 .git/hooks 目录（如果不存在）
mkdir -p .git/hooks

# 创建 pre-push hook
echo -e "${CYAN}正在安装 pre-push hook...${NC}"

cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

# Git Pre-Push Hook - 分支保护
# 此文件由 scripts/install-git-hooks.sh 自动生成

# 运行分支保护检查
node scripts/branch-protection.js

# 捕获退出码
EXIT_CODE=$?

# 返回退出码
exit $EXIT_CODE
EOF

# 添加可执行权限
chmod +x .git/hooks/pre-push

# 验证安装
if [ -f ".git/hooks/pre-push" ] && [ -x ".git/hooks/pre-push" ]; then
    echo -e "${GREEN}✓ pre-push hook 安装成功${NC}"
    echo -e "${YELLOW}  位置: .git/hooks/pre-push${NC}"
else
    echo -e "${RED}✗ pre-push hook 安装失败${NC}"
    exit 1
fi

# 检查分支保护脚本是否存在
if [ ! -f "scripts/branch-protection.js" ]; then
    echo -e "${RED}❌ 警告: scripts/branch-protection.js 不存在${NC}"
    echo -e "${YELLOW}请确保该文件存在，否则 hook 无法正常工作${NC}"
fi

echo ""
echo -e "${GREEN}${BOLD}🎉 安装完成！${NC}"
echo ""
echo -e "${BOLD}已安装的 Hooks:${NC}"
echo -e "  • ${CYAN}pre-push${NC} - 分支保护（禁止推送到 master/release 分支）"
echo ""
echo -e "${BOLD}测试安装:${NC}"
echo -e "  ${CYAN}node scripts/test-branch-protection.js${NC}"
echo ""
echo -e "${BOLD}查看 Hook 内容:${NC}"
echo -e "  ${CYAN}cat .git/hooks/pre-push${NC}"
echo ""
echo -e "${YELLOW}💡 注意: .git/hooks 目录不会被 Git 追踪${NC}"
echo -e "${YELLOW}   团队成员需要各自运行此安装脚本${NC}"
echo ""
