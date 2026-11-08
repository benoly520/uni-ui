import { signal } from 'plain';
import { cx } from './_shared';

export interface DataTableColumn {
  /** 单元格取值键 row[key] */
  key: string;
  /** 表头文案 */
  title: string;
  /** data-num + .ui-num 右对齐等宽 */
  numeric?: boolean;
  /** 加 .ui-th--sortable，启用排序 */
  sortable?: boolean;
  /** 加 .sticky-col 冻结首列 */
  sticky?: boolean;
  /** 自定义单元格（覆盖 row[key]） */
  render?: (row: Record<string, any>, rowIndex: number) => any;
}

export interface DataTableProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  columns: DataTableColumn[];
  data: Record<string, any>[];
  /** 紧凑密度（投研默认） */
  compact?: boolean;
  /** 行多选 + 表头全选 */
  selectable?: boolean;
  /** 行标识键 */
  rowKey?: string;
  /** 受控排序列 key */
  sortKey?: string;
  /** 受控排序方向 */
  sortDir?: 'asc' | 'desc';
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  /** 受控选中行 key */
  selectedKeys?: string[];
  onSort?: (key: string, dir: 'asc' | 'desc') => void;
  onSelect?: (keys: string[]) => void;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

function sortRows(
  rows: Record<string, any>[],
  key: string,
  dir: 'asc' | 'desc',
  numeric: boolean,
): Record<string, any>[] {
  const sign = dir === 'asc' ? 1 : -1;
  return rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const va = a.r[key];
      const vb = b.r[key];
      if (numeric) {
        const na = parseFloat(String(va).replace(/[+,%\s]/g, ''));
        const nb = parseFloat(String(vb).replace(/[+,%\s]/g, ''));
        if (na < nb) return -1 * sign;
        if (na > nb) return 1 * sign;
      } else {
        const sa = String(va);
        const sb = String(vb);
        if (sa < sb) return -1 * sign;
        if (sa > sb) return 1 * sign;
      }
      return a.i - b.i;
    })
    .map((x) => x.r);
}

/**
 * DataTable · 数据表（数据表单组）
 * 紧凑 / 列排序 / 可选行多选 / 冻结首列；受控 / 非受控排序与选择，不改原 data。
 */
export function DataTable(props: DataTableProps) {
  const compact = () => props.compact ?? false;
  const selectable = () => props.selectable ?? false;
  const rowKey = () => props.rowKey ?? 'id';
  const isSortControlled = () => props.sortKey != null;
  const sortInner = signal<{ key?: string; dir: 'asc' | 'desc' }>({
    key: props.defaultSortKey,
    dir: (props.defaultSortDir as 'asc' | 'desc') || 'asc',
  });
  const curSort = (): { key?: string; dir: 'asc' | 'desc' } =>
    isSortControlled()
      ? { key: props.sortKey, dir: (props.sortDir as 'asc' | 'desc') || 'asc' }
      : sortInner();
  const isSelControlled = () => props.selectedKeys != null;
  const selInner = signal<string[]>([]);
  const selected = (): string[] =>
    isSelControlled() ? (props.selectedKeys as string[]) : selInner();
  const selectedSet = () => new Set(selected());

  const dataRows = () => props.data as Record<string, any>[];
  const columnsArr = () => props.columns as DataTableColumn[];
  const displayed = () => {
    const s = curSort();
    if (!s.key) return dataRows();
    const col = columnsArr().find((c) => c.key === s.key);
    return sortRows(dataRows(), s.key, s.dir, !!col?.numeric);
  };

  const handleSort = (col: DataTableColumn) => {
    if (!col.sortable) return;
    const cur = curSort();
    const isSorted = cur.key === col.key;
    const asc = !isSorted || cur.dir === 'desc';
    const nextDir: 'asc' | 'desc' = asc ? 'asc' : 'desc';
    if (!isSortControlled()) sortInner.set({ key: col.key, dir: nextDir });
    props.onSort?.(col.key, nextDir);
  };

  const commitSel = (next: string[]) => {
    if (!isSelControlled()) selInner.set(next);
    props.onSelect?.(next);
  };
  const toggleRow = (key: string) => {
    const s = selectedSet();
    const next = s.has(key) ? selected().filter((k) => k !== key) : [...selected(), key];
    commitSel(next);
  };
  const allChecked = () => {
    const d = displayed();
    return d.length > 0 && d.every((r) => selectedSet().has(r[rowKey()]));
  };
  const toggleAll = () => {
    if (allChecked()) {
      const removeKeys = new Set(displayed().map((r) => r[rowKey()]));
      commitSel(selected().filter((k) => !removeKeys.has(k)));
    } else {
      const add = displayed().map((r) => r[rowKey()]);
      commitSel(Array.from(new Set([...selected(), ...add])));
    }
  };

  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx(
        'ui-table',
        compact() && 'ui-table--compact',
        selectable() && 'ui-table--selectable',
        props.className,
      )}
      style={props.style}
    >
      <table>
        <thead>
          <tr>
            {selectable() && (
              <th class="col-check">
                <input
                  type="checkbox"
                  class="row-check-all"
                  aria-label="全选"
                  checked={allChecked()}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columnsArr().map((col) => {
              const isSorted = () => curSort().key === col.key;
              return (
                <th
                  class={cx(
                    col.sticky && 'sticky-col',
                    col.sortable && 'ui-th--sortable',
                    isSorted() && 'is-sorted',
                  )}
                  data-key={col.key}
                  data-num={col.numeric || undefined}
                  data-dir={isSorted() ? curSort().dir : undefined}
                  onClick={() => handleSort(col)}
                >
                  {col.title}
                  {col.sortable && <span class="arrow">▾</span>}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {displayed().map((row, ri) => {
            const key = row[rowKey()] as string;
            const isSel = () => selectedSet().has(key);
            return (
              <tr
                class={cx(isSel() && 'is-selected')}
                aria-selected={isSel() || undefined}
                onClick={(e: MouseEvent) => {
                  if (selectable() && (e.target as HTMLElement).closest('.col-check')) return;
                  if (selectable()) toggleRow(key);
                }}
              >
                {selectable() && (
                  <td class="col-check">
                    <input
                      type="checkbox"
                      class="row-check"
                      aria-label="选择"
                      checked={isSel()}
                      onChange={() => toggleRow(key)}
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columnsArr().map((col) => (
                  <td
                    class={cx(col.sticky && 'sticky-col', col.numeric && 'ui-num')}
                    data-num={col.numeric || undefined}
                  >
                    {col.render ? col.render(row, ri) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
