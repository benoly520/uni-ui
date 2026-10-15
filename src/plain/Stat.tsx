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
  id?: MaybeGetter<string>;
}

/**
 * Stat · 指标卡（展示）
 * 主值等宽数字（ui-num）；涨跌着色跟随 trend（up/down/muted）。
 */
export function Stat(props: StatProps) {
  const label = () => resolve(props.label);
  const value = () => resolve(props.value);
  const prefix = () => resolve(props.prefix);
  const suffix = () => resolve(props.suffix);
  const delta = () => resolve(props.delta);
  const trend = () => resolve(props.trend);
  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-stat', resolve(props.className))}
      style={resolve(props.style)}
    >
      {label() != null && <span class="label">{String(label())}</span>}
      {value() != null && (
        <span
          class={cx('value', 'ui-num', trend() && 'ui-num--' + trend())}
          data-num={trend()}
        >
          {(prefix() ?? '') + String(value()) + (suffix() ?? '')}
        </span>
      )}
      {delta() != null && (
        <span
          class={cx('delta', trend() && 'ui-num--' + trend())}
          data-num={trend()}
        >
          {String(delta())}
        </span>
      )}
    </div>
  );
}
