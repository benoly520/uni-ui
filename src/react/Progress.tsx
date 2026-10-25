import React, { forwardRef, type CSSProperties } from 'react';
import { cx } from '../utils/cx';

export interface ProgressProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  /** 当前进度（受控） */
  value?: number;
  /** 满值 */
  max?: number;
  /** 不确定态：无具体进度 */
  indeterminate?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Progress · 进度条（反馈组）
 * - 根 ui-progress + 子 span 填充；width = value/max*100%
 * - indeterminate 加 ui-progress--indeterminate（theme.css 待补专属样式）
 * - role=progressbar + aria-valuenow/min/max；纯展示，进度由父组件驱动
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { glass, value = 0, max = 100, indeterminate = false, className, style },
  ref,
) {
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / (max || 1)) * 100));
  return (
    <div
      data-glass={glass === false ? 'off' : undefined}
      ref={ref}
      className={cx('ui-progress', indeterminate && 'ui-progress--indeterminate', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      {...(indeterminate ? {} : { 'aria-valuenow': value })}
      style={style}
    >
      <span style={{ width: indeterminate ? undefined : `${pct}%` }} />
    </div>
  );
});
