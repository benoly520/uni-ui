# DataTable · 行为契约（datatable.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-table`（§17.23 / §17.30）。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 表头 hover | 表头文字转 `--ui-text` | 指针悬停可排序列 |
| 已排序 | 表头加 `is-sorted`，`.arrow` 三角显 + 品牌色 | 点可排序列 |
| 行 hover | 行底纹 `glass-tint/0.40` | 指针悬停 |
| 行选中 | 行加 `is-selected`（品牌柔色） | 勾选 checkbox 或点行（非 `.col-check` 内） |
| 紧凑 | `ui-table--compact` 缩小 cell padding | `compact` |

## 状态机（排序）
```
   idle ──点可排序列──▶ sorted(asc) ──再点──▶ sorted(desc) ──再点──▶ sorted(asc)
   (col-check 列点击被守卫，不进入)
```

## 键盘 / a11y
- 表头 `<th>` 为可点击排序触发区；`.col-check` 列（全选）不参与排序。
- 多选行复选框为原生 `<input type=checkbox>`，自带键盘可达；行 `aria-selected` 同步勾选态。
- 数值列右对齐 + `tabular-nums`，金融读数对齐。

## 多选联动
- 行 checkbox 切换 → 行 `is-selected` + `aria-selected`；表头全选 `.row-check-all` 联动所有行。
- 点行（除 `.col-check` 守卫区）亦切换该行勾选。

## 市场域
- 单元格涨跌着色走 `.ui-num--up/down`（token），随 `data-mkt` 翻转。
