# Popover · 行为契约（popover.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-popover`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| hover | 面板显示（取消 `hidden`） | 指针进入根（含面板） |
| focus | 同上 | 触发元素获焦 |
| open（受控/JS） | 同上 | `open=true` / 触发点击 |
| closed | 面板 `hidden` | 离开 / 外部点击 / Esc |
| 面板内 focus | 保持显示（不关闭） | 焦点在面板内按钮 |

## 状态机
```
        ┌─────────┐
        │ closed  │◀── mouseleave / blur(面板外) / 外部点击 / Esc
        └────┬────┘
   hover/    │    │ focusin / 触发点击
   focusin   ▼    ▼
        ┌─────────┐
        │  open   │── 面板内 focusin → 保持
        └─────────┘
```

## 键盘 / a11y
- 面板 `role="dialog"` + `aria-label`；触发元素注入 `aria-expanded`（true/false）+ `aria-controls={panelId}`。
- 显示：hover / focus / 触发点击均可；隐藏用短延迟（`~120ms`）避免触发↔面板间隙抖动；面板内 `focusin` 取消隐藏。
- 外部点击（`!root.contains(target)`）关闭；Esc 关闭并归还触发焦点。
- 面板内按钮可正常点击（区别于 Tooltip 不可交互）。

## 受控 / 非受控
- 受控：`open` + `onOpenChange`。
- 非受控：`defaultOpen` 初值，内部维护并回调。
