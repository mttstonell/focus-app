#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "================================================"
echo "  Focus App — iOS 安装脚本"
echo "================================================"
echo ""

# Check Xcode
if ! command -v xcodebuild &> /dev/null; then
  echo "❌ 未找到 Xcode，请先从 App Store 安装 Xcode 并打开一次"
  exit 1
fi

echo "✅ 检测到 Xcode：$(xcodebuild -version | head -1)"
echo ""

# Build web
echo "📦 第一步：构建 Web 资源..."
npm run build
echo "✅ Web 构建完成"
echo ""

# Add iOS platform (only first time)
if [ ! -d "ios" ]; then
  echo "📱 第二步：初始化 iOS 项目（首次运行）..."
  npx cap add ios
fi
echo "📱 第二步：同步最新资源到 iOS..."
npx cap sync ios
echo "✅ 同步完成"
echo ""

echo "🚀 第三步：打开 Xcode..."
echo ""
echo "  Xcode 打开后，请："
echo "  1. 连接你的 iPhone 到 Mac"
echo "  2. 顶部设备下拉框选择你的 iPhone"
echo "  3. 点击左上角 ▶ 按钮运行"
echo "  4. 手机上弹出「信任开发者」提示 → 去设置里允许"
echo "     路径：设置 → 通用 → VPN与设备管理 → 信任"
echo ""

npx cap open ios
