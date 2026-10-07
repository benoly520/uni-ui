# Tag · API 契约（tag.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tag`（§1203-§1206 / §1636-§1638 / §459-§463）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-tag`（必首位）
- 原生元素：`<span>`（行内标签；可关闭态内含 `<button>`）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `type` | `'brand' \| 'up' \| 'down' \| 'default'` | `'default'` | `ui-tag--brand` / `ui-tag--up` / `ui-tag--down` | 语义类型（`default` 无修饰类） |
| `closable` | `boolean` | `false` | `ui-tag--closable` + 内置关闭 `<button>` | 可关闭标签 |
| `color` | `string`（token / 色值） | — | 内联 `color` + `border-color`（覆盖 type） | 自定义色 |
| `icon` | 节点（24×24 + currentColor） | — | 包入 `.ui-icon` 插槽，置于文本前 | 见 `icon.md` |
| `onClose` | `() => void` | — | 关闭按钮点击 | 仅 `closable` 时有效 |

## 插槽
- **默认插槽**：标签文本或任意节点。
- **icon 插槽**：`<span class="ui-icon">{icon}</span>`，位于文本前。

## 事件
- `onClose` / `close`：点击关闭按钮（仅 `closable`）。

## 关闭按钮
- `closable` 时渲染 `<button type="button" class="ui-tag-close" aria-label="关闭">`，内联 `var(--ui-*)` 样式（无硬色值）。

## 命名纪律
- 根 `ui-tag` 必首位；类型 `ui-tag--{type}`；`default` 不生成修饰类（§459 默认即中性色）。**禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
