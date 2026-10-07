# VirtualTable · API 契约（virtualtable.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-vtable`（§17.23 虚拟滚动，initVirtualTable）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根容器：`ui-vtable`（滚动容器，`max-height:320px; overflow:auto; position:relative`）
- 子结构：`.ui-vtable-head`（sticky 吸顶表头，grid）+ `.ui-vtable-viewport`（撑高滚动区）+ 外部 `.ui-vtable-meta`（渲染计数）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `rows` | `Record<string, any>[]` | — | `.ui-vtable-row` 生成 | 行数据（规模可达 5000+） |
| `columns` | `VTableColumn[]` | — | `.ui-vtable-head>span` / `.ui-vtable-row>span` | 列定义 |
| `rowHeight` | `number` | `33` | 行高（固定） | 窗口化基准 |
| `buffer` | `number` | `6` | 上下缓冲行 | 防白屏 |
| `ariaLabel` | `string` | — | `.ui-vtable[aria-label]` | a11y |
| `className` / `style` | — | — | — | — |

### VTableColumn
| 字段 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 取值键 `row[key]` |
| `title` | `string` | 表头文案 |
| `numeric` | `boolean` | `data-num` + `.ui-num` 右对齐等宽 |
| `sticky` | `boolean` | 加 `.sticky-col` 横向冻结首列 |
| `trend` | `(row) => 'up' \| 'down' \| undefined` | 涨跌着色单元格（`.ui-num--up/down`） |
| `width` | `string` | grid 列宽（如 `1.6fr`），默认 `1fr` |

## 事件
- 纯展示 + 滚动窗口化，无业务事件。滚动由浏览器原生驱动，组件按 `scrollTop` 重算可视窗口。

## 窗口化算法（还原预览 initVirtualTable，两侧必须一致）
- 视口撑高：`viewportHeight = rows.length * rowHeight`。
- `vis = ceil(clientHeight / rowHeight) + buffer * 2`
- `start = floor(scrollTop / rowHeight)`；`s = max(0, start - buffer)`；`e = min(total, s + vis)`
- 仅渲染索引 `[s, e)` 的行，每行 `style="transform:translateY(index * rowHeight)px)"` 绝对定位（theme.css `.ui-vtable-row` 为 `position:absolute`）。
- 列数/列宽由 `columns` 经内联 `grid-template-columns` 驱动（覆盖 theme.css 默认 6 列网格）。
- 渲染计数写 `.ui-vtable-meta`：`渲染 N 行 / 共 M 行`。
