import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  shape?: MaybeGetter<SkeletonShape>;
  width?: MaybeGetter<string | number>;
  height?: MaybeGetter<string | number>;
  active?: MaybeGetter<boolean>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

function toSize(v: any): string | undefined {
  return v == null ? undefined : typeof v === 'number' ? v + 'px' : v;
}

/**
 * Skeleton · 骨架（展示）
 * 形状 text/circle/rect；尺寸数字转 px；active 控制微光动画（data-active 标记）。
 */
export function Skeleton(props: SkeletonProps) {
  const { shape = 'rect', width, height, active = true, className, style, ...rest } = props;
  const activeAttr = () => (resolve(active) ? 'true' : 'false');
  return (
    <div
      {...rest}
      class={cx('ui-skeleton', resolve(className))}
      role="presentation"
      data-active={activeAttr()}
      style={() => {
        const shp = resolve(shape);
        const s: any = {};
        const w = toSize(resolve(width));
        const h = toSize(resolve(height));
        if (shp === 'circle') {
          s.width = w ?? h ?? '40px';
          s.height = h ?? w ?? '40px';
          s.borderRadius = '50%';
        } else if (shp === 'text') {
          if (!h) s.height = '14px';
          else s.height = h;
          if (w) s.width = w;
        } else {
          if (w) s.width = w;
          if (h) s.height = h;
        }
        const extra = resolve(style);
        return { ...s, ...(typeof extra === 'string' ? {} : extra || {}) };
      }}
    ></div>
  );
}
