# DataTable · API 契约（datatable.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-table`（§17.23 数据表 + §17.30 增强：吸顶/冻结/多选）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-table`（必首位），容器 `overflow-x:auto` + 玻璃面
- 内部标准 `<table>`：`<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `columns` | `DataTableColumn[]` | — | `<th>/<td>` 生成 | 列定义（见下） |
| `data` | `Record<string, any>[]` | — | `<tr>` 生成 | 行数据 |
| `compact` | `boolean` | `false` | `ui-table--compact` | 紧凑密度（投研默认） |
| `selectable` | `boolean` | `false` | `ui-table--selectable` + `.col-check`/`.row-check` | 行多选 + 表头全选 |
| `rowKey` | `string` | `'id'` | 行标识 | 受控/非受控选择键 |
| `sortKey` | `string` | — | 受控排序列 `key` | 列排序 |
| `sortDir` | `'asc' \| 'desc'` | — | 受控方向（写 `th[data-dir]`） | 列排序 |
| `defaultSortKey` | `string` | — | 非受控初值 | — |
| `defaultSortDir` | `'asc' \| 'desc'` | `'asc'` | 非受控初值 | — |
| `selectedKeys` | `string[]` | — | 受控选中行 | — |
| `onSort` | `(key, dir) => void` | — | 排序变化 | — |
| `onSelect` | `(keys: string[]) => void` | — | 选择变化 | — |
| `className` / `style` | — | — | — | — |

### DataTableColumn
| 字段 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 单元格取值键 `row[key]` |
| `title` | `string` | 表头文案 |
| `numeric` | `boolean` | `data-num` + `.ui-num` 右对齐等宽 |
| `sortable` | `boolean` | 加 `.ui-th--sortable`，启用排序 |
| `sticky` | `boolean` | 加 `.sticky-col` 冻结首列 |
| `render` | `(row, i) => ReactNode` | 自定义单元格（覆盖 `row[key]`） |

## 事件
- `onSort(key, dir)`：点可排序列表头触发（`.col-check` 列守卫不触发）。
- `onSelect(keys)`：勾选/取消行、全选触发。

## 排序算法（还原预览 initTableSort）
- 点击可排序列：若未排序或当前 `desc` → `asc`；若当前 `asc` → `desc`（即 `asc = !isSorted || dir==='desc'`）。
- 其余表头清除 `is-sorted` 与 `data-dir`。
- 数值列（`numeric`）用 `parseFloat(text.replace(/[+,%\s]/g,''))`；否则字符串比较；`asc` 升序。
- React/Vue 两侧算法必须一致（对 `data` 拷贝排序，不改原数组）。

## 命名纪律
- 排序态写表头 `is-sorted` 类 + `data-dir` 属性；`.arrow` 三角由 theme.css `.is-sorted .arrow` 显隐。
