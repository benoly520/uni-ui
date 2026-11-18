# Badge · 行为契约（badge.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-badge`（§17.x / §17.23）。键盘 / ARIA 两侧必须一致。

## 交互状态
- 纯展示组件，无 hover / active / focus 专属态。
- `tone` 仅改变底色与前景色（token 驱动）。

## 状态机
- 无状态切换；`count` 决定可见性：
  - `count == null` → 渲染 `children`（或 `dot + children`）。
  - `count != null && count === 0 && !showZero` → 不渲染（`null`）。
  - `count != null && (count > 0 || showZero)` → 渲染截断后的数字。

## 渲染规则
- `dot` 为真：`<span class="ui-badge"><span class="ui-badge-dot" style="..."></span>{children}</span>`。
- `count` 为真：`<span class="ui-badge">{display}</span>`，`display = count > max ? ${max}+ : count`。
- 二者皆无：`<span class="ui-badge">{children}</span>`。

## 键盘 / a11y
- `aria-hidden` 默认不设置；计数徽标建议调用方用 `aria-label` 包裹（如 `aria-label="3 条未读"）。
- 纯装饰 dot 可由调用方置 `aria-hidden="true"`；组件本身不强制。

## 表单语义
- 不参与表单提交。
