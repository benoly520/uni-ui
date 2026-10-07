# uni-ui 使用指南（Playground + 使用说明）

`uni-ui` 是同时支持 **React 18** 与 **Vue 3** 的 PC 端 Web 组件库，设计语言为 macOS 毛玻璃、紧凑、默认暗色、七色品牌色、rem 单位。本指南说明如何安装、引入、主题化，以及如何运行内置的**双框架 Playground**（React 与 Vue 同一组件并排对比）。

---

## 1. 安装

```bash
# React 项目
npm i uni-ui react react-dom

# Vue 项目
npm i uni-ui vue
```

`react` / `react-dom` / `vue` 均为 **peer 依赖**，需由使用方项目安装。库本身**零运行时样式**，视觉全部来自一份共享设计系统。

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

## 3. 主题与暗色

默认即暗色 macOS 毛玻璃。所有颜色走 CSS 变量（`--ui-*`，如 `--ui-color-up` / `--ui-color-down` / 七色品牌色），应用侧覆盖变量即可换肤，无需改组件。

```css
:root {
  --ui-accent: #6ea8fe;     /* 品牌主色 */
  --ui-bg: #0b0d12;        /* 页面背景 */
  --ui-surface: rgba(255,255,255,.04);
}
```

## 4. 按需引入（可选）

默认发布为单文件 ESM bundle（`uni-ui/react`、`uni-ui/vue`），由使用方打包器 tree-shaking 按需。

若需按组件直引（更彻底 tree-shaking），发布方可用 `pnpm run build:modules` 产出按组件拆分的文件，使用方即可：

```ts
import { Button } from 'uni-ui/react/Button';      // React 按组件直引
import Tree from 'uni-ui/vue/Tree.vue';            // Vue 按组件直引（SFC）
```

（详见主架构文档 §17.33 / §17.35。）

## 5. 命令式辅助

浮层反馈类提供命令式 API（无需在 JSX 里声明节点）：

```ts
import { toast, showMessage } from 'uni-ui/react'; // 或 uni-ui/vue

toast('操作成功', { duration: 2400 });                 // 轻提示，duration=0 常驻
showMessage('数据已更新', 'success');                  // 顶部通知，type: info|success|warning|error
```

## 6. 运行 Playground（双框架对比）

仓库内置 `playground/` —— 一个 Vite 应用，同一页左侧导航切换组件，**右半 React、右半 Vue 并排渲染同一组件**，直观验证双框架 DOM 一致性。

```bash
cd playground
pnpm install
pnpm dev        # 开发模式，热更新，默认 http://localhost:5180
# 或
pnpm build && pnpm preview   # 生产构建预览
```

Playground 通过 Vite alias 直接消费库**源码**（`uni-ui/react` → `src/react/index.ts`、`uni-ui/vue` → `src/vue/index.ts`、`uni-ui/theme.css` → `theme.css`），因此改组件源码即时热更，且演示的就是真实的 `uni-ui/react`、`uni-ui/vue` 消费路径。

### 目录结构

```
playground/
  index.html
  vite.config.ts        # alias：uni-ui/react|vue|theme.css → 库源码；react/vue 强制单实例
  src/
    main.ts             # 外壳：侧边导航 + React/Vue 双面板挂载
    registry.ts         # 组件清单（分类 + 元数据）
    react-demos.tsx     # 各组件的 React 演示（与导出名同 key）
    vue-demos/          # 各组件的 Vue SFC 演示（Button.vue …，与导出名同 key）
    playground.css      # 仅外壳布局样式（pg- 前缀，不与 ui-* 冲突）
  docs/USAGE.md         # 本文件
```

### 新增一个组件演示

1. `src/react-demos.tsx` 增加一个 key 为组件名的函数组件；
2. `src/vue-demos/<Name>.vue` 写对应的 SFC，并在 `src/vue-demos/index.ts` 登记；
3. `src/registry.ts` 的 `categories` 里加一条 `{ id: '<Name>', label, category, desc }`。

key 必须与组件导出名一致（如 `Button`），React 与 Vue 两侧共用同一 key。

## 7. 契约文档

每个组件有一套契约文档（`contracts/<name>.{api,behavior,dom}.md`），是组件实现的**唯一事实来源**：

- `*.api.md`：props / events / 命令式 API 与类型
- `*.behavior.md`：交互行为与可访问性（焦点、键盘、ARIA）
- `*.dom.md`：实际产出的 DOM 结构与 class（DOM 快照基准）

排障或二开组件时，先读契约，再读 `src/react/<Name>.tsx` / `src/vue/<Name>.vue`。

## 8. 设计铁律（给二开者）

- **三禁**：禁 scoped 样式、禁运行时 CSS-in-JS、禁 CSS Modules 自动 hash（class 手写稳定字符串）。
- **组件零样式**：视觉只来自 `theme.css` 已有 class，组件文件不写 CSS、不改 `theme.css`。
- **双框架 DOM 一致**：React / Vue 产出完全一致的标签、class、层级。
