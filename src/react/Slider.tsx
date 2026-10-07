import React, {
  forwardRef,
  useCallback,
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

function clampStep(v: number, min: number, max: number, step: number): number {
  const snapped = Math.round((v - min) / step) * step;
  return Math.min(max, Math.max(min, snapped));
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
  const lo = isControlled ? value![0] : inner[0];
  const hi = isControlled ? value![1] : inner[1];

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
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
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
