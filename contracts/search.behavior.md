# Search · 行为契约（search.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-search`（§17.23）。键盘 / a11y 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 关闭 | 联想区 `display:none` | 默认 / 失焦外部 / Esc |
| 打开 | 联想区 `display:block` | input focus / 输入 |
| 项高亮 | `.opt.active` 品牌柔色底 | 键盘 ↑/↓ 移动 |
| 过滤 | 不匹配项 `display:none` | 输入 |

## 状态机
```
   input focus / 输入 ──▶ open(listbox) ── Esc / 外部点击 ──▶ closed
        ↑                                          │
        └──────────── 选中(Enter/鼠标) 回填 ────────┘
```

## 键盘 / a11y
- 输入为原生 `<input>`，可聚焦；聚焦即展开联想（`role="listbox"`）。
- `↑/↓` 在「可见（未过滤隐藏）」项间循环移动 `active`。
- `Enter` 选中当前 `active` → 回填 `label` 到输入框、关闭、`onSelect`。
- `Esc` 关闭联想。
- 选项 `role="option"`；`mousedown` 选中（防 input blur 抢先关闭）。

## 颜色 / 标签
- 高亮走 `--ui-color-brand-soft`；代码 `.code` 用 `--ui-font-mono` 等宽灰。
- 板块标签复用 `.ui-tag`（`ui-tag--up/down/brand`），涨跌色随 `data-mkt` 翻转。
