# VirtualTable · DOM 结构契约（virtualtable.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-vtable" [aria-label="..."]>
  <div class="ui-vtable-head" style="grid-template-columns: COLS">
    <span class="[sticky-col]" [data-num]>标题</span> …
  </div>
  <div class="ui-vtable-viewport" style="height: {total*rowHeight}px">
    <div class="ui-vtable-row" style="transform:translateY({i*rowHeight}px); grid-template-columns: COLS">
      <span class="[sticky-col] [ui-num] [ui-num--up|down]" [data-num]>CELL</span> …
    </div>
    …（仅 [s,e) 窗口行）
  </div>
</div>
<div class="ui-vtable-meta">渲染 N 行 / 共 M 行</div>
```

## 基准用例（对齐预览页 §17.23 initVirtualTable）

| 场景 | DOM |
|---|---|
| 表头（冻结首列） | `<div class="ui-vtable-head"><span class="sticky-col">标的</span><span data-num>最新价</span><span data-num>涨跌幅</span>…</div>` |
| 窗口行 | `<div class="ui-vtable-row" style="transform:translateY(132px)"><span class="sticky-col">贵州茅台</span><span class="ui-num" data-num>1,682.00</span><span class="ui-num ui-num--down" data-num>-0.42%</span>…</div>` |
| 撑高滚动区 | `<div class="ui-vtable-viewport" style="height: 165000px"></div>`（5000×33） |
| 渲染计数 | `<div class="ui-vtable-meta">渲染 22 行 / 共 5000 行</div>` |

## 约束
1. 根 `ui-vtable` 必首位；表头 `.ui-vtable-head`、视口 `.ui-vtable-viewport`、计数 `.ui-vtable-meta` 为固定子结构。
2. 行 `position:absolute` + `translateY(i*rowHeight)`，仅渲染 `[s,e)` 窗口（含 buffer），DOM 节点恒定。
3. 列宽经内联 `grid-template-columns` 驱动（覆盖 theme.css 默认 6 列网格，使通用列数可用）。
4. 数值单元格 `.ui-num` + `data-num`；涨跌单元格追加 `ui-num--up/down`。
5. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
6. React/Vue 必须产出相同标签、class 顺序、层级与窗口化算法。
