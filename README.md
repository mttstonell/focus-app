# Focus

Focus 是一个“学习时快速记下分心念头，再回看处理”的应用。当前仓库以 `demo` 目录中的 React + Vite + Capacitor 应用为主，并通过根目录脚本统一启动与构建。

## 快速开始

```bash
npm install --prefix demo
npm run dev
```

访问本地地址后，可直接体验 Web 版 MVP。

## 常用命令（在仓库根目录执行）

- `npm run dev`：启动开发环境
- `npm run build`：构建生产包
- `npm run preview`：本地预览构建结果
- `npm run ios`：构建并同步 iOS 工程
- `npm run ios:install`：运行 iOS 引导脚本（会自动切换到 `demo` 目录）
- `npm run lint`：运行 ESLint
- `npm run test`：运行单元测试
- `npm run format`：执行 Prettier 格式化

## 目录说明

- `demo/`：当前主应用代码（Vite + React + Capacitor）
- `tokens.json`、`theme.ts`：设计 Token 资产
- `01_*.md` ~ `09_*.md`：产品与设计文档

## 数据策略

当前版本采用本地优先存储（浏览器 `localStorage`），包含基础 schema 版本管理与迁移逻辑，后续可平滑接入云同步。

## 部署

当前项目的主部署平台为 **Netlify**，`demo` 目录已包含 `netlify.toml`。

如果需要在 Netlify 部署：
1. 将仓库关联到 Netlify
2. Base directory (如果有选项) 设置为 `demo` 或直接根据 `netlify.toml` 自动识别
3. Build command 默认为 `npm run build`
4. Publish directory 为 `dist`

另外也支持在 Vercel 或 Cloudflare Pages 部署。

## iOS

已配置 Capacitor。执行 `npm run ios:install` 可检查 Xcode、构建 Web 资源、同步 iOS 工程并打开 Xcode。
