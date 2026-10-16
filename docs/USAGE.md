# uni-ui 使用指南（Playground + 使用说明）

`uni-ui` 是同时支持 **React 18** / **Vue 3** / **Plain** 三端的 PC 端 Web 组件库，设计语言为 macOS 毛玻璃、紧凑密度、七色品牌色、rem 单位（默认亮色，可切暗色）。本指南说明如何安装、引入、主题化，以及如何运行内置的**三端 Playground**（React / Vue / Plain 逐端渲染同一用例）。

---

## 1. 安装

```bash
# React 项目
npm i uni-ui react react-dom

# Vue 项目
npm i uni-ui vue

# Plain 项目（另需 plain 运行时）
npm i uni-ui plain
```

`react` / `react-dom` / `vue` / `plain` 均为 **peer 依赖**，按所选端安装。库本身**零运行时样式**，视觉全部来自一份共享设计系统。

## 2. 引入组件

### React

```tsx
import { Button, Tree, DatePicker, toast } from 'uni-ui/react';
import 'uni-ui/theme.css'; // 必须：一次性引入设计系统（组件零样式）

export function Toolbar() {
  return (
    <div>
      <Button variant="primary" onClick={() => toast('已保存')}>保存</Button>
      <DatePicker range defaultValue={['2026-01-01', '2026-01-31']} />
    </div>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { Button, Tree, DatePicker, toast } from 'uni-ui/vue';
import 'uni-ui/theme.css';
</script>

<template>
  <div>
    <Button variant="primary" @click="toast('已保存')">保存</Button>
    <DatePicker range :default-value="['2026-01-01', '2026-01-31']" />
  </div>
</template>
```

> **关键约束**：必须 `import 'uni-ui/theme.css'` 一次。组件文件不携带任何样式（无 scoped / 无运行时 CSS-in-JS），所有视觉来自该共享样式表。

Plain 端同构：`import { Button } from 'uni-ui/plain'`，配合 `plain/vite` 插件编译 JSX，写法见 `playground/src/plain-demos.tsx`。

## 3. 主题、暗色与换肤

所有颜色走 CSS 变量（`--ui-*`），应用侧覆盖变量即可换肤，无需改组件。默认是**亮色**（`:root` 为暖近白 + Mac 系统蓝）；切暗色只需在宿主根元素加属性，毛玻璃材质会同步换成深底：

```html
<html data-theme="dark">
```

```css
:root {
  --ui-color-brand: #0a84ff;                        /* 品牌主色：换肤唯一入口 */
  --ui-color-brand-hover: #0a6cf0;
  --ui-color-brand-soft: rgba(10, 132, 255, 0.12);  /* 派生强调底（hover / 选中 / 焦点环） */
  --ui-bg: #f5f5f7;                                 /* 页面背景 */
  --ui-bg-elevated: #ffffff;                        /* 抬升面（卡片 / 浮层） */
}
```

市场域另有独立的涨跌色约定，与 `danger` / `success` 刻意分开（中国「红=涨」不是 danger）：默认 `cn` 红涨绿跌，加 `data-mkt="intl"` 切国际绿涨红跌。

### 3.1 字体（需自行加载）

库**零字体依赖**：`theme.css` 不含任何 `@font-face`，只定义三条字体栈 token：

| token | 默认栈 | 用途 |
|---|---|---|
| `--ui-font-display` | `"Cabinet Grotesk", -apple-system, ...` | 标题 / 展示字 |
| `--ui-font-body` | `"Satoshi", -apple-system, "PingFang SC", ...` | 正文与控件 |
| `--ui-font-mono` | `"JetBrains Mono", ui-monospace, ...` | 数值与代码 |

应用侧不加载这些字体时，渲染会**静默回落**到系统 sans：macOS 上尚可，Windows / 内网机器上观感会明显偏离设计调性（这是「零依赖」的代价，故必须显式决策）。Playground 的做法是 CDN 引入：

