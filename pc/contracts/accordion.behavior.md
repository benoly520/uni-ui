# Accordion · 行为契约（accordion.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-accordion` 与 `initAccordion`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| header hover | 整行染品牌柔光底 | 指针悬停 |
| item open | `is-open` + `aria-expanded="true"`；caret 旋转 180°；面板 max-height = scrollHeight | 点击 header |
| item closed | 无 `is-open`；`aria-expanded="false"`；面板 max-height = 0 | 点击 header |
| 过渡 | `max-height` 0↔scrollHeight，`var(--ui-dur-base)` 缓动 | 切换 |

## 状态机
```
   每项独立：closed ──click header──▶ open ──click header──▶ closed
   多组互不互斥，可同时 open；activeKeys 为当前全部 open 的 key 集合
```

## 键盘 / a11y
- header 为原生 `<button>`，`Tab` 可达，`Enter`/`Space` 切换；带 `aria-expanded`。
- 面板内容（Switch / Checkbox）独立可聚焦，不与 header 争焦点。
- `is-open` 与 `aria-expanded` 严格同步（对齐 `initAccordion`）。

## 受控 / 非受控
- `activeKeys` 非空数组或显式传参 → 受控：展开集合由 prop 派生并随其同步。
- 非受控 → 内部集合自管，切换直接更新并回调 `onChange`。
- 非受控初始以 `defaultActiveKeys` 决定哪些项开局展开。
