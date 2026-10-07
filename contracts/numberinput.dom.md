# NumberInput · DOM 结构契约（numberinput.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-number" data-min="0" data-max="9999" data-step="0.01" data-precision="2" data-prefix="¥">
  [<span class="ui-number-prefix">¥</span>]
  <button class="ui-number-step" data-step="down" type="button" aria-label="减少">−</button>
  <input class="ui-number-input" inputmode="decimal" aria-label="买入价" />
  <button class="ui-number-step" data-step="up" type="button" aria-label="增加">+</button>
  [<span class="ui-number-suffix">%</span>]
</div>
```

## 子元素顺序（对齐 `initNumber`）
1. `data-prefix` 存在 → `<span class="ui-number-prefix">` 置于最前。
2. `<button class="ui-number-step" data-step="down">`（`data-step="down"` 走 `border-left:none; border-right:1px`）。
3. `<input class="ui-number-input" inputmode="decimal">`。
4. `<button class="ui-number-step" data-step="up">`。
5. `data-suffix` 存在 → `<span class="ui-number-suffix">` 置于最后。

## 基准用例（对齐预览页）

| 场景 | DOM 要点 |
|---|---|
| ¥ 2 位小数 | 根 `data-prefix="¥" data-step="0.01" data-precision="2"`；输入值 `1,682.00` |
| % 1 位上限 100 | 根 `data-suffix="%" data-max="100" data-precision="1"` |
| 千分位 0 位 | 根 `data-prefix="¥" data-step="1000000" data-precision="0"`；值 `21,400,000,000` |

## 约束
1. class 顺序：根 `ui-number` 必首位；`ui-number-*` 子元素固定（prefix→down→input→up→suffix）。
2. 步进按钮必须带 `type="button"`，避免误提交表单。
3. 录入框右对齐（`text-align:right`，theme.css 已定），千分位逗号随 `precision`。
4. 颜色零硬编码：聚焦描边 / 柔光走 `var(--ui-color-brand)` / `var(--ui-color-brand-soft)`。
