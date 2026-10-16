# Form · DOM 结构契约（form.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<form class="ui-form" novalidate [onSubmit]>
  [<div class="ui-form-grid">]
    <div class="ui-form-row [ui-form-item--error]">
      <label class="ui-label">
        LABEL
        <input class="ui-input [ui-input--error]" id="NAME" name="NAME" type="TYPE" placeholder="…" [value] />
      </label>
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
| 字段行 | `<div class="ui-form-row"><label class="ui-label">标的代码<input class="ui-input" id="fStock" name="fStock" placeholder="如 600519" /></label><div class="ui-form-error" data-for="fStock"></div></div>` |
| 错误态 | `<div class="ui-form-row ui-form-item--error"><label class="ui-label">标的代码<input class="ui-input ui-input--error" id="fStock" name="fStock" /></label><div class="ui-form-error" data-for="fStock">需为 6 位代码</div></div>` |
| 栅格包裹 | `<form class="ui-form" novalidate><div class="ui-form-grid">…</div><div class="row"><button class="ui-btn ui-btn--primary" type="submit">提交</button></div></form>` |

## 约束
1. 根 `ui-form` 必首位；`grid` 为真时包 `.ui-form-grid`。
2. 字段行 `.ui-form-row`；错误态加 `.ui-form-item--error`（语义）+ 输入框 `.ui-input--error`（红边，theme.css 实有）。
3. 错误文案 `.ui-form-error` + `data-for=name`。
4. 字段用 `<label>` **包裹** `<input>` 建立**隐式关联**：不写 `for`，也不依赖 `id`。因此同页多个 Form 即使 `id` 重复也不会串 label。`<input>` 仍保留 `id = 字段 name`（快照基准；传 `idPrefix` 时为 `${idPrefix}-${name}`）与 `name`，供 `getElementById` / 表单提交使用。
5. `id` 应全局唯一：同页多个 Form 建议传唯一 `idPrefix`，否则重复 `id` 属无效 HTML（**不影响 label 关联**，但会让 `getElementById` / `querySelector('#…')` 只命中第一个实例）。
6. `.ui-form-row > .ui-label` 的纵向排列（`flex-direction: column`）与 `input` 字重回正（`400`）由 theme.css 提供，作用域限定在 `.ui-form-row` 内，避免影响 Empty 描述 / Drawer 副标题对 `.ui-label` 的复用。
6. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash；全部走 theme.css。
7. React/Vue 必须产出相同标签、class 顺序、层级与校验逻辑。
