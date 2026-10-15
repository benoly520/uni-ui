import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

export type SliderFormat = 'pct' | 'num' | ((v: number) => string);

export interface SliderProps {
  min?: MaybeGetter<number>;
  max?: MaybeGetter<number>;
  step?: MaybeGetter<number>;
  value?: MaybeGetter<[number, number]>;
  defaultValue?: MaybeGetter<[number, number]>;
  format?: SliderFormat;
  onChange?: (value: [number, number]) => void;
  minLabel?: MaybeGetter<string>;
  maxLabel?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Slider · 双滑块区间（数据）
 * 受控/非受控；lo≤hi 约束；支持拖拽（pointer 事件）与键盘微调 / Home / End。
 */
export function Slider(props: SliderProps) {
  const min = () => Number(resolve(props.min) ?? 0);
  const max = () => Number(resolve(props.max) ?? 100);
  const step = () => Number(resolve(props.step) ?? 1);
  const isControlled = () => resolve(props.value) != null;
  /**
   * format 是「值本身可能是函数」的 prop，不能用 resolve 读取（resolve 会把用户传入的
   * 格式化函数当成取值函数直接调用）。plain 编译器又会把普通 prop 包成 0 参取值函数，
   * 因此用形参个数区分：0 参 = 编译器包装的取值函数，≥1 参 = 用户格式化函数。
   */
  const fmt = (): SliderFormat => {
    const raw = props.format as any;
    if (raw == null) return 'num';
    if (typeof raw === 'function') {
      return raw.length === 0 ? (raw() as SliderFormat) : (raw as SliderFormat);
    }
    return raw as SliderFormat;
  };
  const minLabel = () => resolve(props.minLabel) ?? '最小值';
  const maxLabel = () => resolve(props.maxLabel) ?? '最大值';
  const dv: [number, number] = isControlled()
    ? (resolve(props.value) as [number, number])
    : resolve(props.defaultValue) != null
      ? (resolve(props.defaultValue) as [number, number])
      : [min(), max()];
  const loInner = signal(Math.min(dv[0], dv[1]));
  const hiInner = signal(Math.max(dv[0], dv[1]));
  const lo = () =>
    isControlled()
      ? Math.min((resolve(props.value) as any)[0], (resolve(props.value) as any)[1])
      : loInner();
  const hi = () =>
    isControlled()
      ? Math.max((resolve(props.value) as any)[0], (resolve(props.value) as any)[1])
      : hiInner();
  const pct = (v: number) => ((v - min()) / (max() - min())) * 100;
  const fmtVal = (v: number): string => {
    const f = fmt();
    if (typeof f === 'function') return f(v);
    if (f === 'pct') return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
    return String(v);
  };

  /**
   * 拖拽 / 键盘改值：先用当前生效值做 lo≤hi 约束，再回报**新值**。
   * 旧实现用 loInner()/hiInner() 做约束、并回报 lo()/hi()：受控模式下这两个都是旧值，
   * 导致父组件回写时把滑块又拽回原位（React 端回报的是 next）。
   */
  const setHandle = (handle: number, nv: number) => {
    nv = Math.min(max(), Math.max(min(), nv));
    let next: [number, number];
    if (handle === 0) {
      const n = Math.min(nv, hi());
      if (!isControlled()) loInner.set(n);
      next = [n, hi()];
    } else {
      const n = Math.max(nv, lo());
      if (!isControlled()) hiInner.set(n);
      next = [lo(), n];
    }
    props.onChange?.(next);
  };
  const startDrag = (handle: number) => (e: MouseEvent) => {
    e.preventDefault();
    const track = (e.currentTarget as HTMLElement).parentElement as HTMLElement;
    const move = (ev: PointerEvent) => {
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
      let nv = min() + ratio * (max() - min());
      nv = Math.round(nv / step()) * step();
      setHandle(handle, nv);
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  const onKey = (handle: number) => (e: KeyboardEvent) => {
    const k = e.key;
    let nv: number;
    if (k === 'ArrowLeft' || k === 'ArrowDown') nv = (handle === 0 ? lo() : hi()) - step();
    else if (k === 'ArrowRight' || k === 'ArrowUp') nv = (handle === 0 ? lo() : hi()) + step();
    else if (k === 'Home') nv = min();
    else if (k === 'End') nv = max();
    else return;
    e.preventDefault();
    setHandle(handle, nv);
  };

  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-slider-wrap', resolve(props.className))}
      style={resolve(props.style)}
    >
      <div class="ui-slider">
        <div class="ui-slider-track">
          <div
            class="ui-slider-fill"
            style={{
              left: pct(lo()) + '%',
              width: pct(hi()) - pct(lo()) + '%',
            }}
          ></div>
          <div
            class="ui-slider-thumb"
            data-handle={0}
            tabIndex={0}
            role="slider"
            aria-valuemin={min()}
            aria-valuemax={max()}
            aria-valuenow={lo()}
            aria-label={minLabel()}
            style={{ left: pct(lo()) + '%' }}
            onPointerDown={startDrag(0)}
            onKeyDown={onKey(0)}
          ></div>
          <div
            class="ui-slider-thumb"
            data-handle={1}
            tabIndex={0}
            role="slider"
            aria-valuemin={min()}
            aria-valuemax={max()}
            aria-valuenow={hi()}
            aria-label={maxLabel()}
            style={{ left: pct(hi()) + '%' }}
            onPointerDown={startDrag(1)}
            onKeyDown={onKey(1)}
          ></div>
        </div>
      </div>
      <div class="ui-slider-vals">
        <span class="s-min">{fmtVal(lo())}</span>
        <span class="s-max">{fmtVal(hi())}</span>
      </div>
    </div>
  );
}
