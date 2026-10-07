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

## 命名纪律
- 全部 class 手写稳定；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：链接 hover / 当前走 `var(--ui-color-brand)`、`var(--ui-text)`。
