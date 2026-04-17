#!/bin/bash
# 鲁班教学大师 GitHub推送脚本

echo "正在推送到 GitHub..."

# 清空之前的凭证缓存
git credential-osxkeychain erase 2>/dev/null <<EOF
protocol=https
host=github.com
EOF

# 设置远程仓库
git remote remove origin 2>/dev/null
git remote add origin https://github.com/bolin68688/luban-teaching.git

# 推送代码
echo ""
echo "请输入GitHub用户名: bolin68688"
echo "请输入密码/Personal Access Token:"
git push -u origin main --force

echo ""
echo "推送完成！访问: https://github.com/bolin68688/luban-teaching"
