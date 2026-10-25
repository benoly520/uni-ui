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
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

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

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件受影响部位：`.ui-toast` 根（`.ui-glass`）。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 根 `ui-toast` 必首位；可见态追加**独立的** `show` 类（CSS 复合选择器 `.ui-toast.show`）；**禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
