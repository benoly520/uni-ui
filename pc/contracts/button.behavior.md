# Button · 行为契约（button.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-btn`（§17.8 / §17.23）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| hover | primary / default / danger 抬升 1px；ghost 染 brand-soft；outline 描边转 brand | 指针悬停 |
| active | 下沉 + scale(0.98) | 按下 |
| focus-visible | 2px 品牌色焦点圈、offset 2px | 键盘聚焦（点击不显） |
| disabled | opacity .45、`cursor: not-allowed`、`transform: none` | `disabled` |
| loading | 文字透明 + 白色 spinner 旋转、`pointer-events: none` | `loading` |

## 状态机

```
        ┌─────────┐
        │  idle   │
        └────┬────┘
     loading │    │ disabled
             ▼    ▼
        ┌─────────┐  ┌──────────┐
        │ loading │  │ disabled │
        └─────────┘  └──────────┘
```

- `loading` 不移除 `disabled` 属性，但设 `aria-busy="true"`；视觉以 spinner 为准，禁用点击。
- `disabled` 与 `loading` 互斥时以 `disabled` 视觉优先（loading 仅用于异步提交中的可聚焦按钮）。

## 键盘 / a11y
- 原生 `<button>` 天生 `role=button`，Tab 可达，Enter / Space 触发 click（无需自定义）。
- 纯图标按钮（无文本）**必须** `aria-label`（预览页 `◐ 主题` 等已带）。
- `loading` 按钮保持可聚焦 + `aria-busy`，读屏播报「忙」。
- 焦点圈走 `:focus-visible`，点击产生的焦点不显示蓝环（避免误触蓝底，§17.9）。

## 表单语义
- 表单内动作按钮显式 `type="submit"` / `type="reset"`；非表单按钮默认 `type="button"`，避免误提交。
