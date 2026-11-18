# Dialog · 行为契约（dialog.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-overlay/.ui-dialog`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 关闭 | 遮罩 `opacity:0; pointer-events:none`、面板 `scale(.94)`；`inert`+`aria-hidden` | `open=false` |
| 打开 | 遮罩 `.show`（模糊背景）、面板 `scale(1)`；聚焦首项 | `open=true` |
| Esc 关闭 | 同上关闭并恢复焦点 | 面板内按 Esc |
| 遮罩关闭 | 同上 | 点击遮罩（target===overlay）且 `closeOnOverlay` |

## 状态机
```
   closed ──open=true──▶ open（focus 首项；tab 循环陷阱）
      ▲                     │
      └── Esc / 遮罩 / 动作 ┘（恢复触发焦点）
```

## 键盘 / a11y
- `.ui-dialog` 设 `role="dialog" aria-modal="true" aria-label`。
- 打开即聚焦首个可聚焦元素：`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`。
- Tab/Shift+Tab 在末/首项循环（`e.preventDefault()` + 跳到对端）。
- Esc → `onOpenChange(false)`。
- 关闭后焦点归还打开前的 `document.activeElement`。
- 关闭态遮罩 `inert` + `aria-hidden="true"`，阻断后台可达性。

## 焦点陷阱实现（两侧一致）
```text
打开：lastFocus = document.activeElement; overlay.show; focus(firstFocusable)
keydown(Tab)：
  if Shift+Tab && active===first → preventDefault; last.focus()
  if Tab && active===last → preventDefault; first.focus()
关闭：overlay 去 show; lastFocus?.focus()
overlay click：if e.target===overlay && closeOnOverlay → close()
document keydown：if Escape && open → close()
```

## 受控
- 强制受控：`open` + `onOpenChange`；组件不自行维护开关，由父级驱动。
