# Focus App 项目上下文

专注学习，快速记下走神念头

---

## 项目概述

- **产品名称**: Focus
- **技术栈**: React + Vite + Capacitor
- **存储方式**: 浏览器 localStorage（本地优先）
- **部署平台**: Netlify (当前使用)
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

### 用户配置 (Profile)
```typescript
{
  accountName: string        // 账号名，最多 20 字
  reminderDueOn: boolean     // 到期提醒开关
  reminderPomodoroOn: boolean // 专注完成提醒开关
  focusMinutes: number       // 专注时长（分钟）
  breakMinutes: number       // 休息时长（分钟）
}
```

### 任务历史 (Task)
```typescript
{
  id: string
  name: string
  focusedSeconds: number
  startTime: ISOString
  endTime?: ISOString
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
- **根因**: 浏览器后台会暂停或延迟计时器，导致按 tick 累加不稳定
- **解决**: 使用会话起点 + 真实经过时间计算剩余时间
  - 用 `Date.now()` 计算实际经过时间
  - 在前台恢复时重新按时间戳刷新界面
  - 计时显示统一取整，避免浮点数显示异常
- **涉及**: `demo/src/pages/HomePage.jsx:21-77`

### 用户设置与系统通知 (2026-03-17)
- **账号名**: 支持在「我的」页编辑，限制 20 字，持久化到 `profile.accountName`
- **学习偏好**: 支持设置专注时长、休息时长，并持久化到 `profile.focusMinutes` / `profile.breakMinutes`
- **提醒设置**: 支持「到期提醒」和「专注完成提醒」开关，开启后在浏览器通知权限允许时发送系统通知
- **存储**: `demo/src/services/storage.js` 统一管理 `profile` 兼容迁移，旧数据会自动补齐默认配置
- **涉及**: `demo/src/pages/ProfilePage.jsx`, `demo/src/pages/HomePage.jsx`, `demo/src/App.jsx`, `demo/src/services/storage.js`

### 任务历史记录 (2026-03-18)
- **触发方式**: 在首页编辑当前任务名时，系统会把旧任务自动视为结束，并开启一个新的当前任务
- **记录内容**: 每个任务都会保存 `startTime`、`endTime` 和累计 `focusedSeconds`
- **展示位置**: 在「我的」页的“历史任务”区块中展示任务名、起止时间和专注时长
- **存储**: `demo/src/services/storage.js` 新增 `tasks` 数组的持久化和迁移，确保刷新后仍可恢复历史任务
- **涉及**: `demo/src/pages/HomePage.jsx`, `demo/src/pages/ProfilePage.jsx`, `demo/src/App.jsx`, `demo/src/data/mockData.js`, `demo/src/services/storage.js`

### 手机端自动适配 (2026-03-18)
- **现象**: 部分 iPhone / iPad 设备在浏览器里会出现电脑端的「手机外壳」模拟框
- **原因**: 原先只按 `max-width: 430px` 判断移动端，遇到桌面模式、较宽机型或特殊缩放时容易失效
- **解决**: 改为 `@media (max-width: 768px), (pointer: coarse)`，只要是触摸设备或常见手机宽度范围就自动切换为全屏沉浸式样式
- **涉及**: `demo/src/index.css`

### 记一下语音输入 (2026-03-18)
- **功能**: 在「记一下」弹窗中增加语音输入入口，支持通过 Web Speech API 直接口述内容
- **交互**: 输入框右侧增加圆形语音按钮，录音中切换为停止状态，图标样式参考微信语音输入的圆形扩音/声波样式
- **兼容**: 依赖浏览器原生语音识别能力，不同浏览器支持度不完全一致，优先在 Chrome / Safari 等现代浏览器使用
- **涉及**: `demo/src/components/QuickNoteSheet.jsx`

---

## 架构变更

### PWA 配置 (2026-03-17)
- **Service Worker**: `demo/public/sw.js` (手动实现缓存策略)
- **Manifest**: `demo/public/manifest.json`
- **图标**: `demo/public/icon-192.png`, `icon-512.png`
- **功能**: 支持离线访问、添加到主屏幕

---

## 部署配置

### 当前平台：Netlify
项目目前已部署至 Netlify，该平台在国内访问连通性相对较好。

### 其他备选方案 (Vercel)
- **Root Directory**: `demo`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 国内访问方案
| 平台 | 域名示例 | 国内访问 |
|------|---------|---------|
| Vercel | `xxx.vercel.app` | 不稳定 |
| Netlify | `xxx.netlify.app` | 较好 (当前部署) |
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
4. **通知权限**: 到期提醒/专注完成提醒依赖浏览器 Notification 权限，首次使用可能需要用户授权
5. **时间配置**: 当前番茄钟时长来自 `profile.focusMinutes`，休息时长来自 `profile.breakMinutes`
6. **任务历史**: 编辑当前任务名会自动生成一条历史任务记录，历史列表在「我的」页查看

---

*最后更新: 2026-03-18*
