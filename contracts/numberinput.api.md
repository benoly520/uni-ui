# NumberInput · API 契约（numberinput.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-number`（§17.x / `initNumber`）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-number`（必首位），`data-min/max/step/precision/prefix/suffix` 透传
- 步进按钮：`<button class="ui-number-step" data-step="down|up">`
- 录入框：`<input class="ui-number-input" inputmode="decimal">`
- 插槽：前缀 `.ui-number-prefix` / 后缀 `.ui-number-suffix`（字符串）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `min` | `number` | `-Infinity` | 根 `data-min` | 下限钳制 |
| `max` | `number` | `Infinity` | 根 `data-max` | 上限钳制 |
| `step` | `number` | `1` | 根 `data-step` | 步进增量 |
| `precision` | `number` | `0` | 根 `data-precision` | 小数位（千分位 + 定点） |
| `prefix` | `string` | — | 根 `data-prefix` + `.ui-number-prefix` | 前置符号（如 `¥`），渲染在步进前 |
| `suffix` | `string` | — | 根 `data-suffix` + `.ui-number-suffix` | 后置符号（如 `%`），渲染在步进后 |
| `value` | `number \| null` | — | — | 受控值；`null` 视为 0 |
| `defaultValue` | `number` | `0` | — | 非受控初始值 |
| `onChange` | `(value: number) => void` | — | — | 步进 / 失焦 / 回车提交钳制后的值 |
| `aria-label` | `string` | — | 录入框 `aria-label` | 无障碍语义 |

## 插槽
- 无节点插槽；`prefix`/`suffix` 为纯字符串，包入 `.ui-number-prefix`/`.ui-number-suffix`。

## 事件
- `onChange(value)`：步进按钮点击、录入框 `change`（回车）/ `blur`（失焦）时，解析→钳制→回调。
- 录入过程不重格式化（保留草稿，避免光标跳动），`blur` 才格式化展示。

## 格式化（对齐 `initNumber`）
- 千分位：`v.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })`
- 展示串 = `prefix + group(v) + suffix`；解析时剥离 prefix/suffix 与 `,`/空格。
- 钳制：`Math.min(max, Math.max(min, v))`。

## 命名纪律
- 全部 class 手写稳定（`ui-number*`），禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：聚焦描边 `var(--ui-color-brand)`、柔光 `var(--ui-color-brand-soft)`，全部走 token。
