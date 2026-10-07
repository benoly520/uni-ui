# Form · 行为契约（form.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-form`（§17.23）。键盘 / a11y 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 默认 | label 灰、input 玻璃面、错误区空 | 初始 |
| 字段错误 | 行加 `.ui-form-item--error`、input 加 `.ui-input--error`（红边柔光）、`.ui-form-error` 显红字 | 提交校验未过 |
| 校验通过 | 清除所有错误、调用 `onSubmit` | 提交且全部通过 |

## 状态机
```
   提交 ──▶ 逐字段校验 ── 有错 ──▶ 标记错误态（不提交）
                     └─ 全过 ──▶ onSubmit(values)
```

## 键盘 / a11y
- 每个字段 `label[for=name]` 关联 `input[id=name]`，原生可达。
- 输入框为原生 `<input>`，Tab 顺序自然；错误文案 `.ui-form-error` 紧邻输入。
- 提交按钮为 `.ui-btn.ui-btn--primary`，Enter 在任意 input 触发提交。

## 错误清除
- 重新提交会覆写各字段错误；输入即清空该字段错误（可选，预览为提交时统一校验）。
- `reset`（若用原生 form reset）清空输入与错误（本组件受控，提交即重算）。

## 颜色
- 错误红走 `--ui-color-danger`（`.ui-form-error` / `.ui-input--error`），零硬编码。
