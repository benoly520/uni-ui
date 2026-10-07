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

## 插槽
- 无内容插槽；骨架为纯视觉占位（为空 `<div>`）。

## 命名纪律
- 根 `ui-skeleton` 必首位；形状 / 尺寸经内联 `style` 驱动（对齐预览 §1227-§1229 的 `height/width` 内联写法），不派生尺寸 class。
- ⚠️ 偏差：`theme.css` 仅定义 `.ui-skeleton` 基础 + `ui-shimmer` 动画；形状（圆形需 `border-radius:50%`、文本需矮高度）由内联 style 实现，与预览内联写法一致，故不新增 CSS、不改 theme.css（见 dom.md 约束 3）。
- **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
