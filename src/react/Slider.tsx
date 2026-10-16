import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cx } from '../utils/cx';

export type SliderFormat = 'pct' | 'num' | ((v: number) => string);

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  /** 受控值：[低值, 高值] */
  value?: [number, number];
  /** 非受控默认值 */
  defaultValue?: [number, number];
  /** 'pct' 显示 ±x.x%；'num' 纯数字；或自定义格式化函数 */
  format?: SliderFormat;
  onChange?: (value: [number, number]) => void;
  className?: string;
  style?: CSSProperties;
  minLabel?: string;
  maxLabel?: string;
}

function formatVal(v: number, fmt: SliderFormat): string {
  if (typeof fmt === 'function') return fmt(v);
  if (fmt === 'pct') return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
  return String(v);
}

/** 按数值的小数位收敛浮点误差（min/step 非整数时 min + n*step 会得到 44.999999）。 */
function decimalsOf(n: number): number {
  const s = String(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

/**
 * 吸附到以 min 为基准的 step 栅格，再钳制到 [min, max]。
 * 锚点必须是 min（对齐原生 input[type=range] 的 step base）；
 * 写成 round(v / step) * step 时，min 非 step 整数倍会产生无法选中的死区。
 */
function clampStep(v: number, min: number, max: number, step: number): number {
  const s = step || 1;
  const snapped = min + Math.round((v - min) / s) * s;
  const d = Math.max(decimalsOf(min), decimalsOf(s));
  const val = d > 0 ? Number(snapped.toFixed(d)) : snapped;
  return Math.min(max, Math.max(min, val));
}

/**
 * Slider · 双滑块区间筛选（金融筛选骨架组件）
 * - 拖拽（pointer）与键盘（←/→/↑/↓/Home/End，step 钳制，自动约束 min≤max）
 * - 填充条 + 双 thumb 按百分比定位，颜色走品牌色；`role="slider"` + `aria-valuenow`
 * - 受控/非受控双模式；不携带样式，全部走 theme.css
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    format = 'num',
    onChange,
    className,
    style,
    minLabel = '最小值',
    maxLabel = '最大值',
  },
  ref,
) {
  const isControlled = value != null;
  const [inner, setInner] = useState<[number, number]>(
    () => defaultValue ?? [min, max],
  );
  // 受控值同样做 lo ≤ hi 归一：契约要求「始终 lo ≤ hi」，
  // 父级传逆序时若不归一，填充条宽度会算出负值。
  const lo = isControlled ? Math.min(value![0], value![1]) : inner[0];
  const hi = isControlled ? Math.max(value![0], value![1]) : inner[1];
  // 拖拽期间挂在 document 上的监听：若拖拽未结束组件就被卸载，必须回收，否则泄漏并继续 commit
  const dragCleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => dragCleanupRef.current?.(), []);

  const trackRef = useRef<HTMLDivElement>(null);
  const range = max - min || 1;

  const commit = useCallback(
    (next: [number, number]) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const pct = useCallback((v: number) => ((v - min) / range) * 100, [min, range]);

  const valFromX = useCallback(
    (clientX: number) => {
      const r = trackRef.current!.getBoundingClientRect();
      let p = (clientX - r.left) / r.width;
      p = Math.min(1, Math.max(0, p));
      return clampStep(min + p * range, min, max, step);
    },
    [min, max, range, step],
  );

  const startDrag = (handle: 0 | 1) => (e: ReactPointerEvent) => {
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      const v = valFromX(ev.clientX);
      const next: [number, number] =
        handle === 0 ? [Math.min(v, hi), hi] : [lo, Math.max(v, lo)];
      commit(next);
    };
    // up 与卸载清理复用同一函数：一次摘掉 pointermove 与 pointerup
    const cleanup = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', cleanup);
      dragCleanupRef.current = null;
    };
    dragCleanupRef.current = cleanup;
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', cleanup);
  };

  const onKey = (handle: 0 | 1) => (e: ReactKeyboardEvent) => {
    let d = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -step;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = step;
    else if (e.key === 'Home') d = handle === 0 ? min - lo : min - hi;
    else if (e.key === 'End') d = handle === 0 ? max - lo : max - hi;
    else return;
    e.preventDefault();
    const next: [number, number] =
      handle === 0
        ? [Math.min(Math.max(min, lo + d), hi), hi]
        : [lo, Math.max(Math.min(max, hi + d), lo)];
    commit(next);
  };

  const pLo = pct(lo);
  const pHi = pct(hi);

  return (
    <div className={cx('ui-slider-wrap', className)} style={style} ref={ref}>
      <div className="ui-slider">
        <div className="ui-slider-track" ref={trackRef}>
          <div
            className="ui-slider-fill"
            style={{ left: `${pLo}%`, width: `${pHi - pLo}%` }}
          />
          <div
            className="ui-slider-thumb"
            data-handle="0"
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={lo}
            aria-label={minLabel}
            style={{ left: `${pLo}%` }}
            onPointerDown={startDrag(0)}
            onKeyDown={onKey(0)}
          />
          <div
            className="ui-slider-thumb"
            data-handle="1"
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={hi}
            aria-label={maxLabel}
            style={{ left: `${pHi}%` }}
            onPointerDown={startDrag(1)}
            onKeyDown={onKey(1)}
          />
        </div>
      </div>
      <div className="ui-slider-vals">
        <span className="s-min">{formatVal(lo, format)}</span>
        <span className="s-max">{formatVal(hi, format)}</span>
      </div>
    </div>
  );
});
