# 图标插槽契约（icon.md）

> 组件**不内置**图标库。任意满足下契约的 SVG 节点塞入 `icon` 插槽即可（§17.27）。

## 契约（icon 插槽）
- 形状：24×24 viewBox。
- 描边：`stroke="currentColor"`（填充图标用 `fill="currentColor"`）。
- 尺寸：由 `.ui-icon` 的 `--ui-icon-size` 决定，随 `.ui-size-*` 档位缩放。
- 颜色：继承 `currentColor`，随文字色变。

## 推荐体系：lucide（非内置）
- MIT / ISC，线性风格，2126 个图标（v1.51.0，本地 `vendor/lucide.min.js`）。
- 预览零构建写法：`<span class="ui-icon"><i data-lucide="plus"></i></span>` + 页尾 `lucide.createIcons()`。
- 真实工程用法（不靠运行时 createIcons）：
  - React：`import { Plus } from 'lucide-react'`
  - Vue：`import { Plus } from 'lucide-vue-next'`
  - 把图标组件塞进 `icon` 插槽，尺寸 / 颜色由 `.ui-icon` 统一接管。

## 可替换性
- heroicons / 自有图标集只要满足 24×24 + currentColor 即可无缝替换，组件不感知具体图标集——这是「零内置、可换」设计意图。
