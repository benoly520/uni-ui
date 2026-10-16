# Select · DOM 结构契约（select.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-select [ui-select.open]" [data-multiple]>
  <button class="ui-select-trigger" aria-haspopup="listbox" aria-expanded="true|false">
    {labelText}
    <span class="caret ui-icon"><svg viewBox="0 0 24 24" …>chevron-down</svg></span>
  </button>
  <div class="ui-select-menu" role="listbox">
    [<input class="ui-select-search" placeholder="搜索…" />]
    <div class="ui-select-option [multi]" role="option" data-val="V" aria-selected="true|false">LABEL
      [<span class="check ui-icon"><svg …>check</svg></span>]
    </div>
    …
  </div>
</div>
```

## 基准用例（对齐预览页 §17.23）

| 场景 | DOM |
|---|---|
| 单选触发 | `<div class="ui-select"><button class="ui-select-trigger" aria-haspopup="listbox" aria-expanded="false">白酒<span class="caret ui-icon">{SVG:chevron-down@2}</span></button><div class="ui-select-menu" role="listbox"><div class="ui-select-option" role="option" data-val="白酒" aria-selected="true">白酒</div>…</div></div>` |
| 多选触发 | `<div class="ui-select" data-multiple><button class="ui-select-trigger" …>贵州茅台、宁德时代<span class="caret …"></span></button><div class="ui-select-menu" role="listbox"><input class="ui-select-search" placeholder="搜索标的…"/><div class="ui-select-option multi" role="option" data-val="贵州茅台" aria-selected="true">贵州茅台<span class="check ui-icon">{SVG:check@2.4}</span></div>…</div></div>` |
| 打开态 | 根加 `.open`；trigger `aria-expanded="true"` |

## 约束
1. 根 `ui-select` 必首位；多选加 `data-multiple` 属性（非 class）。
2. 触发器为 `<button>`；文本直接置前，`.caret.ui-icon` 置后（chevron-down）。
3. 多选选项加 `.multi` 类与 `.check.ui-icon`（check 图标）。
4. 菜单 `role="listbox"`；选项 `role="option"` + `data-val` + `aria-selected`。
5. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash；全部走 theme.css。
6. React/Vue 必须产出相同标签、class 顺序、层级与开合/过滤逻辑。
