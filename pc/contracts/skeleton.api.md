# Skeleton · API 契约（skeleton.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-skeleton`（§1227-§1229 / §483）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-skeleton`（必首位）
- 原生元素：`<div>`（纯展示占位）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `shape` | `'text' \| 'circle' \| 'rect'` | `'rect'` | 内联 `border-radius` / 尺寸（见 dom.md） | 占位形状 |
| `width` | `string \| number` | — | 内联 `width`（数字转 px） | 占位宽度 |
| `height` | `string \| number` | — | 内联 `height`（数字转 px）；`text` 默认较小 | 占位高度 |
| `active` | `boolean` | `true` | 控制 shimmer 动画（`.ui-skeleton` 默认带 `animation`） | 是否显示微光动画 |
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

## 插槽
- 无内容插槽；骨架为纯视觉占位（为空 `<div>`）。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 根 `ui-skeleton` 必首位；形状 / 尺寸经内联 `style` 驱动（对齐预览 §1227-§1229 的 `height/width` 内联写法），不派生尺寸 class。
- ⚠️ 偏差：`theme.css` 仅定义 `.ui-skeleton` 基础 + `ui-shimmer` 动画；形状（圆形需 `border-radius:50%`、文本需矮高度）由内联 style 实现，与预览内联写法一致，故不新增 CSS、不改 theme.css（见 dom.md 约束 3）。
- **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
