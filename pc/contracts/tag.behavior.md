# Tag · 行为契约（tag.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tag`（§459-§463）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| hover | 无特殊态（标签为静态标识） | 指针悬停 |
| focus（关闭钮） | 焦点圈（`:focus-visible`） | 键盘聚焦关闭按钮 |
| active | 关闭钮按下态 | 点击 |

## 关闭交互
- `closable` 显示关闭 `<button class="ui-tag-close">`，`aria-label="关闭"`，点击触发 `onClose`。
- 关闭钮为真实 `<button>`，Tab 可达、Enter / Space 触发；`×` 字符 `aria-hidden`。
- 仅发出 `onClose`，是否从列表移除由父组件状态决定（受控/非受控皆由调用方处理）。

## 键盘 / a11y
- 标签本体为纯展示 `<span>`，无交互语义（非按钮），无需 `role`。
- 关闭钮 `aria-label` 保证读屏识别「关闭」。

## 自定义色
- `color` 同时写 `color` 与 `border-color`（对齐 `ui-tag--{type}` 的双向着色，§461-§463），覆盖 type 着色。
- 颜色零硬编码（除 #fff/#000）：用户传 `var(--ui-*)` 或任意色值，组件不内置色。
