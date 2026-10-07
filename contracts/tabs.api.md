# Tabs · API 契约（tabs.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tabs-wrap / .ui-tabs / .ui-tabpanel`（§Tabs 区块）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根结构：`.ui-tabs-wrap`（横向滚动容器 + 左右箭头）后接一个或多个 `.ui-tabpanel`，二者为同级兄弟节点（无额外根包裹）。
- tablist class：`ui-tabs`（含 `role="tablist"`）；tab 为 `<button role="tab">`；箭头 `ui-tabs-arrow ui-tabs-arrow--{left|right}`。

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `items` | `{ key: string; label: ReactNode; content: ReactNode }[]` | — | 生成 tab+panel | 标签与面板数据 |
| `value` | `string` | — | 受控选中 key | 受控选中项 |
| `defaultValue` | `string` | 首项 key | — | 非受控初始选中 |
| `onChange` | `(key: string) => void` | — | — | 选中变化回调 |
| `ariaLabel` | `string` | `'标签页'` | `role="tablist"` 的 `aria-label` | 无障碍标签 |
| `className` / `style` | — | — | 透传到 `.ui-tabs-wrap` | — |

## 插槽
- `items[].label`：标签文本/节点。
- `items[].content`：对应面板内容（渲染进 `.ui-tabpanel`）。

## 事件
- `onChange(key)`：选中项切换时触发。

## 横滚
- 标签过多时 `.ui-tabs-scroll` 横向滚动；左/右箭头在可滚动时加 `is-visible`（`.ui-tabs-arrow.is-visible{display:flex}` 已有）。点击箭头 `scrollBy` 平滑滚动；`scroll`/`resize`/`ResizeObserver` 实时更新箭头显隐。

## 命名纪律
- 标签按钮 `flex:none; white-space:nowrap`（theme.css 已写死，必填坑）；根 `ui-tabs` 必首位于 tablist 内。
- 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
