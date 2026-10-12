import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

export type StatTrend = 'up' | 'down' | 'muted';

export interface StatProps {
  label?: MaybeGetter<string>;
  value?: MaybeGetter<string | number>;
  prefix?: MaybeGetter<string>;
  suffix?: MaybeGetter<string>;
  delta?: MaybeGetter<string>;
  trend?: MaybeGetter<StatTrend>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

/**
 * Stat · 指标卡（展示）
 * 主值等宽数字（ui-num）；涨跌着色跟随 trend（up/down/muted）。
 */
export function Stat(props: StatProps) {
  const { label, value, prefix, suffix, delta, trend, className, style, ...rest } = props;
  return (
    <div {...rest} class={cx('ui-stat', resolve(className))} style={resolve(style)}>
      {resolve(label) != null && <span class="label">{String(resolve(label))}</span>}
      {resolve(value) != null && (
        <span
          class={cx('value', 'ui-num', resolve(trend) && 'ui-num--' + resolve(trend))}
          data-num={resolve(trend)}
        >
          {'' + resolve(prefix) + resolve(value) + resolve(suffix)}
        </span>
      )}
      {resolve(delta) != null && (
        <span
          class={cx('delta', 'ui-num', resolve(trend) && 'ui-num--' + resolve(trend))}
          data-num={resolve(trend)}
        >
          {String(resolve(delta))}
        </span>
      )}
    </div>
  );
}
