# Drawer · 行为契约（drawer.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-drawer-overlay/.ui-drawer`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 关闭 | 遮罩透明、抽屉 `translateX(100%)`（right）/ 左/下同理偏移；`inert`+`aria-hidden` | `open=false` |
| 打开 | 遮罩 `.show`、抽屉滑入原位；聚焦首项 | `open=true` |
| Esc 关闭 | 同关闭并恢复焦点 | 面板内按 Esc |
| 遮罩关闭 | 同关闭 | 点击遮罩（target===overlay）且 `closeOnOverlay` |

## 状态机
```
   closed ──open=true──▶ open（focus 首项；tab 循环陷阱）
      ▲                     │
      └── Esc / 遮罩 / 关闭钮 ┘（恢复触发焦点）
```

## 键盘 / a11y
- `.ui-drawer` 设 `role="dialog" aria-modal="true" aria-label`。
- 打开聚焦首项（`button …`），Tab/Shift+Tab 循环（焦点陷阱）。
- Esc → `onOpenChange(false)`；点击遮罩（target===overlay）关闭。
- 关闭后归还触发按钮焦点；关闭态 `inert`+`aria-hidden` 阻断后台。
- `side` 决定滑入方向：`right`（默认 `translateX(100%)`）、`left`（`translateX(-100%)`）、`bottom`（`translateY(100%)`）。

## 焦点陷阱实现（两侧一致）
```text
打开：lastFocus = activeElement; overlay.show; focus(firstFocusable)
keydown(Tab)：循环首项↔末项
关闭：去 show; lastFocus?.focus()
overlay click：target===overlay && closeOnOverlay → close()
document keydown：Escape && open → close()
```

## 受控
- 强制受控：`open` + `onOpenChange`；由父级驱动开关。

## 主题缺口（由中央补 theme.css）
- `.ui-drawer--left` 定位（left:0; right:auto）及 `.ui-drawer-overlay.show .ui-drawer--left { transform: translateX(0) }`（关闭态 `translateX(-100%)`）
- `.ui-drawer--bottom` 定位（bottom:0; top:auto; width:100%; height:min(...)）及 `.ui-drawer-overlay.show .ui-drawer--bottom { transform: translateY(0) }`（关闭态 `translateY(100%)`）
