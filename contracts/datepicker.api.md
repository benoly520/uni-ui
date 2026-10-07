# DatePicker · API 契约（datepicker.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-datepicker`（§17.x / `initDatePicker`）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-datepicker`（必首位），`data-range` 存在即范围模式
- 触发器：`<button class="ui-datepicker-trigger ui-input">`
- 弹层：`<div class="ui-datepicker-pop" role="dialog">`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `range` | `boolean` | `false` | 根 `data-range` | 范围模式（选起止两日）；否则单日 |
| `value` | `string \| [string, string] \| null` | — | — | 受控值。单日 `'YYYY-MM-DD'`；范围 `[起, 止]`；未选 `null` |
| `defaultValue` | `string \| [string, string] \| null` | `null` | — | 非受控初始值 |
| `onChange` | `(value) => void` | — | — | 值变化。范围模式**仅选满两日时**触发（对齐 `initDatePicker`） |
| `placeholder` | `string` | 模式自动 | `.dp-text` 文案 | 未选占位；单日默认「选择日期」，范围默认「选择日期区间」 |
| `className` | `string` | — | 根 class 追加 | — |
| `style` | `CSSProperties` | — | 根 style | — |
| `aria-label` | `string` | `选择日期` / `选择日期区间` | 弹层 `aria-label` + 触发器语义 | — |

## 插槽
- 无显式插槽；图标为内置 24×24 `currentColor` SVG（日历 / 上下月箭头），不依赖 lucide 运行时。

## 事件
- `onChange(value)`：单日选满 / 范围选满 / 今天 / 清除 时回调。
- 内部：`trigger.click` 切换弹层；`dp-nav` 上下月；`dp-cell` 选日；`dp-foot` 今天 / 清除；点击外部或（可选）Esc 关闭。

## 内部状态（非受控）
- `view`：当前展示月份（首次以 `value`/`defaultValue` 月份或当月）。
- `start` / `end`：`Date | null`，来自 `value`/`defaultValue` 解析。
- `open`：弹层开关。

## 命名纪律
- 全部 class 手写稳定（`ui-datepicker` 系列、`dp-*`、`ui-btn--*`），禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：高亮走 `var(--ui-color-brand)`、`is-today` 描边同；字号 / 间距走 `--ui-*`。
