# Toast · 行为契约（toast.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-toast`（§1615 / §1802-§1807）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 隐藏 | `transform: translateY(120%); opacity: 0` | 默认 / 超时 |
| 显示 | `ui-toast.show` → `translateY(0); opacity: 1` | `show` 切真 / 命令式 `toast()` |
| hover | 无特殊态（轻提示不应打断操作） | — |

## 状态机

```
   hidden ──show=true──▶ shown ──show=false / 超时──▶ hidden
```

- `show` 为真时加 `.show`（入场动画）；为假移除（退场动画）。动画由 theme.css `transition` 驱动。
- 命令式 `toast()`：挂载 → 下一帧加 `.show` → `duration` 后移除 `.show`。与预览 `setTimeout(…, 2400)` 一致。

## 键盘 / a11y
- 容器 `role="status"` + `aria-live="polite"`：读屏温和播报，不打断。
- 轻提示非可聚焦控件，无需 Tab 可达（`position: fixed` 浮层，纯信息）。
- `icon` 为装饰时建议 `aria-hidden`；文本提供语义。

## 生命周期（命令式）
- 单例容器挂 `body`；重复调用复用同一根，仅更新内容与 `show`。
- `duration > 0` 自动隐藏；多次调用重置计时器（预览 `clearTimeout` 行为一致）。
- 组件卸载时由辅助函数负责清理（本批仅命令式浮层，随页面存活）。
