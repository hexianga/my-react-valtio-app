#!/bin/bash

# 分支保护工具演示脚本
# 用途：展示分支保护功能的实际效果

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          分支保护工具 - 功能演示                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}本演示将展示分支保护工具如何工作${NC}\n"

# 演示 1: 模拟推送到 feature 分支（应该成功）
echo -e "${CYAN}${BOLD}演示 1: 推送到 feature 分支 (应该允许)${NC}"
echo -e "${YELLOW}命令: git push origin feature/new-feature${NC}"
echo "refs/heads/feature/new-feature abc123 refs/heads/feature/new-feature def456" | node scripts/branch-protection.js
RESULT1=$?
if [ $RESULT1 -eq 0 ]; then
    echo -e "${GREEN}✓ 结果: 推送被允许 (符合预期)${NC}\n"
else
    echo -e "${RED}✗ 结果: 推送被拒绝 (不符合预期)${NC}\n"
fi

# 演示 2: 模拟推送到 master 分支（应该失败）
echo -e "${CYAN}${BOLD}演示 2: 推送到 master 分支 (应该拒绝)${NC}"
echo -e "${YELLOW}命令: git push origin master${NC}"
echo "refs/heads/feature/test abc123 refs/heads/master def456" | node scripts/branch-protection.js
RESULT2=$?
if [ $RESULT2 -ne 0 ]; then
    echo -e "${GREEN}✓ 结果: 推送被拒绝 (符合预期)${NC}\n"
else
    echo -e "${RED}✗ 结果: 推送被允许 (不符合预期)${NC}\n"
fi

# 演示 3: 模拟推送到 release 分支（应该失败）
echo -e "${CYAN}${BOLD}演示 3: 推送到 release/v1.0 分支 (应该拒绝)${NC}"
echo -e "${YELLOW}命令: git push origin release/v1.0${NC}"
echo "refs/heads/feature/test abc123 refs/heads/release/v1.0 def456" | node scripts/branch-protection.js
RESULT3=$?
if [ $RESULT3 -ne 0 ]; then
    echo -e "${GREEN}✓ 结果: 推送被拒绝 (符合预期)${NC}\n"
else
    echo -e "${RED}✗ 结果: 推送被允许 (不符合预期)${NC}\n"
fi

# 演示 4: 模拟推送到 develop 分支（应该成功）
echo -e "${CYAN}${BOLD}演示 4: 推送到 develop 分支 (应该允许)${NC}"
echo -e "${YELLOW}命令: git push origin develop${NC}"
echo "refs/heads/feature/test abc123 refs/heads/develop def456" | node scripts/branch-protection.js
RESULT4=$?
if [ $RESULT4 -eq 0 ]; then
    echo -e "${GREEN}✓ 结果: 推送被允许 (符合预期)${NC}\n"
else
    echo -e "${RED}✗ 结果: 推送被拒绝 (不符合预期)${NC}\n"
fi

# 总结
echo -e "${CYAN}${BOLD}════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}演示总结:${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} feature 分支: 允许推送"
echo -e "  ${RED}✗${NC} master 分支: 拒绝推送"
echo -e "  ${RED}✗${NC} release/* 分支: 拒绝推送"
echo -e "  ${GREEN}✓${NC} develop 分支: 允许推送"
echo ""
echo -e "${YELLOW}💡 提示: 这个工具会在你执行 'git push' 时自动运行${NC}"
echo -e "${YELLOW}   保护你的重要分支不被误操作${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}\n"

# 显示如何使用
echo -e "${BOLD}如何使用:${NC}"
echo -e "  1. 工具已自动安装，无需额外配置"
echo -e "  2. 正常使用 git push 命令即可"
echo -e "  3. 如果推送到受保护分支，会自动拦截"
echo ""
echo -e "${BOLD}正确的工作流程:${NC}"
echo -e "  ${CYAN}git checkout -b feature/my-feature${NC}  # 创建功能分支"
echo -e "  ${CYAN}git add .${NC}                            # 添加更改"
echo -e "  ${CYAN}git commit -m \"feat: new feature\"${NC}   # 提交更改"
echo -e "  ${CYAN}git push origin feature/my-feature${NC}  # 推送到功能分支"
echo -e "  然后在 GitHub/GitLab 创建 Pull Request"
echo ""
