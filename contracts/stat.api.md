# Stat · API 契约（stat.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-stat`（§17.23 指标卡）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-stat`（必首位，纵向 flex）
- 子结构：`.label`（标签）/ `.value.ui-num`（主值）/ `.delta.ui-num--*`（涨跌 delta）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `label` | `string` | — | `.label` | 指标名（如「上证指数」） |
| `value` | `string \| number` | — | `.value.ui-num` | 主值，强制 tabular-nums 等宽数字 |
| `prefix` | `string` | — | 拼入 `.value` 文本前 | 前缀（如 `¥`） |
| `suffix` | `string` | — | 拼入 `.value` 文本后 | 后缀（如 `亿`） |
| `delta` | `string` | — | `.delta` | 涨跌文案（如 `+1.24%` / `较昨日 —`） |
| `trend` | `'up' \| 'down' \| 'muted'` | — | `ui-num--up/down/muted` + `data-num` | 涨跌着色：走 `--ui-color-up/down`；`muted` 灰色 |
| `className` | `string` | — | 追加根 | — |
| `style` | `CSSProperties` | — | 内联 | — |

## 插槽
- 无具名插槽。`value` / `delta` 为纯文本 + 可选 `prefix`/`suffix`；图标类展示（如箭头）由 theme.css 的 `.delta::before` 三角自动提供，组件不内置。

## 事件
- 纯展示组件，无交互事件。

## 涨跌着色约定
- `trend` 同时产出 `class="ui-num--up|down|muted"`（theme.css 实际着色入口）与 `data-num="up|down|muted"` 属性（满足 `data-num` 语义契约；theme.css 着色为类驱动，见交付报告缺口）。
- 颜色走 `--ui-color-up` / `--ui-color-down`，受 `[data-mkt="cn|intl"]` 红涨绿跌/绿涨红跌覆盖。

## 命名纪律
- 根 `ui-stat` 必首位；涨跌色用 `ui-num--*` 工具类；禁止派生子 token。
