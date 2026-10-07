# Message · 行为契约（message.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-message`（§1618 / §1887-§1899）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 隐藏 | `transform: translate(-50%, -140%); opacity: 0` | 默认 / 超时 |
| 显示 | `ui-message.show` → `translate(-50%, 0); opacity: 1` | `show` 切真 / 命令式 `showMessage()` |
| hover | 无特殊态 | — |

## 状态机

```
   hidden ──show=true──▶ shown ──show=false / 超时──▶ hidden
```

- `.dot` 颜色随 `type`：`success`→`--ui-color-success`、`warning`→`--ui-color-warning`、`danger`→`--ui-color-danger`、`info`→`--ui-color-info`（§473-§476）。
- 命令式 `showMessage()`：挂载 → `requestAnimationFrame` 加 `.show` → `duration` 后移除 `.show`（预览 `2600`ms）。

## 键盘 / a11y
- `role="status"` + `aria-live="polite"`：流程级结果温和播报。
- 顶部浮层非可聚焦控件，无需 Tab 可达。

## 生命周期（命令式）
- 单例容器挂 `body`；同 type 重复调用复用同一根，重置计时器（预览 `clearTimeout(msgTimer)` 行为一致）。
