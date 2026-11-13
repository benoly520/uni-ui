import { signal } from 'plain';
import { cx } from './_shared';

export type SliderFormat = 'pct' | 'num' | ((v: number) => string);

export interface SliderProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  format?: SliderFormat;
  onChange?: (value: [number, number]) => void;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Slider · 双滑块区间（数据）
 * 受控/非受控；lo≤hi 约束；支持拖拽（pointer 事件）与键盘微调 / Home / End。
 */
export function Slider(props: SliderProps) {
  const min = () => Number(props.min ?? 0);
  const max = () => Number(props.max ?? 100);
  const step = () => Number(props.step ?? 1);
  const isControlled = () => props.value != null;
  /** format 读出来就是用户传入的格式化函数（或字符串枚举），不再需要按形参个数区分 */
  const fmt = (): SliderFormat => (props.format ?? 'num') as SliderFormat;
  const minLabel = () => props.minLabel ?? '最小值';
  const maxLabel = () => props.maxLabel ?? '最大值';
  /** 读取内部状态的初始区间，不缓存 props 的复合读取。 */
  const dv = (): [number, number] => isControlled()
    ? (props.value as [number, number])
    : props.defaultValue != null
      ? (props.defaultValue as [number, number])
      : [min(), max()];
  const loInner = signal(Math.min(dv()[0], dv()[1]));
  const hiInner = signal(Math.max(dv()[0], dv()[1]));
  const lo = () =>
    isControlled()
      ? Math.min((props.value as any)[0], (props.value as any)[1])
      : loInner();
  const hi = () =>
    isControlled()
      ? Math.max((props.value as any)[0], (props.value as any)[1])
      : hiInner();
  // 分母兜底：min === max 时避免 0/0 得到 NaN%
  const pct = (v: number) => ((v - min()) / ((max() - min()) || 1)) * 100;
  /** 按数值的小数位收敛浮点误差（min/step 非整数时 min + n*step 会得到 44.999999）。 */
  const decimalsOf = (n: number) => {
    const s = String(n);
    const i = s.indexOf('.');
    return i < 0 ? 0 : s.length - i - 1;
  };
  /**
   * 吸附到以 min 为基准的 step 栅格，再钳制到 [min, max]。
   * 锚点必须是 min（对齐原生 input[type=range] 的 step base）；
   * 旧实现按绝对值取整（round(v / step) * step），min 非 step 整数倍时会产生死区。
   */
  const snapStep = (v: number, floor: number, ceil: number, s: number) => {
    const st = s || 1;
    const snapped = floor + Math.round((v - floor) / st) * st;
    const d = Math.max(decimalsOf(floor), decimalsOf(st));
    const val = d > 0 ? Number(snapped.toFixed(d)) : snapped;
    return Math.min(ceil, Math.max(floor, val));
  };
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
      nv = snapStep(nv, min(), max(), step());
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
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-slider-wrap', props.className)}
      style={props.style}
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
