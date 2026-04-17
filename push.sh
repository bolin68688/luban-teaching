#!/bin/bash
# 鲁班教学大师 - GitHub推送脚本
# 使用方法：
# 1. 先在GitHub网页创建仓库 luban-teaching
# 2. 将下面 YOUR_GITHUB_USERNAME 替换为你的GitHub用户名
# 3. 运行: chmod +x push.sh && ./push.sh

REPO_NAME="luban-teaching"
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"  # <-- 替换这里

cd "$(dirname "$0")"

echo "正在推送鲁班教学大师到 GitHub..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
git branch -M main
git push -u origin main --force

echo ""
echo "推送完成！访问: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"