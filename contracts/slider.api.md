# Slider · API 契约（slider.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-slider`（§17.30 / `initSlider`）与既有实现 `src/react/Slider.tsx` + `src/vue/Slider.vue`。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-slider-wrap`（必首位）
- 轨道：`ui-slider` → `ui-slider-track` → `ui-slider-fill` / `ui-slider-thumb`
- 数值：`ui-slider-vals`（`s-min` / `s-max`）

## Props / 属性（既有实现为准）

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `min` | `number` | `0` | — | 下限 |
| `max` | `number` | `100` | — | 上限 |
| `step` | `number` | `1` | — | 步进增量 |
| `value` | `[number, number]` | — | 受控 `[低, 高]` | 受控模式 |
| `defaultValue` | `[number, number]` | `[min, max]` | — | 非受控初始 |
| `format` | `'pct' \| 'num' \| (v)=>string` | `'num'` | — | 数值格式化 |
| `onChange` | `(value: [number, number]) => void` | — | — | 值变化 |
| `minLabel` / `maxLabel` | `string` | `'最小值'`/`'最大值'` | thumb `aria-label` | — |

## 插槽
- 无显式插槽；值文案由 `format` 派生（`pct` → `±x.x%`；`num` → 纯数字）。

## 事件
- `onChange([lo, hi])`：拖拽（pointer）或键盘（←/→/↑/↓/Home/End）调整任一滑块后回调。

## 交互特性（对齐 `initSlider`）
- 双滑块拖拽 + 键盘（聚焦后 ←/→/↑/↓ 步进，Home/End 跳端），`step` 钳制，自动约束 `min ≤ lo ≤ hi`。
- 填充条 + 双 thumb 按百分比定位，颜色走品牌色。
- `role="slider"` + `aria-valuenow` 双 thumb。

## 命名纪律
- 全部 class 手写稳定（`ui-slider*`）；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：fill / thumb 描边走 `var(--ui-color-brand)`。
