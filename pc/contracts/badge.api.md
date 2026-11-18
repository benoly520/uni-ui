# Badge · API 契约（badge.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-badge`（§17.x / §17.23）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-badge`（`<span>`，内联状态标记 / 计数徽标）
- 视觉全部来自 `theme.css` 已有 `.ui-badge`；dot 与 tone 通过内联 `style` 引用 token，不新增 CSS。

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `tone` | `'brand' \| 'danger' \| 'success' \| 'warning' \| 'info'` | `'brand'` | 内联 `style` 背景/前景 | 语义色，全部走 `--ui-color-*`（soft 作底、主色作字），无硬色值 |
| `dot` | `boolean` | `false` | 前置 `.ui-badge-dot` | 仅显示状态圆点（可配合 `children` 作标签） |
| `count` | `number` | — | 渲染数字内容 | 计数徽标；配合 `max` 截断为 `99+` |
| `max` | `number` | `99` | — | `count > max` 时显示 `${max}+` |
| `showZero` | `boolean` | `false` | — | `count === 0` 时是否仍渲染（默认不渲染） |
| `children` | 节点 | — | 徽标文本/标签 | 如 `在线`、`● 在线` |
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

## 插槽
- **默认插槽**：徽标文本或任意节点；`count` 存在时以数字内容覆盖文本。
- **dot 模式**：`dot` 为真时前置一个 `currentColor` 圆点（内联 `style` 绘制），其后为 `children`。

## 事件
- 无交互事件（纯展示标记）。

## 毛玻璃
- 背景走 `--ui-color-{tone}-soft`（回退 `--ui-color-brand-soft`），前景 `var(--ui-color-{tone})`；不硬编码。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 颜色一律 token；圆点尺寸由内联 `style`（`width/height/border-radius:50%`、`background:currentColor`）承载，**禁止**派生子 token 或新 class 的视觉样式。
