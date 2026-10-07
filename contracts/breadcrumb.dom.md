# Breadcrumb · DOM 结构契约（breadcrumb.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<nav class="ui-breadcrumb" aria-label="路径导航">
  <a>首页</a><span class="sep">/</span>
  <a>行业研究</a><span class="sep">/</span>
  <a>A股</a><span class="sep">/</span>
  <span class="current" aria-current="page">白酒</span>
</nav>
```

## 子元素顺序（对齐预览页）
- 遍历 `items`：对每个 item，
  - 若**末项** → `<span class="current" aria-current="page">{label}</span>`，**不**加 `sep`。
  - 否则 → `<a {href?}>{label}</a>` 后接 `<span class="sep">{separator}</span>`。
- `sep` 仅出现在相邻项之间，末项后无分隔。

## 约束
1. class 顺序：根 `ui-breadcrumb` 必首位；末项 `current`、分隔 `sep` 固定。
2. 根须为 `<nav>` 语义元素，`aria-label` 默认「路径导航」。
3. 末项绝不渲染 `href`，保持 `aria-current="page"`。
4. 颜色零硬编码：链接 hover / 当前走 `var(--ui-color-brand)`、`var(--ui-text)`。
