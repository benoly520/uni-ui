# Tooltip · 行为契约（tooltip.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tip`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| hover | 气泡淡入（`opacity 0→1` + 微上移） | 指针进入根 `.ui-tip`（含气泡自身） |
| focus | 同上 | 触发元素获焦（键盘 Tab） |
| open（受控/JS） | 同上，加 `is-open` | `open` 为 true / 焦点 / 悬停 |
| closed | `opacity:0; pointer-events:none`（CSS 默认） | 离开 / Esc / 外部点击 / `open=false` |
| disabled | 不绑定事件、不渲染 `aria-describedby` | `disabled` |

## 状态机
```
        ┌─────────┐
        │ closed  │◀── mouseleave / blur / Esc / 外部点击
        └────┬────┘
     hover/  │    │ focusin
     focusin ▼    ▼
        ┌─────────┐
        │  open   │
        └─────────┘
```
- 隐藏使用短延迟（`~120ms`）避免 trigger↔bubble 间隙抖动；显示延迟由 `delay` 控制（默认 0）。
- `disabled` 时整条交互链路不挂载。

## 键盘 / a11y
- 气泡 `role="tooltip"` + 唯一 `id`；触发元素注入 `aria-describedby={bubbleId}`。
- 显示态：`bubble` 去掉 `aria-hidden`（关闭态 `aria-hidden="true"`，避免读屏读隐藏内容）。
- `Esc`：关闭并将焦点归还触发元素。
- 触发元素需可聚焦（按钮/链接/带 `tabindex` 的节点）；组件不强制包裹，但建议传可聚焦节点。
- 显示联动纯 CSS `:hover` 已有；键盘 focus 与受控 `open` 依赖 `is-open` class（主题缺口见交付报告）。

## 受控 / 非受控
- 受控：`open` 受父级控制，`onOpenChange` 仅通知。
- 非受控：`defaultOpen` 初始化，内部维护 `open` 并仍回调 `onOpenChange`。
