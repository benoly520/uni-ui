# Search · DOM 结构契约（search.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-search [open]">
  <span class="ico ui-icon"><svg …>search</svg></span>
  <input class="ui-search-input" placeholder="…" aria-label="全局搜索" [value] />
  <div class="ui-search-suggest" role="listbox">
    <div class="opt [active]" role="option">
      <span>LABEL [<span class="ui-tag [ui-tag--up|down|brand]">TAG</span>]</span>
      [<span class="code">CODE</span>]
    </div>
    …
  </div>
</div>
```

## 基准用例（对齐预览页 §17.23）

| 场景 | DOM |
|---|---|
| 输入框 | `<div class="ui-search"><span class="ico ui-icon"><i data-lucide="search"></i></span><input class="ui-search-input" placeholder="搜股票 / 基金 / 研报…" aria-label="全局搜索" /><div class="ui-search-suggest" role="listbox"><div class="opt" role="option"><span>贵州茅台 <span class="ui-tag ui-tag--up">白酒</span></span><span class="code">600519</span></div>…</div></div>` |
| 高亮项 | `<div class="opt active" role="option">…</div>` |
| 打开态 | 根加 `.open` |

## 约束
1. 根 `ui-search` 必首位；`.ico.ui-icon` 在输入前；输入 `.ui-search-input`；联想 `.ui-search-suggest`。
2. 联想项 `.opt`（`role="option"`）；高亮 `.active`；代码 `.code`；板块标签 `.ui-tag`。
3. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash；全部走 theme.css。
4. React/Vue 必须产出相同标签、class 顺序、层级与键盘/过滤逻辑。
