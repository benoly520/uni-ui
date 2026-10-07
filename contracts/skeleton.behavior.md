# Skeleton · 行为契约（skeleton.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-skeleton`（§483 / `ui-shimmer`）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 加载中 | `ui-shimmer` 微光从左到右扫过（1.4s 循环） | 默认 `active` |
| 静止 | 无动画（仅占位底色） | `active=false` |

## 无障碍
- 骨架为装饰性占位，应被读屏忽略：`role="presentation"` 或 `aria-hidden="true"`。
- 真实内容加载完成后替换骨架，避免读屏重复播报。

## 形状映射
- `rect`（默认）：基础块，圆角 `--ui-radius-sm`（来自 `.ui-skeleton`）。
- `text`：矮高度（默认约 `--ui-fs-sm` 行高），模拟文本行；常与列表多行组合（预览 §1227-§1229 多行不同宽度）。
- `circle`：内联 `border-radius:50%` + 等宽高，模拟头像 / 图标。

## 双框架一致性
- 形状差异全部由内联 `style` 承载（React `style`、Vue `:style`），两侧产出相同键值，确保 DOM 一致。
