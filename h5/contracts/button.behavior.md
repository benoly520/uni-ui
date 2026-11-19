# Button · 行为契约（button.behavior.md）

> 移动端交互基线：触控优先，不依赖 hover；三端行为与 ARIA 必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| default | 按变体呈现底色 / 描边 / 文字色 | 常态 |
| active | 按变体切换 `-active` 色（primary / danger），secondary / outline / ghost 加深填充 | 触控按下 |
| focus-visible | 3px 品牌色柔光环（`--h5-color-brand-soft`） | 键盘聚焦 |
| disabled | `opacity: .45`、`cursor: not-allowed` | `disabled` |
| loading | spinner 替换图标、原生禁用、`aria-busy="true"` | `loading` |

- 不使用 hover 作为必要反馈；移动端以 `:active` 与 loading 为主要反馈。
- `focus-visible` 只在键盘 / 辅助设备聚焦时出现，触控点击不显示光环。

## 状态机

```
             ┌──────────────┐
             │     idle     │
             └───┬──────┬───┘
        loading  │      │  disabled
                 ▼      ▼
        ┌──────────┐  ┌──────────┐
        │ loading  │  │ disabled │
        └──────────┘  └──────────┘
```

- `loading` 与 `disabled` 任一为真时，按钮进入不可点击状态。
- `loading` 为真时同时输出原生 `disabled`，因此按钮不可聚焦；`aria-busy="true"` 供读屏播报。
- 异步提交场景：提交前置 `loading=true`，完成后置回；可天然防止重复提交。

## 键盘与无障碍

- 原生 `<button>` 自带 `role=button`，Tab 可达，Enter / Space 触发 click。
- 纯图标按钮（无文本）必须由使用方提供 `aria-label`。
- loading 态通过 `aria-busy` 暴露忙碌状态。
- disabled 态使用原生 `disabled`，读屏与键盘均不可操作。

## 表单语义

- 非表单按钮默认 `type="button"`，避免在表单中误触发提交。
- 表单内动作按钮应显式声明 `type="submit"` 或 `type="reset"`。

## 触控尺寸

| size | 高度 | 建议 |
|---|---|---|
| `large` | 50px | 页面主操作 |
| `medium` | 44px | 默认，满足最小触控尺寸 |
| `small` | 36px | 仅用于信息密度高的行内次要操作 |
