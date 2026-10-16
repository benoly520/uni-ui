import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

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
  rows: MaybeGetter<Record<string, any>[]>;
  columns: MaybeGetter<VTableColumn[]>;
  /** 固定行高（px），默认 33 对齐 theme.css */
  rowHeight?: MaybeGetter<number>;
  /** 上下缓冲行，默认 6 */
  buffer?: MaybeGetter<number>;
  ariaLabel?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * VirtualTable · 虚拟滚动表（数据表单组）
 * 固定行高 + 仅渲染可视窗口（上下 buffer）；窗口外不创建 DOM。
 * 表头 sticky 吸顶、首列 sticky 冻结；列宽经内联 grid 驱动。
 * resize 监听在 ref 清理里回收，消除旧实现长期挂监听的泄漏。
 */
export function VirtualTable(props: VirtualTableProps) {
  const total = () => (resolve(props.rows) as Record<string, any>[]).length;
  const range = signal<[number, number]>([0, 0]);

  const gridStyle = () => {
    const cols = resolve(props.columns) as VTableColumn[];
    return { gridTemplateColumns: cols.map((c) => c.width || '1fr').join(' ') };
  };

  const recompute = (scrollTop: number, clientHeight: number) => {
    const ch = clientHeight || 320;
    const t = total();
    const rh = Number(resolve(props.rowHeight) ?? 33);
    const buf = Number(resolve(props.buffer) ?? 6);
    const start = Math.floor(scrollTop / rh);
    const vis = Math.ceil(ch / rh) + buf * 2;
    const s = Math.max(0, start - buf);
    const e = Math.min(t, s + vis);
    range.set([s, e]);
  };

  const windowIndices = () => {
    const [s, e] = range();
    const out: number[] = [];
    for (let i = s; i < e; i++) out.push(i);
    return out;
  };

  let vtEl: HTMLElement | null = null;
  const refVt = (el: HTMLElement) => {
    vtEl = el;
    const onResize = () => recompute(el.scrollTop, el.clientHeight);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      vtEl = null;
    };
  };
  // 初始窗口（一次性，无泄漏）
  requestAnimationFrame(() => {
    if (vtEl) recompute(vtEl.scrollTop, vtEl.clientHeight);
  });

  const ariaLabel = () => resolve(props.ariaLabel);

  return (
    <>
      <div
        id={resolve(props.id)}
        ref={refVt}
        class={cx('ui-vtable', resolve(props.className))}
        style={resolve(props.style)}
        aria-label={ariaLabel()}
        onScroll={(e: Event) => {
          const el = e.currentTarget as HTMLElement;
          recompute(el.scrollTop, el.clientHeight);
        }}
      >
        <div class="ui-vtable-head" style={gridStyle()}>
          {(resolve(props.columns) as VTableColumn[]).map((col) => (
            <span class={cx(col.sticky && 'sticky-col')} data-num={col.numeric || undefined}>
              {col.title}
            </span>
          ))}
        </div>
        <div
          class="ui-vtable-viewport"
          style={{ height: `${total() * Number(resolve(props.rowHeight) ?? 33)}px` }}
        >
          {(windowIndices()).map((i) => {
            const row = (resolve(props.rows) as Record<string, any>[])[i];
            const rh = Number(resolve(props.rowHeight) ?? 33);
            return (
              <div
                class="ui-vtable-row"
                // plain 的 style 只接受「对象或字符串」求值结果，传取值函数会被静默丢弃
                style={{ ...gridStyle(), transform: `translateY(${i * rh}px)` }}
              >
                {(resolve(props.columns) as VTableColumn[]).map((col) => {
                  const t = () => (col.trend ? col.trend(row) : undefined);
                  return (
                    <span
                      class={cx(
                        col.sticky && 'sticky-col',
                        col.numeric && 'ui-num',
                        t() && `ui-num--${t()}`,
                      )}
                      data-num={col.numeric || undefined}
                    >
                      {row[col.key]}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div class="ui-vtable-meta">渲染 {range()[1] - range()[0]} 行 / 共 {total()} 行</div>
    </>
  );
}
