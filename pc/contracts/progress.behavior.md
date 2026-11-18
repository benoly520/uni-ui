# Progress · 行为契约（progress.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-progress`（§479-§480 / §1909-§1913）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 决定态 | 填充 `<span>` 按 `value/max` 设 `width`，带 `transition` 平滑增长 | `value` 变化 |
| 不确定态 | `ui-progress--indeterminate`，无具体进度（加载中） | `indeterminate=true` |

## 进度映射
- `pct = clamp(value / max * 100, 0, 100)` → 子 `<span>` 的 `width: {pct}%`。
- 宽度变化由 theme.css `transition: width var(--ui-dur-base) var(--ui-ease)`（§480）平滑过渡，与预览 `bar.style.width = p + '%'` 一致。

## 键盘 / a11y
- 进度条为状态展示，非输入控件；提供 `role="progressbar"` + `aria-valuenow` / `aria-valuemin` / `aria-valuemax`。
- `indeterminate` 时 `aria-valuenow` 省略（`aria-valuetext="加载中"` 可选）。

## 命令式联动
- 预览 `runProgress` 用 `setInterval` 递增 `width` 模拟运行；组件本身不计时，交给调用方（受控）。
