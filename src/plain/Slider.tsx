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
  format?: MaybeGetter<SliderFormat>;
  onChange?: (value: [number, number]) => void;
  minLabel?: MaybeGetter<string>;
  maxLabel?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

/**
 * Slider · 双滑块区间（数据）
 * 受控/非受控；lo≤hi 约束；支持拖拽（pointer 事件）与键盘微调 / Home / End。
 */
export function Slider(props: SliderProps) {
  const {
    min: minProp = 0,
    max: maxProp = 100,
    step: stepProp = 1,
    value,
    defaultValue,
    format: formatProp = 'num',
    onChange,
    minLabel = '最小值',
    maxLabel = '最大值',
    className,
    style,
    ...rest
  } = props;
  // 动态 props 编译期一律传 getter，这里取值后统一收敛为数字，避免后续运算里反复 resolve
  const min = Number(resolve(minProp));
  const max = Number(resolve(maxProp));
  const step = Number(resolve(stepProp));
  const isControlled = value != null;
  const dv = value != null
    ? (resolve(value) as [number, number])
    : defaultValue != null
      ? (resolve(defaultValue) as [number, number])
      : [min, max];
  const loInner = signal(Math.min(dv[0], dv[1]));
  const hiInner = signal(Math.max(dv[0], dv[1]));
  const lo = () =>
    isControlled ? Math.min((resolve(value) as any)[0], (resolve(value) as any)[1]) : loInner();
  const hi = () =>
    isControlled ? Math.max((resolve(value) as any)[0], (resolve(value) as any)[1]) : hiInner();
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const fmt = resolve(formatProp as any) as SliderFormat;
  const fmtVal = (v: number): string => {
    if (typeof fmt === 'function') return (fmt as (x: number) => string)(v);
    if (fmt === 'pct') return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
    return String(v);
  };

  const setHandle = (handle: number, nv: number) => {
    nv = Math.min(max, Math.max(min, nv));
    if (handle === 0) {
      const n = Math.min(nv, hiInner());
      if (!isControlled) loInner.set(n);
    } else {
      const n = Math.max(nv, loInner());
      if (!isControlled) hiInner.set(n);
    }
    onChange?.([lo(), hi()]);
  };
  const startDrag = (handle: number) => (e: MouseEvent) => {
    e.preventDefault();
    const track = (e.currentTarget as HTMLElement).parentElement as HTMLElement;
    const move = (ev: PointerEvent) => {
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
      let nv = min + ratio * (max - min);
      nv = Math.round(nv / step) * step;
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
    if (k === 'ArrowLeft' || k === 'ArrowDown') nv = (handle === 0 ? lo() : hi()) - step;
    else if (k === 'ArrowRight' || k === 'ArrowUp') nv = (handle === 0 ? lo() : hi()) + step;
    else if (k === 'Home') nv = min;
    else if (k === 'End') nv = max;
    else return;
    e.preventDefault();
    setHandle(handle, nv);
  };

  return (
    <div {...rest} class={cx('ui-slider-wrap', resolve(className))} style={resolve(style)}>
      <div class="ui-slider">
        <div class="ui-slider-track">
          <div
            class="ui-slider-fill"
            style={() => ({ left: pct(lo()) + '%', width: pct(hi()) - pct(lo()) + '%' })}
          ></div>
          <div
            class="ui-slider-thumb"
            data-handle={0}
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={lo()}
            aria-label={minLabel}
            style={() => ({ left: pct(lo()) + '%' })}
            onPointerDown={startDrag(0)}
            onKeyDown={onKey(0)}
          ></div>
          <div
            class="ui-slider-thumb"
            data-handle={1}
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={hi()}
            aria-label={maxLabel}
            style={() => ({ left: pct(hi()) + '%' })}
            onPointerDown={startDrag(1)}
            onKeyDown={onKey(1)}
          ></div>
        </div>
      </div>
      <div class="ui-slider-vals">
        <span class="s-min">{() => fmtVal(lo())}</span>
        <span class="s-max">{() => fmtVal(hi())}</span>
      </div>
    </div>
  );
}
