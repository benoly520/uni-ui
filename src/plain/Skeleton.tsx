import { cx, mergeStyle } from './_shared';

export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  active?: boolean;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
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
  const shape = () => props.shape ?? 'rect';
  const active = () => props.active ?? true;
  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-skeleton', props.className)}
      role="presentation"
      data-active={active() ? 'true' : 'false'}
      style={mergeStyle(
        shapeStyleOf(shape(), props.width, props.height),
        props.style,
      )}
    ></div>
  );
}
