# 设计 Token 规范

本文档用于把 `07_页面UI方案.md` 中的视觉建议，收敛为可被设计系统和前端实现共同使用的 `design token`。

目标：

- 让视觉规范从“描述”变成“可复用变量”
- 方便 UI 设计稿统一调用
- 方便前端落地时建立主题与组件映射

适用范围：

- 首版 iOS / Android App
- 低保真到高保真设计稿
- 前端样式变量、主题配置、组件库

## 1. Token 设计原则

- 优先使用语义 token，而不是直接写颜色值
- 基础 token 只定义视觉原子，不绑定业务语义
- 组件 token 只解决组件内部样式，不重复定义基础值
- 页面层尽量消费组件 token，而不是直接操作基础 token

推荐分层：

1. Primitive Tokens：基础原子，如颜色、字号、圆角
2. Semantic Tokens：语义层，如主文本、卡片背景、危险状态
3. Component Tokens：组件层，如按钮、卡片、标签、输入框

## 2. 命名规范

建议统一采用英文 token 命名，便于设计工具与前端同步。

命名建议：

- 基础层：`color.blue.500`
- 语义层：`color.text.primary`
- 组件层：`button.primary.bg.default`

命名原则：

- 结构固定
- 含义清晰
- 避免与具体页面强绑定

## 3. 色彩 Tokens

## 3.1 Primitive Colors

```yaml
color:
  blue:
    50: "#EAF2FF"
    100: "#D7E7FF"
    300: "#8BB4FF"
    500: "#4C8BF5"
    600: "#3D73D1"
  green:
    100: "#EAF8EF"
    500: "#34C759"
    600: "#28A745"
  orange:
    100: "#FFF3E1"
    500: "#FFB340"
    600: "#F59E0B"
  red:
    100: "#FFE8E8"
    500: "#FF6B6B"
    600: "#E55454"
  purple:
    100: "#F2EAFF"
    500: "#9B7BFF"
  teal:
    100: "#E6F8F5"
    500: "#55C7B8"
  gray:
    0: "#FFFFFF"
    50: "#F7F8FA"
    100: "#F1F3F5"
    200: "#E5E7EB"
    300: "#D1D5DB"
    500: "#6B7280"
    700: "#4B5563"
    900: "#1F2937"
```

## 3.2 Semantic Colors

```yaml
color:
  bg:
    page: "{color.gray.50}"
    surface: "{color.gray.0}"
    surfaceSoft: "{color.blue.50}"
    overlay: "rgba(31,41,55,0.32)"
  text:
    primary: "{color.gray.900}"
    secondary: "{color.gray.700}"
    tertiary: "{color.gray.500}"
    inverse: "{color.gray.0}"
    brand: "{color.blue.500}"
  border:
    default: "{color.gray.200}"
    strong: "{color.gray.300}"
    brand: "{color.blue.300}"
    danger: "{color.red.500}"
  icon:
    primary: "{color.gray.900}"
    secondary: "{color.gray.700}"
    tertiary: "{color.gray.500}"
    brand: "{color.blue.500}"
    inverse: "{color.gray.0}"
  fill:
    brand: "{color.blue.500}"
    brandSoft: "{color.blue.50}"
    success: "{color.green.500}"
    warning: "{color.orange.500}"
    danger: "{color.red.500}"
    neutralSoft: "{color.gray.100}"
```

## 3.3 Tag Colors

用于记录类型标签：

```yaml
tag:
  thought:
    bg: "#EEF3FB"
    text: "#58708F"
  research:
    bg: "#F2EAFF"
    text: "#7A5CC2"
  task:
    bg: "#EAF2FF"
    text: "#3D73D1"
  emotion:
    bg: "#FFF1EC"
    text: "#D97757"
  idea:
    bg: "#E8F8EF"
    text: "#2E8B57"
```

建议业务映射：

- `thought`：杂念
- `research`：待查
- `task`：任务
- `emotion`：情绪
- `idea`：灵感

## 4. Typography Tokens

## 4.1 Font Family

```yaml
font:
  family:
    base: "SF Pro Text, PingFang SC, Helvetica Neue, Arial, sans-serif"
    mono: "SFMono-Regular, Menlo, monospace"
```

## 4.2 Font Size

