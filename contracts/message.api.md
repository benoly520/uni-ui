# Message · API 契约（message.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-message`（§1618 / §466 / §1887-§1899）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-message`（必首位）+ `ui-message--{type}`
- 角色 / 无障碍：`role="status"` `aria-live="polite"`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `show` | `boolean` | `false` | 独立 `show` 类（入场/退场动画，CSS `.ui-message.show`） | 可见性；命令式 `showMessage()` 内部切换 |
| `type` | `'success' \| 'warning' \| 'info' \| 'danger'` | `'info'` | `ui-message--{type}` | 类型，左 `.dot` 用语义色 token（§473-§476） |
| `content` | 节点 | — | 渲染进 `.msg-text` | 通知正文 |
| `children` | 节点 | — | 覆盖 `content` | 直接传复杂节点 |
| `className` | `string` | — | 附加 class | |
| `style` | `CSSProperties` | — | 内联样式 | |

## 插槽
- **默认插槽 / content**：正文，固定包入 `<span class="msg-text">`。
- **dot**：类型色圆点，固定 `<span class="dot">`，颜色由 `ui-message--{type}` 决定（success→`--ui-color-success` 等）。

## 辅助函数（命令式）
- `showMessage(text, type?, duration?)`：`text` 为 ReactNode/VNode；`type` 默认 `info`；`duration` 默认 `2600`ms。
  - React 实现（`src/react/message.ts`）：`createRoot` 挂 body，切换 `.show`。
  - Vue 实现（`src/vue/message.ts`）：`createApp` + `h(Message)` 挂 body，响应式切换 `show`。
  - 两侧行为一致：单例容器、自动消失、`.dot` 随 type 变语义色。

## 命名纪律
- 根 `ui-message` 必首位；类型 `ui-message--{type}`；可见态追加**独立的** `show` 类（CSS 复合选择器 `.ui-message.show`）；**禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
