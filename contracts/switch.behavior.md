# Switch · 行为契约（switch.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-switch`（§17.x / §17.23）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| on（开） | 轨道品牌色 + 白滑块右移 `translateX(0.7×控件高)` | `aria-checked="true"` |
| off（关） | 轨道 `--ui-border` + 白滑块居左 | `aria-checked="false"` |
| hover | 无专属态 | 指针悬停 |
| focus-visible | 2px 品牌焦点圈（原生 `<button>` 默认焦点） | 键盘聚焦 |
| disabled | 不可点击、降透明度 | `disabled` |

## 状态机

```
        ┌─────────┐   click    ┌─────────┐
        │   off   │ ────────▶ │   on    │
        └─────────┘ ◀──────── └─────────┘
             ▲         click        │
             └──────────────────────┘
```

- 受控：`checked` 由外部管理，`onChange` 仅通知；组件不自行翻转 `aria-checked`。
- 非受控：内部管理 `aria-checked`，初始取 `defaultChecked`。

## 键盘 / a11y
- 原生 `<button role="switch">` 天生 Tab 可达，Enter / Space 触发 click（无需自定义）。
- `aria-checked` 为状态真理源：屏幕阅读器播报「开/关」。
- `label` / `aria-label` 必须（预览 `aria-label="开"` / `"关"`）。
- `disabled` 时从 tab 顺序与 click 中排除。

## 表单语义
- 纯展示 toggle，不提交表单值；如需提交，外层自行取值。
