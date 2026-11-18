# Breadcrumb · API 契约（breadcrumb.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-breadcrumb`（§17.30）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-breadcrumb`（必首位，`<nav>` 语义容器）
- 链接：`a`（非末项）；末项：`span.current`（`aria-current="page"`）
- 分隔：`span.sep`（默认 `/`）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `items` | `BreadcrumbItem[]` | — | 渲染为 `a` / `current` + `sep` | 路径节点 |
| `separator` | `ReactNode` | `'/'` | `.sep` 文案 | 分隔符 |
| `aria-label` | `string` | `'路径导航'` | 根 `<nav>` aria-label | — |
| `className` / `style` | — | — | 根 class / style | — |
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

### `BreadcrumbItem`
| 字段 | 类型 | 说明 |
|---|---|---|
| `label` | `ReactNode` | 节点文案 |
| `href` | `string` | 链接地址（末项忽略，始终为当前页不链接） |

## 插槽
- 每个 item 的 `label` 为节点，渲染进 `a` / `span.current`。

## 事件
- 链接点击：原生 `<a>` 导航；如需拦截由消费方在 `label` 内自行处理或后续扩 `onClick`。

## 交互特性（对齐预览）
- 末项 `aria-current="page"` 不链接、不 hover 高亮（实体字重）。
- 链接 hover 跟随品牌色 + 柔光底（`a:hover` 走 `var(--ui-color-brand)`）。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 全部 class 手写稳定；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：链接 hover / 当前走 `var(--ui-color-brand)`、`var(--ui-text)`。
