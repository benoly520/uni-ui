import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

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
  columns: MaybeGetter<DataTableColumn[]>;
  data: MaybeGetter<Record<string, any>[]>;
  /** 紧凑密度（投研默认） */
  compact?: MaybeGetter<boolean>;
  /** 行多选 + 表头全选 */
  selectable?: MaybeGetter<boolean>;
  /** 行标识键 */
  rowKey?: MaybeGetter<string>;
  /** 受控排序列 key */
  sortKey?: MaybeGetter<string>;
  /** 受控排序方向 */
  sortDir?: MaybeGetter<'asc' | 'desc'>;
  defaultSortKey?: MaybeGetter<string>;
  defaultSortDir?: MaybeGetter<'asc' | 'desc'>;
  /** 受控选中行 key */
  selectedKeys?: MaybeGetter<string[]>;
  onSort?: (key: string, dir: 'asc' | 'desc') => void;
  onSelect?: (keys: string[]) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
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
 * - 紧凑 / 列排序 / 可选行多选冻结首列
 * - 受控/非受控排序与选择；排序与选中不改原 data
 */
export function DataTable(props: DataTableProps) {
  const {
    columns,
    data,
    compact = false,
    selectable = false,
    rowKey = 'id',
    sortKey,
    sortDir,
    defaultSortKey,
    defaultSortDir = 'asc',
    selectedKeys,
    onSort,
    onSelect,
    className,
    style,
    ...rest
  } = props;

  const isSortControlled = sortKey != null;
  const sortInner = signal<{ key?: string; dir: 'asc' | 'desc' }>({
    key: resolve(defaultSortKey),
    dir: (resolve(defaultSortDir) as 'asc' | 'desc') || 'asc',
  });
  const curSort = (): { key?: string; dir: 'asc' | 'desc' } =>
    isSortControlled
      ? { key: resolve(sortKey), dir: (resolve(sortDir) as 'asc' | 'desc') || 'asc' }
      : sortInner();

  const isSelControlled = selectedKeys != null;
  const selInner = signal<string[]>([]);
  const selected = (): string[] =>
    isSelControlled ? (resolve(selectedKeys) as string[]) : selInner();
  const selectedSet = () => new Set(selected());

  const dataRows = () => resolve(data) as Record<string, any>[];

  const displayed = () => {
    const s = curSort();
    if (!s.key) return dataRows();
    const col = (resolve(columns) as DataTableColumn[]).find((c) => c.key === s.key);
    return sortRows(dataRows(), s.key, s.dir, !!col?.numeric);
  };

  const handleSort = (col: DataTableColumn) => {
    if (!col.sortable) return;
    const cur = curSort();
    const isSorted = cur.key === col.key;
    const asc = !isSorted || cur.dir === 'desc';
    const nextDir: 'asc' | 'desc' = asc ? 'asc' : 'desc';
    if (!isSortControlled) sortInner.set({ key: col.key, dir: nextDir });
    onSort?.(col.key, nextDir);
  };

  const commitSel = (next: string[]) => {
    if (!isSelControlled) selInner.set(next);
    onSelect?.(next);
  };
  const toggleRow = (key: string) => {
    const s = selectedSet();
    const next = s.has(key) ? selected().filter((k) => k !== key) : [...selected(), key];
    commitSel(next);
  };
  const allChecked = () => {
    const d = displayed();
    return d.length > 0 && d.every((r) => selectedSet().has(r[resolve(rowKey)]));
  };
  const toggleAll = () => {
    if (allChecked()) {
      const removeKeys = new Set(displayed().map((r) => r[resolve(rowKey)]));
      commitSel(selected().filter((k) => !removeKeys.has(k)));
    } else {
      const add = displayed().map((r) => r[resolve(rowKey)]);
      commitSel(Array.from(new Set([...selected(), ...add])));
    }
  };

  return (
    <div
      {...rest}
      class={cx(
        'ui-table',
        resolve(compact) && 'ui-table--compact',
        resolve(selectable) && 'ui-table--selectable',
        resolve(className),
      )}
      style={resolve(style)}
    >
      <table>
        <thead>
          <tr>
            {resolve(selectable) && (
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
            {(resolve(columns) as DataTableColumn[]).map((col) => {
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
            const key = row[resolve(rowKey)] as string;
            const isSel = () => selectedSet().has(key);
            return (
              <tr
                class={cx(isSel() && 'is-selected')}
                aria-selected={isSel() || undefined}
                onClick={(e: MouseEvent) => {
                  if (resolve(selectable) && (e.target as HTMLElement).closest('.col-check'))
                    return;
                  if (resolve(selectable)) toggleRow(key);
                }}
              >
                {resolve(selectable) && (
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
                {(resolve(columns) as DataTableColumn[]).map((col) => (
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
