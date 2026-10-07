import React, {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

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
  render?: (row: Record<string, any>, rowIndex: number) => ReactNode;
}

export interface DataTableProps {
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
  style?: CSSProperties;
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
 * - 紧凑 / 列排序(.ui-th--sortable，.col-check 守卫) / 涨跌着色 / 可选行多选冻结首列
 * - 受控/非受控排序与选择；排序与选中不改原 data
 * - 还原预览 initTableSort 算法（asc = !isSorted || dir==='desc'）
 */
export const DataTable = forwardRef<HTMLDivElement, DataTableProps>(
  function DataTable(
    {
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
    },
    ref,
  ) {
    const isSortControlled = sortKey != null;
    const [sortInner, setSortInner] = useState<{
      key?: string;
      dir: 'asc' | 'desc';
    }>(() => ({ key: defaultSortKey, dir: defaultSortDir }));
    const curSort = isSortControlled
      ? { key: sortKey, dir: sortDir ?? 'asc' }
      : sortInner;

    const isSelControlled = selectedKeys != null;
    const [selInner, setSelInner] = useState<string[]>([]);
    const selected = isSelControlled ? (selectedKeys as string[]) : selInner;
    const selectedSet = useMemo(() => new Set(selected), [selected]);

    const displayed = useMemo(() => {
      if (!curSort.key) return data;
      const col = columns.find((c) => c.key === curSort.key);
      return sortRows(data, curSort.key, curSort.dir, !!col?.numeric);
    }, [data, columns, curSort.key, curSort.dir]);

    const handleSort = useCallback(
      (col: DataTableColumn) => {
        if (!col.sortable) return;
        const isSorted = curSort.key === col.key;
        const asc = !isSorted || curSort.dir === 'desc';
        const nextDir: 'asc' | 'desc' = asc ? 'asc' : 'desc';
        if (!isSortControlled)
          setSortInner({ key: col.key, dir: nextDir });
        onSort?.(col.key, nextDir);
      },
      [curSort.key, curSort.dir, isSortControlled, onSort],
    );

    const commitSel = useCallback(
      (next: string[]) => {
        if (!isSelControlled) setSelInner(next);
        onSelect?.(next);
      },
      [isSelControlled, onSelect],
    );

    const toggleRow = useCallback(
      (key: string) => {
        const next = selectedSet.has(key)
          ? selected.filter((k) => k !== key)
          : [...selected, key];
        commitSel(next);
      },
      [selected, selectedSet, commitSel],
    );

    const allChecked = displayed.length > 0 && displayed.every((r) => selectedSet.has(r[rowKey]));
    const toggleAll = useCallback(() => {
      if (allChecked) {
        const remove = new Set(displayed.map((r) => r[rowKey]));
        commitSel(selected.filter((k) => !remove.has(k)));
      } else {
        const add = displayed.map((r) => r[rowKey]);
        commitSel(Array.from(new Set([...selected, ...add])));
      }
    }, [allChecked, displayed, rowKey, selected, commitSel]);

    return (
      <div
        ref={ref}
        className={cx(
          'ui-table',
          compact && 'ui-table--compact',
          selectable && 'ui-table--selectable',
          className,
        )}
        style={style}
      >
        <table>
          <thead>
            <tr>
              {selectable && (
                <th className="col-check">
                  <input
                    type="checkbox"
                    className="row-check-all"
                    aria-label="全选"
                    checked={allChecked}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = curSort.key === col.key;
                return (
                  <th
                    key={col.key}
                    className={cx(
                      col.sticky && 'sticky-col',
                      col.sortable && 'ui-th--sortable',
                      isSorted && 'is-sorted',
                    )}
                    data-key={col.key}
                    data-num={col.numeric || undefined}
                    data-dir={isSorted ? curSort.dir : undefined}
                    onClick={() => handleSort(col)}
                  >
                    {col.title}
                    {col.sortable && <span className="arrow">▾</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, ri) => {
              const key = row[rowKey];
              const isSel = selectedSet.has(key);
              return (
                <tr
                  key={key}
                  className={cx(isSel && 'is-selected')}
                  aria-selected={isSel || undefined}
                  onClick={(e) => {
                    if (selectable && (e.target as HTMLElement).closest('.col-check'))
                      return;
                    if (selectable) toggleRow(key);
                  }}
                >
                  {selectable && (
                    <td className="col-check">
                      <input
                        type="checkbox"
                        className="row-check"
                        aria-label="选择"
                        checked={isSel}
                        onChange={() => toggleRow(key)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cx(
                        col.sticky && 'sticky-col',
                        col.numeric && 'ui-num',
                      )}
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
  },
);
