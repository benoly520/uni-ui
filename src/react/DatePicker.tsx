import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from '../utils/cx';

export type DatePickerValue = string | [string, string] | null;

export interface DatePickerProps {
  /** 范围模式（选起止两日）；否则单日 */
  range?: boolean;
  /** 受控值：单日 'YYYY-MM-DD'；范围 [起, 止]；未选 null */
  value?: DatePickerValue;
  /** 非受控初始值 */
  defaultValue?: DatePickerValue;
  /** 值变化。范围模式仅选满两日时触发 */
  onChange?: (value: DatePickerValue) => void;
  /** 未选占位；单日默认「选择日期」，范围默认「选择日期区间」 */
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
const parse = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const same = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getTime() === b.getTime();

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 2v4M16 2v4" />
  </svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/**
 * DatePicker · 单日 / 日期范围（金融增强）
 * - 周一为周起点、上下月导航、今天/清除、范围高亮、选满自动收起
 * - 受控 value + onChange；范围模式仅选满两日时回调（对齐 initDatePicker）
 * - 不携带样式，全部走 theme.css；图标为内置 24×24 currentColor 内联 SVG
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(
    {
      range = false,
      value,
      defaultValue,
      onChange,
      placeholder,
      className,
      style,
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    const isControlled = value != null;
    const rootRef = useRef<HTMLDivElement | null>(null);
    const popRef = useRef<HTMLDivElement | null>(null);

    const today = useMemo(() => {
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      return t;
    }, []);

    const initFrom = (v: DatePickerValue): { start: Date | null; end: Date | null; view: Date } => {
      if (range) {
        const arr = (v as [string, string] | null) ?? null;
        const s = arr?.[0] ? parse(arr[0]) : null;
        const e = arr?.[1] ? parse(arr[1]) : null;
        return { start: s, end: e, view: new Date((s ?? today).getFullYear(), (s ?? today).getMonth(), 1) };
      }
      const s = typeof v === 'string' && v ? parse(v) : null;
      return { start: s, end: null, view: new Date((s ?? today).getFullYear(), (s ?? today).getMonth(), 1) };
    };

    const init = initFrom(defaultValue ?? null);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<Date>(init.view);
    const [start, setStart] = useState<Date | null>(init.start);
    const [end, setEnd] = useState<Date | null>(init.end);

    useEffect(() => {
      if (!isControlled) return;
      const r = initFrom(value!);
      setStart(r.start);
      setEnd(r.end);
      setView(r.view);
    }, [isControlled, value]);

    const triggerText = (() => {
      if (range) {
        if (start && end) return `${fmt(start)} ~ ${fmt(end)}`;
        if (start) return fmt(start);
        return placeholder ?? '选择日期区间';
      }
      return start ? fmt(start) : placeholder ?? '选择日期';
    })();

    const popAria = range ? '选择日期区间' : '选择日期';
    const triggerAria = ariaLabel ?? popAria;

    const commit = useCallback(
      (s: Date | null, e: Date | null) => {
        if (range) onChange?.(s && e ? [fmt(s), fmt(e)] : null);
        else onChange?.(s ? fmt(s) : null);
      },
      [range, onChange],
    );

    const pick = useCallback(
      (date: Date) => {
        if (range) {
          let ns = start;
          let ne = end;
          if (!start || (start && end)) {
            ns = date;
            ne = null;
          } else if (date < start) {
            ne = start;
            ns = date;
          } else {
            ne = date;
          }
          setStart(ns);
          setEnd(ne);
          if (ns && ne) {
            commit(ns, ne);
            setOpen(false);
          }
        } else {
          setStart(date);
          commit(date, null);
          setOpen(false);
        }
      },
      [range, start, end, commit],
    );

    const cells = useMemo(() => {
      const first = new Date(view.getFullYear(), view.getMonth(), 1);
      const lead = (first.getDay() + 6) % 7;
      const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      const prevDays = new Date(view.getFullYear(), view.getMonth(), 0).getDate();
      const out: React.ReactNode[] = [];
      for (let i = 0; i < lead; i++) {
        const d = prevDays - lead + 1 + i;
        out.push(
          <div key={`o${i}`} className="dp-cell is-out" data-disabled="1">
            {d}
          </div>,
        );
      }
      for (let d = 1; d <= days; d++) {
        const date = new Date(view.getFullYear(), view.getMonth(), d);
        const cls = cx(
          'dp-cell',
          same(date, today) && 'is-today',
          range
            ? cx(
                same(date, start) && 'is-selected is-start',
                same(date, end) && 'is-selected is-end',
                start && end && date > start && date < end && 'in-range',
              )
            : same(date, start) && 'is-selected',
        );
        out.push(
          <div
            key={d}
            className={cls || 'dp-cell'}
            data-date={fmt(date)}
            onClick={() => pick(date)}
          >
            {d}
          </div>,
        );
      }
      return out;
    }, [view, today, start, end, range, pick]);

    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    return (
      <div
        className={cx('ui-datepicker', className)}
        style={style}
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        {...(range ? { 'data-range': '' } : {})}
      >
        <button
          type="button"
          className="ui-datepicker-trigger ui-input"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={triggerAria}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          <span className="ui-icon">
            <CalendarIcon />
          </span>
          <span className="dp-text">{triggerText}</span>
        </button>
        <div
          className="ui-datepicker-pop"
          role="dialog"
          aria-label={popAria}
          hidden={!open}
          ref={popRef}
        >
          <div className="dp-head">
            <button
              type="button"
              className="dp-nav"
              data-nav="prev"
              aria-label="上个月"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
            >
              <span className="ui-icon">
                <ChevronLeft />
              </span>
            </button>
            <span className="dp-title">
              {view.getFullYear()}年{view.getMonth() + 1}月
            </span>
            <button
              type="button"
              className="dp-nav"
              data-nav="next"
              aria-label="下个月"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
            >
              <span className="ui-icon">
                <ChevronRight />
              </span>
            </button>
          </div>
          <div className="dp-week">
            <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
          </div>
          <div className="dp-grid">{cells}</div>
          <div className="dp-foot">
            <button
              type="button"
              className="ui-btn ui-btn--ghost ui-size-sm"
              data-act="today"
              onClick={() => {
                if (range) {
                  setStart(new Date(today));
                  setEnd(new Date(today));
                  commit(new Date(today), new Date(today));
                } else {
                  setStart(new Date(today));
                  commit(new Date(today), null);
                }
                setOpen(false);
              }}
            >
              今天
            </button>
            <button
              type="button"
              className="ui-btn ui-btn--primary ui-size-sm"
              data-act="clear"
              onClick={() => {
                setStart(null);
                setEnd(null);
              }}
            >
              清除
            </button>
          </div>
        </div>
      </div>
    );
  },
);
