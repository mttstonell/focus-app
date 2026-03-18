# Focus App 项目上下文

专注学习，快速记下走神念头

---

## 项目概述

- **产品名称**: Focus
- **技术栈**: React + Vite + Capacitor
- **存储方式**: 浏览器 localStorage（本地优先）
- **部署平台**: Vercel / Netlify / Cloudflare Pages
- **GitHub 仓库**: https://github.com/mttstonell/focus-app

---

## 核心数据模型

### 走神记录 (Note)
```typescript
{
  id: string           // 唯一标识
  content: string      // 记录内容
  type: 'random' | 'lookup' | 'task' | 'emotion' | 'inspiration'
  status: 'due' | 'scheduled' | 'processed' | 'archived'
  remindAt: ISOString | null  // 提醒时间
  createdAt: ISOString        // 创建时间
  contextTask: string  // 关联任务名
}
```

### 状态流转
```
scheduled (已设提醒) → due (待回看) → processed/archived
     ↓
  到期自动转换 (每10秒检查)
```

---

## 关键修复记录

### 数据逻辑修复 (2026-03-17)
| 问题 | 修复方案 | 文件 |
|------|---------|------|
| updateNote 未立即保存 | 在 setNotes 回调中同步调用 saveAppState | `demo/src/App.jsx:88-96` |
| 提醒到期不自动转换 | 添加定时检查逻辑，scheduled → due | `demo/src/App.jsx:36-77` |
| 统计包含已归档 | 过滤 activeNotes (status !== 'archived') | `demo/src/pages/StatsPage.jsx:14-18` |

### 锁屏计时问题修复 (2026-03-17)
- **现象**: 手机锁屏后，专注时长停止增加
- **根因**: 浏览器后台暂停 JavaScript 计时器
- **解决**: 使用基于时间戳的计算替代 setInterval
  - 使用 `Date.now()` 计算实际经过时间
  - `requestAnimationFrame` 替代 `setInterval`
  - `Page Visibility API` 处理页面可见性变化
- **涉及**: `demo/src/pages/HomePage.jsx:21-77`

---

## 架构变更

### PWA 配置 (2026-03-17)
- **Service Worker**: `demo/public/sw.js` (手动实现缓存策略)
- **Manifest**: `demo/public/manifest.json`
- **图标**: `demo/public/icon-192.png`, `icon-512.png`
- **功能**: 支持离线访问、添加到主屏幕

---

## 部署配置

### Vercel
- **Root Directory**: `demo`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 国内访问方案
| 平台 | 域名示例 | 国内访问 |
|------|---------|---------|
| Vercel | `xxx.vercel.app` | 不稳定 |
| Netlify | `xxx.netlify.app` | 较好 |
| Cloudflare Pages | `xxx.pages.dev` | 推荐 |

---

## 文档索引

| 文档 | 说明 |
|------|------|
| `README.md` | 项目介绍与快速开始 |
| `使用手册.md` | 用户操作指南 |
| `01_产品定位与命名方向.md` | 产品定位文档 |
| `02_用户故事与核心流程.md` | 用户故事与流程 |
| `03_MVP功能清单.md` | MVP 功能列表 |
| `04_关键页面原型说明.md` | 页面原型说明 |
| `05_PRD初稿.md` | 产品需求文档 |
| `06_App信息架构.md` | 信息架构 |
| `07_页面UI方案.md` | UI 设计方案 |
| `08_设计Token规范.md` | 设计 Token |
| `09_组件清单.md` | 组件清单 |

---

## 注意事项

1. **数据存储**: 所有数据存储在浏览器 localStorage，清除浏览器数据会丢失
2. **计时器**: 已修复锁屏问题，但仍建议保持页面在前台以获得最佳体验
3. **提醒检查**: 每10秒检查一次到期提醒，精确到秒级

---

*最后更新: 2026-03-17*
