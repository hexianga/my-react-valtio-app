#!/bin/bash

# Git Hooks 卸载脚本
# 用途：移除已安装的 Git hooks

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          Git Hooks 卸载工具                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# 检查是否在 Git 仓库中
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 错误: 当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 移除 pre-push hook
if [ -f ".git/hooks/pre-push" ]; then
    # 备份现有的 hook
    if grep -q "branch-protection.js" .git/hooks/pre-push; then
        rm .git/hooks/pre-push
        echo -e "${GREEN}✓ 已移除 pre-push hook${NC}"
    else
        echo -e "${YELLOW}⚠ .git/hooks/pre-push 存在但不是由我们的脚本创建的${NC}"
        echo -e "${YELLOW}  已跳过删除，请手动检查${NC}"
    fi
else
    echo -e "${YELLOW}⚠ pre-push hook 不存在，无需卸载${NC}"
fi

echo ""
echo -e "${GREEN}${BOLD}✓ 卸载完成${NC}\n"
