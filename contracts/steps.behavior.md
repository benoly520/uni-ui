# Steps · 行为契约（steps.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-steps` 与 `initSteps`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| done（`j < current`） | 圆点实心品牌色 + check、连接线转品牌色、标题转实体色 | 点击跳到 ≥ j 的步 |
| current（`j == current`） | 圆点描边品牌色 + 柔光圈、标题转实体色 | 点击该步 |
| 默认（`j > current`） | 圆点灰边、序号数字、标题静默 | 初始 |
| clickable | `is-clickable` + 圆点可点光标 | `clickable` 为真 |

## 状态机（点击步 i）
```
   点击步 i → 对所有 j：
     j < i → is-done（圆点 check）
     j == i → is-current（高亮描边）
     j > i → 清除 is-done / is-current
   并回调 onChange(i)
```
- 圆点重建：`is-done` 显示 check 图标（24×24 currentColor SVG），否则显示序号 `j+1`。

## 键盘 / a11y
- 可点步骤圆点为 `is-clickable`；当前为视觉态，无独立 role（沿用 `initSteps` 的纯 DOM 语义）。
- 需要时可在圆点加 `tabIndex` / `role="button"`（组件预留，默认不强制）。

## 受控 / 非受控
- `current` 非 `undefined` → 受控：当前步由 prop 派生并随其同步。
- 非受控 → 内部 `current` 自管，点击直接更新并回调 `onChange`。
