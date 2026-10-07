# DataTable · DOM 结构契约（datatable.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-table [ui-table--compact] [ui-table--selectable]">
  <table>
    <thead><tr>
      [<th class="col-check"><input type="checkbox" class="row-check-all" aria-label="全选" [checked]></th>]
      <th class="[sticky-col] [ui-th--sortable] [is-sorted]" data-key="KEY" [data-num] [data-dir="asc|desc"]>标题<span class="arrow">▾</span></th>
      …
    </tr></thead>
    <tbody>
      <tr class="[is-selected]" [aria-selected="true"]>
        [<td class="col-check"><input type="checkbox" class="row-check" aria-label="选择" [checked]></td>]
        <td class="[sticky-col] [ui-num]" [data-num]>CELL</td>
        …
      </tr>
    </tbody>
  </table>
</div>
```

## 基准用例（对齐预览页 §17.23 / §17.30）

| 场景 | DOM |
|---|---|
| 紧凑表头可排序列 | `<th class="ui-th--sortable" data-key="price" data-num>最新价<span class="arrow">▾</span></th>` |
| 数值单元格 | `<td class="ui-num" data-num>1,682.00</td>` |
| 涨跌单元格 | `<td class="ui-num ui-num--down" data-num>-0.42</td>` |
| 全选/行选列 | `<th class="col-check"><input type="checkbox" class="row-check-all" aria-label="全选"></th>` / `<td class="col-check"><input type="checkbox" class="row-check" aria-label="选择"></td>` |
| 冻结首列 | `<td class="sticky-col">贵州茅台</td>` |

## 约束
1. 根 `ui-table` 必首位；修饰 `ui-table--compact` / `ui-table--selectable` 追加。
2. 可排序列 `th` 必带 `ui-th--sortable`；排序态加 `is-sorted` + `data-dir`。
3. `.col-check` 列仅承载全选/行选 checkbox，点击不触发排序（守卫）。
4. 数值列 td 加 `.ui-num` + `data-num`；涨跌单元格追加 `ui-num--up/down`。
5. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash；全部走 theme.css。
6. React/Vue 必须产出相同标签、class 顺序、层级与排序算法。