```html
<!-- Fontshare：展示字 Cabinet Grotesk + 正文 Satoshi -->
<link rel="preconnect" href="https://api.fontshare.com" crossorigin />
<link
  href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&f[]=cabinet-grotesk@700,800&display=swap"
  rel="stylesheet"
/>
<!-- Google Fonts：等宽 JetBrains Mono -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

生产环境建议**自托管**（字体属视觉资产，且部分网络下 CDN 不可达）；不想引入外部字体时，直接覆盖 token 即可，组件无需改动：

```css
:root {
  --ui-font-display: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  --ui-font-body: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  --ui-font-mono: ui-monospace, "SF Mono", Consolas, monospace;
}
```

## 4. 按需引入（可选）

默认发布为单文件 ESM bundle（`uni-ui/react`、`uni-ui/vue`、`uni-ui/plain`），由使用方打包器 tree-shaking 按需。

若需按组件直引（更彻底 tree-shaking），发布方可用 `pnpm run build:modules` 产出按组件拆分的文件，使用方即可：

```ts
import { Button } from 'uni-ui/react/Button';      // React 按组件直引
import Tree from 'uni-ui/vue/Tree.vue';            // Vue 按组件直引（SFC）
import { Button } from 'uni-ui/plain/Button';      // Plain 按组件直引
```

（详见主架构文档 §17.33 / §17.35。）

## 5. 命令式辅助

浮层反馈类提供命令式 API（无需在 JSX 里声明节点）：

```ts
import { toast, showMessage } from 'uni-ui/react'; // 或 uni-ui/vue、uni-ui/plain

toast('操作成功', { duration: 2400 });                 // 轻提示，duration=0 常驻
showMessage('数据已更新', 'success');                  // 顶部通知，type: info|success|warning|error
```

## 6. 运行 Playground（三端对比）

仓库内置 `playground/` —— 一个 Vite 应用：顶栏在「首页 / 组件」间路由，组件页左侧导航切换组件，主区用 **React / Vue / Plain 三个框架页签**逐端渲染同一用例（附可复制的示例代码与 API 速查表），用于验证三端 DOM 一致性。

```bash
cd playground
pnpm install
pnpm dev        # 开发模式，热更新，默认 http://localhost:5180
# 或
pnpm build && pnpm preview   # 生产构建预览
```

Playground 通过 Vite alias 直接消费库**源码**（`uni-ui/react` → `src/react/index.ts`、`uni-ui/vue` → `src/vue/index.ts`、`uni-ui/plain` → `src/plain/index.ts`、`uni-ui/theme.css` → `theme.css`），因此改组件源码即时热更，且演示的就是真实的消费路径。

### 目录结构

```
playground/
  index.html
  vite.config.ts        # alias：uni-ui/react|vue|plain|theme.css → 库源码；react/vue/plain 强制单实例
  src/
    main.ts             # 外壳：顶栏导航 + hash 路由（首页 / 组件）
    home.ts             # 首页叙事区块
    showcase.ts         # 组件页：侧边导航 + 三端页签 + 代码块 + API 表
    controls.ts         # 顶栏全局控件（主题 / 涨跌色 / 密度 / 品牌色）
    registry.ts         # 组件清单（分类 + 元数据 + API 速查）
    react-demos.tsx     # 各组件的 React 演示（key = 导出名）
    vue-demos.ts        # 各组件的 Vue 演示（h() 渲染函数，key = 导出名）
    plain-demos.tsx     # 各组件的 Plain 演示（key = 导出名）
    playground.css      # 仅外壳布局样式（pg- 前缀，不与 ui-* 冲突）
```

> 本文件位于仓库根的 `docs/`，不在 playground 内。

### 新增一个组件演示

1. `src/react-demos.tsx` 增加一个 key 为组件名的用例；
2. `src/vue-demos.ts` 与 `src/plain-demos.tsx` 补同 key 的用例（用例标题与 code 串三端对齐）；
3. `src/registry.ts` 里加一条组件元数据（`id` / `label` / `category` / `summary` / `api`）。

key 必须与组件导出名一致（如 `Button`），三端共用同一 key。

## 7. 契约文档

每个组件有一套契约文档（`contracts/<name>.{api,behavior,dom}.md`），是组件实现的**唯一事实来源**：

- `*.api.md`：props / events / 命令式 API 与类型
- `*.behavior.md`：交互行为与可访问性（焦点、键盘、ARIA）
- `*.dom.md`：实际产出的 DOM 结构与 class（DOM 快照基准）

排障或二开组件时，先读契约，再读 `src/react/<Name>.tsx` / `src/vue/<Name>.vue` / `src/plain/<Name>.tsx`。

## 8. 设计铁律（给二开者）

- **三禁**：禁 scoped 样式、禁运行时 CSS-in-JS、禁 CSS Modules 自动 hash（class 手写稳定字符串）。
- **组件零样式**：视觉只来自 `theme.css` 已有 class，组件文件不写 CSS、不改 `theme.css`。
- **三端 DOM 一致**：React / Vue / Plain 产出完全一致的标签、class、层级。
- **零字体依赖**：`theme.css` 不含 `@font-face`，展示字体由应用侧加载（见 §3.1），缺失时回落系统字体。
