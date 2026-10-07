# Slider · 行为契约（slider.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-slider` 与 `initSlider`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| thumb hover / active | `active` 抓握手型；`:focus-visible` 品牌色焦点圈 | 指针 / 键盘聚焦 |
| 拖拽 | 跟随指针，按 `step` 钳制并约束 `min≤lo≤hi` | pointerdown + move |
| 填充 | 品牌色条连接两 thumb，按百分比定位 | 值变化 |

## 状态机
```
   lo 手柄：v → clamp(min, hi)；hi 手柄：v → clamp(lo, max)；始终 lo ≤ hi
   键盘：←/↓ -step，→/↑ +step，Home 跳 min，End 跳 max
```

## 键盘 / a11y
- 双 `ui-slider-thumb` 各 `tabIndex=0`、`role="slider"`、`aria-valuemin/max/now`、`aria-label`（minLabel/maxLabel）。
- 方向键步进（按 `step`），Home/End 跳端；`e.preventDefault()` 阻止页面滚动。
- 拖拽用 `pointermove/pointerup` 挂 document，松手即移除监听。

## 受控 / 非受控
- `value` 非空 → 受控：`lo`/`hi` 由 `value` 派生。
- 非受控 → 内部 `inner` 自管（`defaultValue ?? [min, max]`），操作直接更新并回调 `onChange`。

## 位置算法（对齐 `initSlider`）
```
   pct(v) = (v - min) / (max - min) * 100
   fill: left = pct(lo)%, width = pct(hi) - pct(lo)%
   thumb: left = pct(lo|hi)%
   valFromX(clientX): 按 track 宽度比例 → 四舍五入到 step → clamp
```
