# Popover · API 契约（popover.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-popover > .ui-popover-panel`（§Popover 区块）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-popover`（`<div>`，`position: relative`）
- 面板 class：`ui-popover-panel`（`role="dialog"`，默认 `top: calc(100% + 8px); left: 0`；`[hidden]` 隐藏）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `content` | `ReactNode` / `slot` | — | 包入 `.ui-popover-panel` | 面板内容（可含可交互元素，如按钮） |
| `open` | `boolean` | — | 受控显隐（`hidden` 反转） | 受控显示 |
| `defaultOpen` | `boolean` | `false` | — | 非受控初始显示 |
| `onOpenChange` | `(open: boolean) => void` | — | — | 显隐回调 |
| `ariaLabel` | `string` | `'Popover'` | `.ui-popover-panel` 的 `aria-label` | 面板无障碍标签 |
| `id` | `string` | 自动生成 | 面板 `id` | 用于 trigger `aria-controls` |
| `className` / `style` | — | — | 透传到根 | — |

## 插槽
- **默认插槽**：触发元素（如 `<button>`），组件注入 `aria-expanded` + `aria-controls`。
- **content**：面板内容。

## 事件
- `onOpenChange(open)`：显示/隐藏状态切换时触发（hover/focus/click/外部点击/Esc）。

## 与 Tooltip 区别
- Popover 面板**可交互**（按钮可点）；Tooltip 为纯标签展示、不可交互。
- 因此 Popover 用 `role="dialog"`（Tooltip 用 `role="tooltip"`），且不因移动到气泡而关闭。

## 命名纪律
- 根 `ui-popover` 必首位；面板 `ui-popover-panel` 紧随触发元素。
- 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
