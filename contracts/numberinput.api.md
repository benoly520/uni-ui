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
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

## 插槽
- 无节点插槽；`prefix`/`suffix` 为纯字符串，包入 `.ui-number-prefix`/`.ui-number-suffix`。

## 事件
- `onChange(value)`：步进按钮点击、录入框 `change`（回车）/ `blur`（失焦）时，解析→钳制→回调。
- 录入过程不重格式化（保留草稿，避免光标跳动），`blur` 才格式化展示。

## 格式化（对齐 `initNumber`）
- 千分位：`v.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })`
- 展示串 = `prefix + group(v) + suffix`；解析时剥离 prefix/suffix 与 `,`/空格。
- 钳制：`Math.min(max, Math.max(min, v))`。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 全部 class 手写稳定（`ui-number*`），禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：聚焦描边 `var(--ui-color-brand)`、柔光 `var(--ui-color-brand-soft)`，全部走 token。