```yaml
font:
  size:
    xs: 12
    sm: 14
    md: 16
    lg: 18
    xl: 20
    xxl: 24
    display: 32
```

## 4.3 Font Weight

```yaml
font:
  weight:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
```

## 4.4 Line Height

```yaml
font:
  lineHeight:
    xs: 18
    sm: 20
    md: 24
    lg: 26
    xl: 30
    display: 38
```

## 4.5 Semantic Typography

```yaml
textStyle:
  pageTitle:
    fontSize: "{font.size.xxl}"
    fontWeight: "{font.weight.semibold}"
    lineHeight: "{font.lineHeight.xl}"
  sectionTitle:
    fontSize: "{font.size.lg}"
    fontWeight: "{font.weight.semibold}"
    lineHeight: "{font.lineHeight.lg}"
  cardTitle:
    fontSize: "{font.size.md}"
    fontWeight: "{font.weight.semibold}"
    lineHeight: "{font.lineHeight.md}"
  body:
    fontSize: "{font.size.sm}"
    fontWeight: "{font.weight.regular}"
    lineHeight: "{font.lineHeight.md}"
  caption:
    fontSize: "{font.size.xs}"
    fontWeight: "{font.weight.regular}"
    lineHeight: "{font.lineHeight.xs}"
  statNumber:
    fontSize: "{font.size.display}"
    fontWeight: "{font.weight.semibold}"
    lineHeight: "{font.lineHeight.display}"
```

## 5. Spacing Tokens

建议使用 4 的倍数体系。

```yaml
space:
  0: 0
  1: 4
  2: 8
  3: 12
  4: 16
  5: 20
  6: 24
  8: 32
  10: 40
  12: 48
  14: 56
  16: 64
```

语义映射建议：

```yaml
layout:
  pagePaddingX: "{space.4}"
  pagePaddingTop: "{space.5}"
  sectionGap: "{space.6}"
  cardGap: "{space.3}"
  inlineGap: "{space.2}"
  chipGap: "{space.2}"
```

## 6. Radius Tokens

```yaml
radius:
  none: 0
  sm: 8
  md: 12
  lg: 16
  xl: 20
  xxl: 24
  full: 999
```

映射建议：

- 输入框：`radius.lg`
- 卡片：`radius.lg`
- 主按钮：`radius.xl`
- 弹层：`radius.xxl`
- 标签：`radius.full`

## 7. Border Tokens

```yaml
border:
  width:
    none: 0
    thin: 1
    medium: 2
```

使用建议：

- 默认边框：`1px`
- 选中态高亮边框：`2px`

## 8. Shadow Tokens

首版建议只保留 2 层阴影，避免视觉过重。

```yaml
shadow:
  sm: "0 2px 8px rgba(31,41,55,0.06)"
  md: "0 8px 24px rgba(31,41,55,0.10)"
```

映射建议：

- 普通卡片：可无阴影，优先边框
- 悬浮按钮：`shadow.sm`
- 弹层：`shadow.md`

## 9. Motion Tokens

动画应服务于“轻”和“快”，不应引起额外注意。

```yaml
motion:
  duration:
    fast: 120ms
    normal: 200ms
    slow: 280ms
  easing:
    standard: "cubic-bezier(0.2, 0, 0, 1)"
    entrance: "cubic-bezier(0.16, 1, 0.3, 1)"
    exit: "cubic-bezier(0.4, 0, 1, 1)"
```

使用建议：

- 按钮反馈：`fast`
- 弹层上滑：`normal`
- 页面切换：`normal`

## 10. Opacity Tokens

```yaml
opacity:
  disabled: 0.4
  muted: 0.64
  overlay: 0.32
```

## 11. ZIndex Tokens

```yaml
zIndex:
  base: 0
  sticky: 10
  floating: 20
  overlay: 30
  sheet: 40
  toast: 50
```

## 12. Icon Tokens

```yaml
icon:
  size:
    sm: 16
    md: 20
    lg: 24
    xl: 28
```

建议图标风格：

- 线性图标为主
- 转折圆润
- 避免过度拟物

## 13. Component Tokens

## 13.1 Button

