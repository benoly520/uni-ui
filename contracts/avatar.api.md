# Avatar · API 契约（avatar.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-avatar`（§17.x / §17.23）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-avatar`（`<span>`，圆形头像容器）
- 视觉来自 `theme.css` 已有 `.ui-avatar`；尺寸经内联 `style` 覆盖（预览演示用 `style="width/height/font-size"`），不新增 CSS。

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `src` | `string` | — | `<img class="ui-avatar-img">` | 图片头像（优先）；存在时忽略 `text` / `icon` |
| `alt` | `string` | `''` | `<img alt>` | 图片替代文本（无障碍必填） |
| `text` | `string` | — | 首字母/文字节点 | 文字头像（如 `U`、`陈`） |
| `icon` | 节点（图标） | — | 包入 `.ui-icon` | 图标头像（如用户图标），颜色继承 `#fff` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| number` | `'md'` | 内联 `style` 宽高 | 预设档 xs=24 / sm=28 / md=32 / lg=40（px），或自定义像素数字 |
| `tone` | `'brand' \| 'danger' \| 'success' \| 'warning' \| 'info'` | `'brand'` | 内联 `style` 背景 | 文字/图标头像底色（token 驱动） |

## 插槽
- **img 模式**：`src` 直接渲染 `<img>`，`object-fit:cover` 填满圆。
- **icon 模式**：`icon` 节点包入 `<span class="ui-icon">`（见 `icon.md`）。
- **text 模式**：直接文本子节点。

## 事件
- 无交互事件（纯展示）。

## 毛玻璃
- 文字/图标头像底走 `var(--ui-color-{tone})`（默认 brand），文字色 `#fff`（文本对比例外）。

## 命名纪律
- 尺寸用内联 `style` 写 `width/height/font-size`（预览实证），不派生尺寸 token class。
- 颜色一律 token；仅 `#fff` 文本对比可硬编码。
