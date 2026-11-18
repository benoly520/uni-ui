# DatePicker · 行为契约（datepicker.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-datepicker` 与 `initDatePicker`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 触发器 hover / focus | 触发器描边转品牌色（`ui-input` 原生 focus 态） | 指针 / 键盘聚焦 |
| 弹层展开 | `aria-expanded="true"`、`.ui-datepicker-pop` 取消 `hidden` | 点击触发器 |
| 单元格 hover | 品牌柔光底（`--ui-color-brand-soft`） | 指针悬停 |
| `is-today` | 品牌色 inset 描边 | 当日 |
| `is-selected`（范围 `is-start`/`is-end`） | 品牌色实心白字 + 单侧圆角 | 选中起 / 止 |
| `in-range` | 品牌柔光底、去圆角 | 落在起止区间内的日 |
| `is-out` | 降透明度、不可点 | 相邻月补齐日 |

## 选择状态机（范围模式）
```
  无选中 ──pick──▶ 仅 start ──pick(≥start)──▶ start&end(选满,自动收起)
                  │                          │
                  └──pick(<start)──▶ end=旧start, start=新(选满)
  任何状态 ──清除──▶ 无选中（保留弹层）
  任何状态 ──今天──▶ start&end=今日(选满,自动收起)
```
- 单日模式：pick 即选满 → 立即收起。
- 范围选满（start&end 均非空）后**自动收起**弹层（`close()`），与 `initDatePicker` 一致。
- 清除不收起弹层，仅清空 `start`/`end` 并复位占位文案。

## 键盘 / a11y
- 触发器为原生 `<button>`，Tab 可达、Enter / Space 开合；带 `aria-haspopup="dialog"`。
- 弹层 `role="dialog"` + `aria-label`。
- 日历日单元格为普通 `<div>`，点击选日（非表单控件，无需 role）；相邻月补齐日 `data-disabled="1"` 不绑事件。
- 上下月导航按钮带 `aria-label`（上个月 / 下个月）。
- 焦点圈走 `:focus-visible`（触发器等原生控件）。

## 受控 / 非受控
- `value` 非空 → 受控：内部 `start`/`end` 由 `value` 派生并随 prop 同步；用户操作经 `onChange` 上报，由父级回灌。
- 非受控 → 内部 `start`/`end` 自管，selection 后直接更新并回调 `onChange`。
- 范围模式部分选择（仅 start）不触发 `onChange`（与预览一致）。
