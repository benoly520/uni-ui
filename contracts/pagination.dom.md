# Pagination · DOM 结构契约（pagination.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<nav class="ui-pagination" role="navigation" aria-label="分页">
  <button aria-label="上一页" data-prev [disabled]>‹</button>
  <button [class="is-active"] [aria-current="page"]>1</button>
  <button>2</button>
  <button class="ui-pagination--ellipsis" disabled aria-label="更多页">…</button>
  <button>20</button>
  <button aria-label="下一页" data-next [disabled]>›</button>
</nav>
```

## 约束
1. 根 `<nav class="ui-pagination">` 必首位，`role="navigation"` + `aria-label`。
2. 顺序固定：上一页 → 页码/省略序列 → 下一页。
3. 当前页按钮加 `is-active` + `aria-current="page"`；其余页码仅为 `<button>文本</button>`。
4. 省略号：`<button class="ui-pagination--ellipsis" disabled aria-label="更多页">…</button>`（不可点）。
5. 边界：首页时 `data-prev` `disabled`；末页时 `data-next` `disabled`。
6. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 多页（total=200,pageSize=10） | 见上通用结构：`1` 为 `is-active`；`2 3 4` 页码；`…` 省略；`20` 末页；下页可点、上页禁用 |

## 主题缺口（由中央补 theme.css）
- `.ui-pagination--ellipsis` 规则（当前省略号按钮走 `disabled` 通用态即可，无独立样式需求；若存在自定义省略态再补）。
