import { resolve, signal } from 'plain';
import { cx, boolAttr } from './_shared';
import { IconCalendar, IconCaret } from './icons';
import type { MaybeGetter } from './_shared';

export type DatePickerValue = string | [string, string] | null;

export interface DatePickerProps {
  range?: MaybeGetter<boolean>;
  value?: MaybeGetter<DatePickerValue>;
  defaultValue?: MaybeGetter<DatePickerValue>;
  onChange?: (value: DatePickerValue) => void;
  placeholder?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  'aria-label'?: MaybeGetter<string>;
  id?: MaybeGetter<string>;
}

const WEEK = ['一', '二', '三', '四', '五', '六', '日'];
const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string | null): Date | null => {
  if (!s) return null;
  const [y, m, d] = String(s).split('-').map(Number);
  if ([y, m, d].some((x) => isNaN(x))) return null;
  return new Date(y, m - 1, d);
};
const startOfMonth = (d: Date | null) =>
  d ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date();

/**
 * DatePicker · 日期选择（输入）
 * 单日 / 区间两种模式；周一起始；区间仅选满两日才回调；点击外部 / 清除关闭。
 */
export function DatePicker(props: DatePickerProps) {
  const range = () => resolve(props.range) ?? false;
  const isControlled = () => resolve(props.value) != null;
  const placeholder = () => resolve(props.placeholder);
  const ariaLabel = () => resolve(props['aria-label']);
  const def: DatePickerValue = isControlled()
    ? (resolve(props.value) as DatePickerValue)
    : resolve(props.defaultValue) != null
      ? (resolve(props.defaultValue) as DatePickerValue)
      : null;
  const inner = signal<DatePickerValue>(def);
  const get = () => (isControlled() ? (resolve(props.value) as DatePickerValue) : inner());

  const open = signal(false);
  const view = signal<Date>(
    startOfMonth(parse(range() ? (get() as any[])[0] : (get() as string))) || new Date(),
  );
  const rangeSel = signal<any>(range() ? get() : null);

  const dataRange = () => (range() ? '' : undefined);

  const setVal = (v: DatePickerValue) => {
    if (!isControlled()) inner.set(v);
    props.onChange?.(v);
  };
  const triggerText = () => {
    if (range()) {
      const [s, e] = (get() as any[]) || [null, null];
      const a = s ? fmt(parse(s)!) : '';
      const b = e ? fmt(parse(e)!) : '';
      if (a && b) return `${a} ~ ${b}`;
      if (a) return a;
      return placeholder() || '选择日期区间';
    }
    const v = get() as string;
    return v ? fmt(parse(v)!) : placeholder() || '选择日期';
  };
  const pick = (d: Date) => {
    const v = fmt(d);
    if (!range()) {
      setVal(v);
      open.set(false);
      return;
    }
    const cur = rangeSel() || [null, null];
    let ns: any[];
    if (!cur[0] || (cur[0] && cur[1])) ns = [v, null];
    else {
      const start = parse(cur[0]);
      ns = start && d >= start ? [cur[0], v] : [v, null];
    }
    rangeSel.set(ns);
    if (ns[0] && ns[1]) {
      setVal(ns as DatePickerValue);
      open.set(false);
    }
  };
  const titleText = () => `${view().getFullYear()}年${view().getMonth() + 1}月`;
  /** 触发器 / 面板的无障碍文案（与 React / Vue 端一致） */
  const popAria = () => (range() ? '选择日期区间' : '选择日期');

  /** 网格单元：仅前置补位 + 当月日期（与 React / Vue 端一致，不补尾部整行） */
  const cells = () => {
    const ym = view();
    const year = ym.getFullYear();
    const month = ym.getMonth();
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const arr: { d: Date; out: boolean; label: number }[] = [];
    for (let i = 0; i < lead; i++) {
      const day = prevDays - lead + 1 + i;
      arr.push({ d: new Date(year, month - 1, day), out: true, label: day });
    }
    for (let d = 1; d <= daysInMonth; d++)
      arr.push({ d: new Date(year, month, d), out: false, label: d });
    return arr;
  };

  // 说明：renderCell 被当作「子组件」，入参 c 视为 props，属性读取用 resolve(c.x)。
  const renderCell = (c: { d: Date; out: boolean; label: number }) => {
    const d = () => resolve(c.d);
    const out = () => resolve(c.out);
    const label = () => resolve(c.label);
    const v = () => fmt(d());
    const today = () => fmt(new Date());
    const isToday = () => v() === today();
    const sel = () => (range() ? rangeSel() : get());
    const isStart = () => range() && (sel() as any[])[0] === v();
    const isEnd = () => range() && (sel() as any[])[1] === v();
    const inRange = () => {
      if (!range()) return false;
      const s = (sel() as any[])[0];
      const e = (sel() as any[])[1];
      // 仅区间内部（不含起止端点）加 in-range，与 React / Vue 端一致
      return !!s && !!e && parse(s)! < d() && d() < parse(e)!;
    };
    // 单日模式：命中当前值即选中（区间模式下 isStart/isEnd 才生效）
    const isSingle = () => !range() && (get() as string) === v();
    const cls = () => {
      if (out()) return 'dp-cell is-out';
      return cx(
        'dp-cell',
        isToday() && 'is-today',
        isSingle() && 'is-selected',
        isStart() && 'is-selected is-start',
        isEnd() && 'is-selected is-end',
        inRange() && 'in-range',
      );
    };
    return (
      <div
        class={cls()}
        data-date={out() ? undefined : v()}
        data-disabled={out() ? '1' : undefined}
        onClick={() => {
          if (!out()) pick(d());
        }}
      >
        {'' + label()}
      </div>
    );
  };

  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-datepicker', resolve(props.className))}
      data-range={dataRange()}
      style={resolve(props.style)}
    >
      <button
        type="button"
        class="ui-datepicker-trigger ui-input"
        aria-haspopup="dialog"
        aria-expanded={open() ? 'true' : 'false'}
        aria-label={ariaLabel() || popAria()}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          if (!open()) {
            if (range()) rangeSel.set(get() || [null, null]);
            view.set(
              startOfMonth(parse(range() ? (get() as any[])[0] : (get() as string))) || new Date(),
            );
          }
          open.set(!open());
        }}
      >
        <span class="ui-icon">
          <IconCalendar />
        </span>
        <span class="dp-text">{triggerText()}</span>
      </button>
      <div
        class="ui-datepicker-pop"
        role="dialog"
        aria-label={popAria()}
        hidden={boolAttr(!open())}
      >
        <div class="dp-head">
          <button
            type="button"
            class="dp-nav"
            data-nav="prev"
            aria-label="上个月"
            onClick={() => view.set(new Date(view().getFullYear(), view().getMonth() - 1, 1))}
          >
            <span class="ui-icon">
              <IconCaret />
            </span>
          </button>
          <span class="dp-title">{titleText()}</span>
          <button
            type="button"
            class="dp-nav"
            data-nav="next"
            aria-label="下个月"
            onClick={() => view.set(new Date(view().getFullYear(), view().getMonth() + 1, 1))}
          >
            <span class="ui-icon">
              <IconCaret />
            </span>
          </button>
        </div>
        <div class="dp-week">
          {WEEK.map((w) => (
            <span>{w}</span>
          ))}
        </div>
        <div class="dp-grid">
          {cells().map((gc) => renderCell(gc))}
        </div>
        <div class="dp-foot">
          <button
            type="button"
            class="ui-btn ui-btn--ghost ui-size-sm"
            data-act="today"
            onClick={() => {
              if (range()) setVal([fmt(new Date()), fmt(new Date())]);
              else setVal(fmt(new Date()));
              open.set(false);
            }}
          >
            今天
          </button>
          <button
            type="button"
            class="ui-btn ui-btn--primary ui-size-sm"
            data-act="clear"
            onClick={() => {
              const empty: any = range() ? [null, null] : null;
              setVal(empty);
              if (range()) rangeSel.set([null, null]);
              // 契约 datepicker.behavior.md：清除保留弹层，仅复位选中与占位文案（不收起）

            }}
          >
            清除
          </button>
        </div>
      </div>
    </div>
  );
}
