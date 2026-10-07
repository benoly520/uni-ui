# Drawer · API 契约（drawer.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-drawer-overlay > .ui-drawer.ui-glass`（§Drawer 区块）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-drawer-overlay`（遮罩，`[show]` 切换可见）
- 面板 class：`ui-drawer ui-glass`（`<aside>`，`role="dialog" aria-modal="true"`）；方位修饰 `ui-drawer--{left|bottom}`（默认 right 无修饰）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `open` | `boolean` | `false` | 受控显隐；切换 `.ui-drawer-overlay.show` | 受控打开状态 |
| `onOpenChange` | `(open: boolean) => void` | — | — | 打开/关闭回调 |
| `side` | `'right' \| 'left' \| 'bottom'` | `'right'` | `ui-drawer--left` / `ui-drawer--bottom` | 滑出方向（默认右侧） |
| `title` | `ReactNode` | — | 渲染于 `.ui-drawer header` 标题位 | 标题 |
| `subtitle` | `ReactNode` | — | 渲染于 `.ui-drawer header` 副标题（`.ui-label`） | 副标题 |
| `showClose` | `boolean` | `true` | header 内关闭按钮 | 是否显示关闭按钮 |
| `ariaLabel` | `string` | 取 `title` 或 `'抽屉'` | `.ui-drawer` 的 `aria-label` | 无障碍标签 |
| `closeOnOverlay` | `boolean` | `true` | — | 点击遮罩是否关闭 |
| `className` / `style` | — | — | 透传到 `.ui-drawer` | — |

## 插槽
- **默认插槽**：抽屉主体内容（包入 `.ui-drawer .body`）。

## 事件
- `onOpenChange(open)`：状态变化（Esc/遮罩/关闭按钮均触发）。

## 焦点管理（a11y 重点）
- 同 Dialog：打开聚焦首项、Tab/Shift+Tab 循环、Esc 关闭、遮罩关闭、关闭恢复触发焦点；关闭态 `inert`+`aria-hidden`。

## 命名纪律
- 面板 `ui-drawer ui-glass`；方位用 `ui-drawer--{side}`（默认 right 无类）。
- 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
