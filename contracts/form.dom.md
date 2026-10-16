# Form · DOM 结构契约（form.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<form class="ui-form" novalidate [onSubmit]>
  [<div class="ui-form-grid">]
    <div class="ui-form-row [ui-form-item--error]">
      <label class="ui-label" for="NAME">LABEL</label>
      <input class="ui-input [ui-input--error]" id="NAME" name="NAME" type="TYPE" placeholder="…" [value] />
      <div class="ui-form-error" data-for="NAME">ERROR</div>
    </div>
    …
  [</div>]
  <div class="row">
    <button class="ui-btn ui-btn--primary" type="submit">提交</button>
  </div>
</form>
```

## 基准用例（对齐预览页 §17.23）

| 场景 | DOM |
|---|---|
| 字段行 | `<div class="ui-form-row"><label class="ui-label" for="fStock">标的代码</label><input class="ui-input" id="fStock" placeholder="如 600519" /><div class="ui-form-error" data-for="fStock"></div></div>` |
| 错误态 | `<div class="ui-form-row ui-form-item--error"><label class="ui-label" for="fStock">标的代码</label><input class="ui-input ui-input--error" id="fStock" /><div class="ui-form-error" data-for="fStock">需为 6 位代码</div></div>` |
| 栅格包裹 | `<form class="ui-form" novalidate><div class="ui-form-grid">…</div><div class="row"><button class="ui-btn ui-btn--primary" type="submit">提交</button></div></form>` |

## 约束
1. 根 `ui-form` 必首位；`grid` 为真时包 `.ui-form-grid`。
2. 字段行 `.ui-form-row`；错误态加 `.ui-form-item--error`（语义）+ 输入框 `.ui-input--error`（红边，theme.css 实有）。
3. 错误文案 `.ui-form-error` + `data-for=name`。
4. `label[for]` 与 `input[id]` 同值；**未传 `idPrefix` 时即为字段 `name`**（快照基准，见上方用例），传 `idPrefix` 时二者同为 `${idPrefix}-${name}`。input 用 `.ui-input`（玻璃面）。
5. **同页多个 Form 必须传唯一 `idPrefix`**：`id` 需全局唯一，否则同名字段会串 `label`（`label[for]` 只命中文档中第一个匹配 id 的元素）。
6. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash；全部走 theme.css。
7. React/Vue 必须产出相同标签、class 顺序、层级与校验逻辑。
