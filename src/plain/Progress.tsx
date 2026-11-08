import { cx } from './_shared';

export interface ProgressProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  value?: number;
  max?: number;
  indeterminate?: boolean;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Progress · 进度条（展示）
 * 确定值按 value/max 计算百分比宽度；indeterminate 为不确定态（无具体进度）。
 */
export function Progress(props: ProgressProps) {
  const value = () => props.value ?? 0;
  const max = () => props.max ?? 100;
  const indeterminate = () => props.indeterminate ?? false;
  const ariaNow = () => (indeterminate() ? undefined : value());
  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-progress', indeterminate() && 'ui-progress--indeterminate', props.className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max()}
      aria-valuenow={ariaNow()}
      style={props.style}
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
