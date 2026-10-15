import { resolve } from 'plain';
import { cx, mergeStyle } from './_shared';
import type { MaybeGetter } from './_shared';

export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  shape?: MaybeGetter<SkeletonShape>;
  width?: MaybeGetter<string | number>;
  height?: MaybeGetter<string | number>;
  active?: MaybeGetter<boolean>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

function toSize(v: any): string | undefined {
  return v == null ? undefined : typeof v === 'number' ? v + 'px' : v;
}

/** 形状 -> 尺寸样式（与 React / Vue 端逐字对齐） */
function shapeStyleOf(shape: SkeletonShape, width: any, height: any): Record<string, any> {
  const s: Record<string, any> = {};
  const w = toSize(width);
  const h = toSize(height);
  if (shape === 'circle') {
    s.width = w ?? h ?? '40px';
    s.height = h ?? w ?? '40px';
    s.borderRadius = '50%';
  } else if (shape === 'text') {
    s.height = h ?? '14px';
    if (w) s.width = w;
  } else {
    if (w) s.width = w;
    if (h) s.height = h;
  }
  return s;
}

/**
 * Skeleton · 骨架（展示）
 * 形状 text/circle/rect；尺寸数字转 px；active 控制微光动画（data-active 标记）。
 */
export function Skeleton(props: SkeletonProps) {
  const shape = () => resolve(props.shape) ?? 'rect';
  const active = () => resolve(props.active) ?? true;
  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-skeleton', resolve(props.className))}
      role="presentation"
      data-active={active() ? 'true' : 'false'}
      style={mergeStyle(
        shapeStyleOf(shape(), resolve(props.width), resolve(props.height)),
        resolve(props.style),
      )}
    ></div>
  );
}
