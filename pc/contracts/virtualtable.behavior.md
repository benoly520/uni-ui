# VirtualTable · 行为契约（virtualtable.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-vtable`（§17.23）。键盘 / a11y 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 纵向滚动 | 表头 `position:sticky; top:0` 吸顶；仅可视窗口 + 上下 buffer 行渲染 | 滚动 |
| 横向滚动 | 首列 `.sticky-col` 冻结（`position:sticky; left:0`） | 横向滚动（列多时） |
| 行 hover | 行底纹 `glass-tint/0.40` | 指针悬停 |

## 状态机
- 无显式状态机。纯滚动驱动：`scroll → 计算 [s,e) → 重渲染窗口`。DOM 节点数恒定 ≈ `vis` + 表头（预览 5000 行仅 ~22 节点）。

## 键盘 / a11y
- `.ui-vtable` 设 `aria-label`；作为滚动区域可 Tab 聚焦（原生 overflow:auto）。
- 单元格涨跌着色走 `.ui-num--up/down`（token），随 `data-mkt` 翻转。
- `data-num` 数值右对齐 + `tabular-nums`。

## 性能纪律
- 严禁渲染全部行；必须仅渲染 `[s, e)` 窗口（含 buffer）。
- `rowHeight` 固定（默认 33，对齐 theme.css `.ui-vtable-row{height:33px}`），保证 `translateY` 计算精确。
- React/Vue 两侧窗口化算法字节级一致（同一 `vis/s/e` 公式）。
