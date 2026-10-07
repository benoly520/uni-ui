# Stat · 行为契约（stat.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-stat`（§17.23）。纯展示组件，无状态机。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 默认 | label 灰、value 大号 700 字重等宽数字、delta 随 `trend` 着色 | 静态渲染 |
| up | delta（与 value，若 `trend='up'`）红色，前置 ▲ 三角 | `trend='up'`（默认 cn 红涨） |
| down | delta（与 value）绿色，前置 ▼ 三角 | `trend='down'`（默认 cn 绿跌） |
| muted | delta 灰色、无三角 | `trend='muted'` |

## 状态机
- 无。Stat 为纯受控展示，无内部状态，无键盘可达性需求（非交互元素）。

## 键盘 / a11y
- 无交互，无需 `role` / `tabindex`。
- `value` 等宽数字（`tabular-nums`），金融读数对齐；`data-num` 标记列语义。
- `delta` 三角由 `.delta.ui-num--up/down::before` 以 CSS 边框三角绘制，不占 DOM 节点。

## 市场域
- 涨跌色随 `<html data-mkt="intl">` 翻转（绿涨红跌），组件代码不变，纯 token 驱动。
