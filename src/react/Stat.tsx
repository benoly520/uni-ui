import React, {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type StatTrend = 'up' | 'down' | 'muted';

export interface StatProps {
  /** 指标名（如「上证指数」） */
  label?: string;
  /** 主值，强制 tabular-nums 等宽数字 */
  value?: string | number;
  /** 前缀（如 ¥） */
  prefix?: string;
  /** 后缀（如 亿） */
  suffix?: string;
  /** 涨跌文案（如 +1.24% / 较昨日 —） */
  delta?: string;
  /** 涨跌着色：走 --ui-color-up/down；muted 灰色 */
  trend?: StatTrend;
  className?: string;
  style?: CSSProperties;
}

const trendClass = (t?: StatTrend) =>
  t == null ? undefined : `ui-num--${t}`;

/**
 * Stat · 指标卡（数据表单组）
 * - label / value(.ui-num 等宽) / delta(.ui-num--* 着色)
 * - trend 同时加 ui-num--* 类与 data-num 属性（着色由类驱动，见 dom 契约）
 * - 纯展示，受控，零内部状态；不携带样式，全部走 theme.css
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, prefix, suffix, delta, trend, className, style },
  ref,
) {
  return (
    <div ref={ref} className={cx('ui-stat', className)} style={style}>
      {label != null && <span className="label">{label}</span>}
      {value != null && (
        <span
          className={cx('value', 'ui-num', trendClass(trend))}
          data-num={trend}
        >
          {prefix}
          {value}
          {suffix}
        </span>
      )}
      {delta != null && (
        <span className={cx('delta', trendClass(trend))} data-num={trend}>
          {delta}
        </span>
      )}
    </div>
  );
});
