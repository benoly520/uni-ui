# Empty · 行为契约（empty.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-empty`（§487-§488）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 默认 | 居中列布局：图标（opacity .5）→ 描述 → 操作 | 渲染 |
| hover（操作） | 由内部按钮自身态决定 | 指针悬停操作区 |

## 布局
- `flex` 列、居中、`gap: var(--ui-space-3)`、`padding: var(--ui-space-6)`、文字 `var(--ui-text-muted)`（§487）。
- 图标 `.ico` 固定 `40×40`、`opacity:.5`（§488），弱化视觉权重。

## 键盘 / a11y
- 根 `role="status"`（或 `aria-live="polite"`）可选；描述 `.ui-label` 提供语义。
- 操作插槽内的按钮按 Button 规范可达（Tab / Enter / Space）。

## 图标默认
- 未传 `icon` 时渲染 `table` 占位（`<i data-lucide="table">`），与预览 §1232 一致；真实工程传入图标组件（lucide-react / lucide-vue-next）覆盖。
