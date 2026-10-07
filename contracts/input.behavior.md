# Input · 行为契约（input.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-input`（§17.x / §17.23）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| focus | 品牌色描边 + 3px 品牌软光晕（`box-shadow`） | 键盘/指针聚焦 |
| hover | 无专属态（原生 input） | 指针悬停 |
| disabled | 不可编辑、`not-allowed`、透明度降低 | `disabled` |
| error | danger 描边 + 0.14 危险软光晕 | `error` |

## 状态机

```
        ┌─────────┐
        │  idle   │
        └────┬────┘
   error  │    │ disabled
           ▼    ▼
      ┌─────────┐  ┌──────────┐
      │  error  │  │ disabled │
      └─────────┘  └──────────┘
```

- `error` 与 `disabled` 可叠加；disabled 优先阻断编辑与 onChange。
- focus-visible/focus 共用 `:focus` 品牌光晕（原生 input 无 focus-visible 区分需求）。

## 键盘 / a11y
- 原生 `<input>` 天生可聚焦、Enter/方向键等由浏览器处理，无需自定义。
- `id` 与外层 `<label for>` 关联（预览 `for="i1"` / `for="i2"`）。
- `disabled` 时从 tab 顺序与表单提交中排除。
- error 态建议配合 `aria-invalid="true"`（组件在 `error` 时自动加），读屏播报错误字段。
- prefix/suffix 图标为装饰，加 `aria-hidden="true"`。

## 受控/非受控
- 受控：`value` 受外部管理，`onChange` 仅通知。
- 非受控：`defaultValue` 写入原生 `defaultValue`，由 DOM 自身维护，仅在 `onChange` 通知。
