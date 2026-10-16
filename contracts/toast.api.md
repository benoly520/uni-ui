# Toast · API 契约（toast.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-toast`（§1615 / §852 / §376）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-toast`（必首位）+ `ui-glass`（毛玻璃背景，预览实证 §852/§1615）
- 角色 / 无障碍：`role="status"` `aria-live="polite"`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `show` | `boolean` | `false` | 独立 `show` 类（入场/退场动画，CSS `.ui-toast.show`） | 可见性；命令式 `toast()` 内部切换 |
| `content` | 节点（ReactNode / VNode） | — | 渲染为文本/节点子项 | 轻提示正文 |
| `icon` | 节点（24×24 + currentColor） | — | 包入 `.ui-icon` 插槽，置于文本前 | 见 `icon.md`；图标容器统一 `.ui-icon`（预览页原始标记用 `.ui-avatar` ✓） |
| `children` | 节点 | — | 覆盖 `content` | 直接传复杂节点（如图标 + 文本混排） |
| `className` | `string` | — | 附加 class | |
| `style` | `CSSProperties` | — | 内联样式（位置/尺寸微调） | |

## 插槽
- **默认插槽 / content**：正文文本或任意节点。
- **icon 插槽**：`<span class="ui-icon">{icon}</span>`，位于正文前；尺寸随 `--ui-icon-size`，颜色 `currentColor`。

## 辅助函数（命令式）
- `toast(content, options?)`：`content` 为 ReactNode/VNode；`options = { icon?, duration? }`。
  - `duration` 默认 `2400`ms，到期后自动隐藏；`0` 不自动关闭。
  - React 实现（`src/react/toast.ts`）：在 `document.body` 下挂容器，`createRoot` 渲染 `<Toast>`，切换 `.show`。
  - Vue 实现（`src/vue/toast.ts`）：`createApp` + `h(Toast)` 挂 body，响应式切换 `show`。
  - 两侧行为一致：单例容器、自动消失、`aria-live="polite"`。

## 毛玻璃
- `ui-toast` 通过 `.ui-glass` 取毛玻璃背景（§188），并用组件级 `--ui-toast-glass-*` → 回退 `--ui-glass-*-default`（§220）调节透明度 / 模糊。

## 命名纪律
- 根 `ui-toast` 必首位；可见态追加**独立的** `show` 类（CSS 复合选择器 `.ui-toast.show`）；**禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