```yaml
button:
  primary:
    height: 52
    paddingX: "{space.4}"
    radius: "{radius.xl}"
    bg:
      default: "{color.fill.brand}"
      pressed: "{color.blue.600}"
      disabled: "{color.gray.300}"
    text:
      default: "{color.text.inverse}"
      disabled: "{color.text.inverse}"
  secondary:
    height: 44
    paddingX: "{space.4}"
    radius: "{radius.lg}"
    bg:
      default: "{color.bg.surface}"
      pressed: "{color.gray.100}"
      disabled: "{color.gray.100}"
    border:
      default: "{color.border.default}"
      pressed: "{color.border.strong}"
    text:
      default: "{color.text.primary}"
      disabled: "{color.text.tertiary}"
  ghost:
    height: 40
    paddingX: "{space.3}"
    radius: "{radius.lg}"
    text:
      default: "{color.text.secondary}"
      pressed: "{color.text.primary}"
```

## 13.2 Input

```yaml
input:
  textArea:
    minHeight: 96
    padding: "{space.4}"
    radius: "{radius.lg}"
    bg: "{color.bg.surface}"
    border:
      default: "{color.border.default}"
      focus: "{color.border.brand}"
      error: "{color.border.danger}"
    text:
      value: "{color.text.primary}"
      placeholder: "{color.text.tertiary}"
```

## 13.3 Chip

```yaml
chip:
  height: 32
  paddingX: "{space.3}"
  radius: "{radius.full}"
  textStyle: "{textStyle.caption}"
  default:
    bg: "{color.gray.100}"
    text: "{color.text.secondary}"
  selected:
    bg: "{color.fill.brandSoft}"
    text: "{color.text.brand}"
    border: "{color.border.brand}"
```

## 13.4 Card

```yaml
card:
  default:
    bg: "{color.bg.surface}"
    border: "{color.border.default}"
    radius: "{radius.lg}"
    padding: "{space.4}"
  highlight:
    bg: "{color.bg.surfaceSoft}"
    border: "{color.border.brand}"
    radius: "{radius.lg}"
    padding: "{space.4}"
```

## 13.5 BottomSheet

```yaml
bottomSheet:
  bg: "{color.bg.surface}"
  radiusTop: "{radius.xxl}"
  paddingTop: "{space.3}"
  paddingX: "{space.4}"
  paddingBottom: "{space.6}"
  shadow: "{shadow.md}"
```

## 13.6 SegmentedControl

```yaml
segmentedControl:
  height: 36
  radius: "{radius.full}"
  bg: "{color.gray.100}"
  thumbBg: "{color.bg.surface}"
  text:
    default: "{color.text.secondary}"
    selected: "{color.text.primary}"
```

## 13.7 Toast

```yaml
toast:
  bg: "{color.gray.900}"
  text: "{color.text.inverse}"
  radius: "{radius.lg}"
  paddingX: "{space.4}"
  paddingY: "{space.3}"
```

## 14. 页面映射建议

为避免 token 使用失控，建议每个页面优先消费以下语义层：

### 首页

- 背景：`color.bg.page`
- 当前任务卡：`card.highlight`
- 待回看卡：`card.default`
- 主按钮：`button.primary`

### 闪记弹层

- 容器：`bottomSheet`
- 输入框：`input.textArea`
- 快捷项：`chip`
- 保存按钮：`button.primary`

### 回看箱

- 页面背景：`color.bg.page`
- 筛选：`segmentedControl`
- 记录卡片：`card.default`
- 主要动作：`button.secondary`

### 统计页

- 数字：`textStyle.statNumber`
- 图表底卡：`card.default`
- 建议卡片：`card.highlight`

## 15. 前端落地建议

为了方便前端实现，建议同步维护两层产物：

- 设计侧：Figma Variables / Styles
- 代码侧：`tokens.json` 或 `theme.ts`

推荐代码结构：

```ts
export const tokens = {
  color: {},
  font: {},
  space: {},
  radius: {},
  shadow: {},
  motion: {},
  component: {},
};
```

落地原则：

- 页面中禁止直接写十六进制颜色
- 组件中优先使用语义 token
- 只在 token 文件内维护基础数值

## 16. 首版最小 Token 集

如果第一版时间紧，可以先只落以下最小集合：

- 色彩：基础色 + 语义色
- 字体：字号、字重、行高
- 间距：4/8/12/16/24/32
- 圆角：12/16/20/24/full
- 阴影：2 层
- 组件：按钮、输入框、卡片、标签、弹层

这套最小 token 已足够支撑首版全部页面。
