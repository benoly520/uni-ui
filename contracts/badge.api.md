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

## 插槽
- **默认插槽**：徽标文本或任意节点；`count` 存在时以数字内容覆盖文本。
- **dot 模式**：`dot` 为真时前置一个 `currentColor` 圆点（内联 `style` 绘制），其后为 `children`。

## 事件
- 无交互事件（纯展示标记）。

## 毛玻璃
- 背景走 `--ui-color-{tone}-soft`（回退 `--ui-color-brand-soft`），前景 `var(--ui-color-{tone})`；不硬编码。

## 命名纪律
- 颜色一律 token；圆点尺寸由内联 `style`（`width/height/border-radius:50%`、`background:currentColor`）承载，**禁止**派生子 token 或新 class 的视觉样式。
