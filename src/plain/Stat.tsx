import { cx } from './_shared';

export type StatTrend = 'up' | 'down' | 'muted';

export interface StatProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  label?: string;
  value?: string | number;
  prefix?: string;
  suffix?: string;
  delta?: string;
  trend?: StatTrend;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Stat · 指标卡（展示）
 * 主值等宽数字（ui-num）；涨跌着色跟随 trend（up/down/muted）。
 */
export function Stat(props: StatProps) {
  const label = () => props.label;
  const value = () => props.value;
  const prefix = () => props.prefix;
  const suffix = () => props.suffix;
  const delta = () => props.delta;
  const trend = () => props.trend;
  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-stat', props.className)}
      style={props.style}
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
