import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

export interface ProgressProps {
  value?: MaybeGetter<number>;
  max?: MaybeGetter<number>;
  indeterminate?: MaybeGetter<boolean>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

/**
 * Progress · 进度条（展示）
 * 确定值按 value/max 计算百分比宽度；indeterminate 为不确定态（无具体进度）。
 */
export function Progress(props: ProgressProps) {
  const { value = 0, max = 100, indeterminate = false, className, style, ...rest } = props;
  const ariaNow = () => (resolve(indeterminate) ? undefined : resolve(value));
  return (
    <div
      {...rest}
      class={cx('ui-progress', resolve(indeterminate) && 'ui-progress--indeterminate', resolve(className))}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={resolve(max)}
      aria-valuenow={ariaNow()}
      style={resolve(style)}
    >
      <span
        style={() => {
          const ind = resolve(indeterminate);
          if (ind) return {} as Record<string, string | number>;
          const pct = Math.max(
            0,
            Math.min(100, (Number(resolve(value)) / Number(resolve(max))) * 100),
          );
          return { width: pct + '%' };
        }}
      ></span>
    </div>
  );
}
