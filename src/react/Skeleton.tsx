import React, { forwardRef, type CSSProperties } from 'react';
import { cx } from '../utils/cx';

export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  /** 占位形状 */
  shape?: SkeletonShape;
  /** 宽度（数字转 px） */
  width?: string | number;
  /** 高度（数字转 px）；text 默认 14px */
  height?: string | number;
  /** 是否显示微光动画 */
  active?: boolean;
  className?: string;
  style?: CSSProperties;
}

function toSize(v?: string | number): string | undefined {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

/**
 * Skeleton · 骨架屏（反馈组）
 * - 根 ui-skeleton（自带 ui-shimmer 动画）；形状/尺寸经内联 style 驱动
 * - rect/text/circle；active 控制动画（data-active 仅作可读标记，不驱动 CSS）
 * - 不新增 CSS、不改 theme.css
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = 'rect', width, height, active = true, className, style },
  ref,
) {
  const shapeStyle: CSSProperties = {};
  if (shape === 'circle') {
    const size = toSize(width ?? height ?? 40);
    shapeStyle.width = size;
    shapeStyle.height = size ?? toSize(height ?? 40);
    shapeStyle.borderRadius = '50%';
  } else if (shape === 'text') {
    if (height != null) shapeStyle.height = toSize(height);
    else if (!style?.height) shapeStyle.height = '14px';
    if (width != null) shapeStyle.width = toSize(width);
  } else {
    if (width != null) shapeStyle.width = toSize(width);
    if (height != null) shapeStyle.height = toSize(height);
  }

  return (
    <div
      ref={ref}
      className={cx('ui-skeleton', className)}
      role="presentation"
      aria-hidden={!active ? undefined : undefined}
      data-active={active ? 'true' : 'false'}
      style={{ ...shapeStyle, ...style }}
    />
  );
});
