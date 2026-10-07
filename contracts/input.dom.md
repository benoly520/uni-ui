# Input · DOM 结构契约（input.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<span class="ui-input-wrap">
  [<span class="ui-icon" aria-hidden="true">{prefix}</span>]
  <input class="ui-input [ui-size-*] [ui-input--error]" type="text" [value|defaultValue] [placeholder] [disabled] [aria-invalid="true"] [id] [name] [maxlength] />
  [<span class="ui-icon" aria-hidden="true">{suffix}</span>]
</span>
```

- 仅 `ui-input` 元素携带 `ui-size-*` / `ui-input--error`；`ui-input-wrap` 为无样式聚合容器，保证前后缀与输入框成组且 React/Vue DOM 一致。
- `ui-icon` 仅在前/后缀存在时渲染。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 基础 | `<input class="ui-input" type="text" placeholder="输入框 Input" />` |
| 尺寸 xs | `<input class="ui-input ui-size-xs" type="text" placeholder="微" />` |
| 尺寸 sm | `<input class="ui-input ui-size-sm" type="text" placeholder="小" />` |
| 尺寸 lg | `<input class="ui-input ui-size-lg" type="text" placeholder="大" />` |
| 错误 | `<input class="ui-input ui-input--error" aria-invalid="true" value="invalid" />` |
| 禁用 | `<input class="ui-input" type="text" disabled placeholder="禁用" />` |
| 带前导图标 | `<span class="ui-input-wrap"><span class="ui-icon" aria-hidden="true">{icon}</span><input class="ui-input" type="text" /></span>` |

## 约束
1. class 顺序：**基类 `ui-input` 必首位**，后接 `ui-size-*`、再 `ui-input--error`。
2. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定字符串。
3. 颜色零硬编码（除 #fff 文本对比）：focus 描边 `var(--ui-color-brand)`、error `var(--ui-color-danger)`，全部走 token。
4. `ui-input-wrap` 为纯聚合容器，不带任何视觉（不使用新增 CSS）；`ui-icon` 来自 `icon.md` 契约。
