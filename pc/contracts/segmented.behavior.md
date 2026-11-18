# Segmented · 行为契约（segmented.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-segmented`（§17.x / §17.23）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 选中项 | 文本转 `--ui-text` + `font-weight:700`，滑块滑入其下 | `aria-pressed="true"` |
| hover | 无专属态（原生 button，已有 cursor:pointer） | 指针悬停 |
| focus-visible | 原生 button 焦点圈 | 键盘聚焦 |
| disabled | 整组 `aria-disabled` + 各 `button[disabled]`，不可点击 | `disabled` |

## 状态机

```
        ┌─────────┐   click    ┌─────────┐
        │  opt A  │ ────────▶ │  opt B  │
        └─────────┘ ◀──────── └─────────┘
             ▲         click        │
             └──────────────────────┘
```

- 单选互斥：任一时刻仅一个 `aria-pressed="true"`，选中变更时其余置 `false`。
- 受控：`value` 由外部管理，`onChange` 仅通知；组件不自行翻转选中。
- 非受控：内部管理当前选中，初始取 `defaultValue`（缺省取首项 `value`）。

## 滑块定位
- 选中项的 `.thumb` 位置 = 选中 `<button>` 的 `offsetLeft` / `offsetWidth`（含父容器 `padding:3px` 后的真实坐标）。
- 挂载、`value`/`options` 变化、窗口 `resize` 时重算，保证滑块与选中项对齐；过渡由 CSS `left/width` 负责。

## 键盘 / a11y
- 选项为原生 `<button>`，Tab 可达，Enter / Space 触发 click（无需自定义）。
- `aria-pressed` 为选中真理源，读屏播报「按下/未按下」。
- 整组建议带 `aria-label`（选项文本不足以表意时）。
- 单选项 `disabled` 时从点击与键盘激活中排除，但保留在 DOM（`aria-pressed` 仍为 `false`）。

## 表单语义
- 纯展示分段控件，不提交表单值；如需提交，外层自行取 `value`。
