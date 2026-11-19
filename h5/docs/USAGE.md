# uni-ui-h5 使用指南

`uni-ui-h5` 是面向 **移动 Web** 的独立组件库，同时支持 **React 18** / **Vue 3** / **Plain**。
设计基线为 375px 设计稿，源码写 px，构建时自动转换为 rem；组件本身零样式，视觉来自
`theme.css` 的 `--h5-*` token。

---

## 1. 安装

```bash
# React 项目
npm i uni-ui-h5 react react-dom

# Vue 项目
npm i uni-ui-h5 vue

# Plain 项目（另需 plain 运行时与编译器）
npm i uni-ui-h5 plain
```

`react` / `react-dom` / `vue` / `plain` 均为 **peer 依赖**，按所选端安装。

## 2. 引入组件

### React

```tsx
import 'uni-ui-h5/theme.css';
import { Button } from 'uni-ui-h5/react';

export function Actions() {
  return (
    <>
      <Button onClick={() => console.log('保存')}>保存</Button>
      <Button variant="secondary">取消</Button>
    </>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import 'uni-ui-h5/theme.css';
import { Button } from 'uni-ui-h5/vue';
</script>

<template>
  <Button @click="console.log('保存')">保存</Button>
  <Button variant="secondary">取消</Button>
</template>
```

### Plain

```tsx
import 'uni-ui-h5/theme.css';
import { Button } from 'uni-ui-h5/plain';

export function Actions() {
  return (
    <div class="actions">
      <Button onClick={() => console.log('保存')}>保存</Button>
      <Button variant="secondary">取消</Button>
    </div>
  );
}
```

Plain 的 `.tsx` 需由 `plain/vite` 插件编译为直接 DOM；写法见 `playground/src/plain-demos.tsx`。

> **关键约束**：必须 `import 'uni-ui-h5/theme.css'` 一次。组件文件不携带任何样式
> （无 scoped / 无运行时 CSS-in-JS），所有视觉来自该共享样式表。

## 3. rem 适配

### 3.1 构建期：px → rem

- 设计稿宽度：375px；`rootValue`：37.5（1rem = 37.5px）。
- `theme.css` 源码保持 px，构建产物 `dist/theme.css` 已转为 rem。
- 1px 发丝线保留 px（`minPixelValue: 2`），避免低 dpr 设备上消失。
- 媒体查询内的 px 不转换（`mediaQuery: false`），断点仍按物理像素书写。

配置见 `postcss.config.mjs`，转换逻辑见 `scripts/build-theme.mjs`。

### 3.2 运行期：根字号

```ts
import { setupRem } from 'uni-ui-h5/flexible';

const cleanup = setupRem(); // 根字号 = min(视口宽, maxWidth) / 375 * 37.5
```

可选参数：

| 参数 | 默认值 | 说明 |
|---|---|---|
| `designWidth` | `375` | 设计稿宽度 |
| `rootValue` | `37.5` | 设计稿对应的根字号 |
| `maxWidth` | `750` | 最大适配宽度，超过后不再放大 |

`setupRem()` 会监听 `resize` / `orientationchange` / `pageshow`，返回函数用于清理监听。
SSR 环境调用会直接返回空函数，不会访问 DOM。

## 4. 主题与暗色

所有颜色走 CSS 变量（`--h5-*`），应用侧覆盖变量即可换肤，无需改组件：

```css
:root {
  --h5-color-brand: #0a84ff;
  --h5-color-brand-active: #0060df;
  --h5-color-brand-soft: rgba(10, 132, 255, 0.12);
}
```

暗色主题只需在根元素加属性：

```html
<html data-theme="dark">
```

`theme.css` 的 `[data-theme="dark"]` 仅覆盖语义颜色 token，组件结构不变。
完整 token 列表见 [`contracts/token.md`](../contracts/token.md)。

## 5. Button

当前已实现 Button，支持：

- `variant`：`primary`（默认）/ `secondary` / `outline` / `ghost` / `danger`
- `size`：`large` / `medium`（默认）/ `small`
- `block` 通栏、`round` 胶囊、`loading` 加载态、`disabled` 禁用
- `icon` 图标节点、`type` 表单语义、`click` 事件（禁用 / 加载时不触发）

完整 API、行为与 DOM 契约见：

- [`contracts/button.api.md`](../contracts/button.api.md)
- [`contracts/button.behavior.md`](../contracts/button.behavior.md)
- [`contracts/button.dom.md`](../contracts/button.dom.md)

## 6. Playground

三端并排展示同一组 Button 用例，并演示 rem 根字号随视口变化：

```bash
cd playground
pnpm install
pnpm dev        # http://localhost:5181
```

Playground 通过 alias 直接消费 `src/` 源码与 `theme.css`，无需先构建库。

## 7. 构建与测试

```bash
pnpm install
pnpm run typecheck          # React / Vue
pnpm run typecheck:plain    # Plain
pnpm run build              # 单文件产物
pnpm run build:modules      # 按组件拆分产物
pnpm run build && pnpm test # Plain Button 行为测试
```

测试位于 `test/plain/`，使用 Node 原生 test runner + jsdom，直接消费 `dist/plain.js`。
