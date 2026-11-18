# Select · 行为契约（select.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-select`（§17.23）。键盘 / A11y 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 关闭 | 菜单 `display:none`；caret 默认 | 默认 / 点击外部 / Esc |
| 打开 | 菜单 `display:block`；trigger 边框品牌色 + 柔光；caret 旋转 180° | 点触发器 |
| 选项选中 | `aria-selected=true`：品牌色加粗；多选显 `.check` | 点选项 |
| 搜索过滤 | 不匹配项 `display:none` | 输入 |

## 状态机
```
        ┌──────┐   点触发器 / 外部点击 / Esc
   open │      │ closed
   ┌────┴──────┴────┐
   │   ui-select    │
   └───────┬────────┘
   toggle──┘
```

## 键盘 / a11y
- 触发器为原生 `<button>`，`aria-haspopup="listbox"` + `aria-expanded` 同步开合。
- 菜单 `role="listbox"`；选项 `role="option"` + `aria-selected`。
- Esc 关闭（焦点回到触发器，原生 button 可聚焦）。
- 选项为 `<div role=option>`，多选可 Tab 至搜索框键入过滤。

## 多选联动
- 触发器文案 = 选中 `label` 以 `、` 连接；无选中显示 `placeholder`。
- 选项 `.check` 图标由 `aria-selected` 显隐（theme.css `.ui-select-option[aria-selected=true] .check`）。

## 市场域 / 颜色
- 选中色走 `--ui-color-brand`（token），组件零硬编码。
