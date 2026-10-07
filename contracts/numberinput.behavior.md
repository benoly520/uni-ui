# NumberInput · 行为契约（numberinput.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-number` 与 `initNumber`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 聚焦（录入框 / 容器） | 容器描边转品牌色 + 柔光阴影（`ui-number:focus-within`） | 录入框获焦 |
| hover 步进 | 步进按钮染品牌柔光底、字转品牌色 | 指针悬停 |
| 录入中 | 保留原始草稿，不重格式化 | 输入 |
| 失焦 / 步进 | 解析→钳制→千分位定点格式化→`onChange` | `blur` / 步进点击 / `change` |

## 状态机
```
   录入 ──input──▶ 草稿态（不重排）
   草稿态 ──blur/change──▶ 解析 → 钳制(min,max) → 格式化展示 → onChange
   任意态 ──step±──▶ 钳制(v±step) → 格式化展示 → onChange
```

## 键盘 / a11y
- 录入框为原生 `<input inputmode="decimal">`，可自由键入；`Tab` 可达，`Enter` 触发 `change`。
- 步进按钮为原生 `<button>`，`Tab` 可达，`Enter`/`Space` 触发；带 `aria-label`（减少 / 增加）。
- 焦点圈走 `:focus-visible`（原生 input / button）。

## 受控 / 非受控
- `value` 非 `null` → 受控：展示由 `value` 派生；用户操作经 `onChange` 上报，由父级回灌。
- 非受控 → 内部 `inner` 自管，步进 / 失焦直接更新并回调 `onChange`。

## 钳制与格式化边界
- 上下限：`NaN` 解析为 `0` 后再钳制。
- 精度：`precision` 决定 `toLocaleString` 的最小 / 最大小数位，保证定点对齐（如 `1682.00`）。
- 步进溢出：超出 `max`/`min` 截断而非报错。
