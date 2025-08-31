#!/bin/bash

# 设置代理
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890

echo "🚀 开始安装依赖..."
npm install

echo "🎯 启动开发服务器..."
npm run dev
