# Tabs · 行为契约（tabs.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tabs`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 选中 | `aria-selected="true"` + 底部品牌色横线（`::after`） | 点击 / 键盘激活 |
| 未选中 | `aria-selected="false"` | — |
| 横滚可见 | 左/右箭头出现（`is-visible`） | 容器可向左/右滚动 |
| 焦点 | tab 获焦（roving tabindex） | 键盘 Tab / 方向键 |

## 状态机（选中项）
```
  任意 tab ──click / 方向键──▶ 选中态（aria-selected=true, tabindex=0）
        ▲                         │
        └──── 其余 tab tabindex=-1 ┘
```

## 键盘 / a11y
- `role="tablist"` + 各 `role="tab"`；`aria-selected`、`aria-controls` 指向 `panel-{key}`；面板 `role="tabpanel"` + `aria-labelledby` 指向 `tab-{key}`。
- **roving tabindex**：仅选中 tab `tabindex=0`，其余 `-1`，Tab 键整体跳过未选中项。
- 方向键 `←/↑` 上一、`→/↓` 下一、`Home` 首、`End` 尾；切换时 `focus()` 并 `click` 选中（与预览 init 一致）。
- 选中项变化时调用 `scrollIntoView({inline:'nearest'})` 保证可见。
- 非激活面板 `hidden` 属性隐藏（`.ui-tabpanel[hidden]{display:none}` 已有）。

## 横滚联动
- 监听 `.ui-tabs-scroll` 的 `scroll` 与窗口 `resize`，并用 `ResizeObserver` 观测容器；按 `scrollLeft` 与 `scrollWidth-clientWidth` 之差切换左右箭头 `is-visible`。

## 受控 / 非受控
- 受控：`value` 决定选中；`onChange` 仅通知。
- 非受控：`defaultValue`（缺省取首项）初始化，内部维护并回调 `onChange`。
