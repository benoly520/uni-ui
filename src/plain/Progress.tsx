import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

export interface ProgressProps {
  value?: MaybeGetter<number>;
  max?: MaybeGetter<number>;
  indeterminate?: MaybeGetter<boolean>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Progress · 进度条（展示）
 * 确定值按 value/max 计算百分比宽度；indeterminate 为不确定态（无具体进度）。
 */
export function Progress(props: ProgressProps) {
  const value = () => resolve(props.value) ?? 0;
  const max = () => resolve(props.max) ?? 100;
  const indeterminate = () => resolve(props.indeterminate) ?? false;
  const ariaNow = () => (indeterminate() ? undefined : value());
  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-progress', indeterminate() && 'ui-progress--indeterminate', resolve(props.className))}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max()}
      aria-valuenow={ariaNow()}
      style={resolve(props.style)}
    >
      <span
        style={
          indeterminate()
            ? {}
            : {
                width:
                  Math.max(
                    0,
                    Math.min(100, (Number(value()) / (Number(max()) || 1)) * 100),
                  ) + '%',
              }
        }
      ></span>
    </div>
  );
}
