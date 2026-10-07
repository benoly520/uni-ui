import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from '../utils/cx';

export interface VTableColumn {
  key: string;
  title: string;
  numeric?: boolean;
  sticky?: boolean;
  /** 涨跌着色：返回 up/down 给单元格加 ui-num--* */
  trend?: (row: Record<string, any>) => 'up' | 'down' | undefined;
  /** grid 列宽，默认 1fr */
  width?: string;
}

export interface VirtualTableProps {
  rows: Record<string, any>[];
  columns: VTableColumn[];
  /** 固定行高（px），默认 33 对齐 theme.css */
  rowHeight?: number;
  /** 上下缓冲行，默认 6 */
  buffer?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

function computeRange(
  scrollTop: number,
  clientHeight: number,
  total: number,
  rowHeight: number,
  buffer: number,
): [number, number] {
  const ch = clientHeight || 320; // 回退 max-height 320
  const start = Math.floor(scrollTop / rowHeight);
  const vis = Math.ceil(ch / rowHeight) + buffer * 2;
  const s = Math.max(0, start - buffer);
  const e = Math.min(total, s + vis);
  return [s, e];
}

/**
 * VirtualTable · 虚拟滚动表（数据表单组）
 * - 固定行高 + 仅渲染可视窗口（上下 buffer）；5000 行 DOM 仅 ~22 节点
 * - 表头 sticky 吸顶、首列 sticky 冻结；列宽经内联 grid 驱动
 * - 还原预览 initVirtualTable 窗口化算法（两侧一致）
 */
export const VirtualTable = forwardRef<HTMLDivElement, VirtualTableProps>(
  function VirtualTable(
    {
      rows,
      columns,
      rowHeight = 33,
      buffer = 6,
      ariaLabel,
      className,
      style,
    },
    ref,
  ) {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const total = rows.length;
    const [range, setRange] = useState<[number, number]>([0, 0]);

    const gridStyle = useMemo<CSSProperties>(
      () => ({
        gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
      }),
      [columns],
    );

    const recompute = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      setRange(computeRange(el.scrollTop, el.clientHeight, total, rowHeight, buffer));
    }, [total, rowHeight, buffer]);

    useLayoutEffect(() => {
      recompute();
    }, [recompute]);

    useEffect(() => {
      window.addEventListener('resize', recompute);
      return () => window.removeEventListener('resize', recompute);
    }, [recompute]);

    const onScroll = useCallback(() => recompute(), [recompute]);

    const setRef = useCallback(
      (el: HTMLDivElement | null) => {
        innerRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      },
      [ref],
    );

    const [s, e] = range;
    const windowRows: React.ReactNode[] = [];
    for (let i = s; i < e; i++) {
      const row = rows[i];
      if (!row) continue;
      windowRows.push(
        <div
          key={i}
          className="ui-vtable-row"
          style={{
            ...gridStyle,
            transform: `translateY(${i * rowHeight}px)`,
          }}
        >
          {columns.map((col) => {
            const t = col.trend?.(row);
            return (
              <span
                key={col.key}
                className={cx(
                  col.sticky && 'sticky-col',
                  col.numeric && 'ui-num',
                  t && `ui-num--${t}`,
                )}
                data-num={col.numeric || undefined}
              >
                {row[col.key]}
              </span>
            );
          })}
        </div>,
      );
    }

    return (
      <>
        <div
          ref={setRef}
          className={cx('ui-vtable', className)}
          style={style}
          aria-label={ariaLabel}
          onScroll={onScroll}
        >
          <div className="ui-vtable-head" style={gridStyle}>
            {columns.map((col) => (
              <span
                key={col.key}
                className={cx(col.sticky && 'sticky-col')}
                data-num={col.numeric || undefined}
              >
                {col.title}
              </span>
            ))}
          </div>
          <div className="ui-vtable-viewport" style={{ height: total * rowHeight }}>
            {windowRows}
          </div>
        </div>
        <div className="ui-vtable-meta">
          渲染 {e - s} 行 / 共 {total} 行
        </div>
      </>
    );
  },
);
