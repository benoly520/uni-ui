# Dialog · API 契约（dialog.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-overlay > .ui-dialog.ui-glass`（§Dialog 区块）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-overlay`（遮罩，`[show]` 切换可见；`role="presentation"`）
- 面板 class：`ui-dialog ui-glass`（`role="dialog" aria-modal="true"`）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `open` | `boolean` | `false` | 受控显隐；切换 `.ui-overlay.show` | 受控打开状态 |
| `onOpenChange` | `(open: boolean) => void` | — | — | 打开/关闭回调（Esc/遮罩/动作均触发） |
| `title` | `ReactNode` | — | 渲染为 `.ui-dialog` 内 `<h3>` | 标题（同时作默认 aria-label） |
| `footer` | `ReactNode` | — | 包入 `.ui-dialog-actions` | 底部操作区（按钮组） |
| `ariaLabel` | `string` | 取 `title` 或 `'对话框'` | `.ui-dialog` 的 `aria-label` | 无障碍标签 |
| `closeOnOverlay` | `boolean` | `true` | — | 点击遮罩是否关闭 |
| `className` / `style` | — | — | 透传到 `.ui-dialog` | — |

## 插槽
- **默认插槽**：对话框主体内容（如 `<p class="ui-label">…</p>`）。
- **footer**：底部操作区（如 取消/确认 按钮）。

## 事件
- `onOpenChange(open)`：状态变化（Esc、遮罩点击、footer 内动作调用关闭时）。

## 焦点管理（a11y 重点）
- 打开：聚焦面板内首个可聚焦元素；Tab/Shift+Tab 在面板内循环（焦点陷阱）。
- 关闭：恢复此前触发按钮焦点（`document.activeElement` 记录）。
- Esc 关闭；点击遮罩（target===overlay）关闭。
- 关闭时遮罩 `inert` + `aria-hidden`，避免后台可聚焦。

## 命名纪律
- 面板始终 `ui-dialog ui-glass`；遮罩 `ui-overlay`，可见态加 `show`。
- 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
