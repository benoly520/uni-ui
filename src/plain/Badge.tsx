import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type BadgeTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';

export interface BadgeProps {
  tone?: MaybeGetter<BadgeTone>;
  dot?: MaybeGetter<boolean>;
  count?: MaybeGetter<number>;
  max?: MaybeGetter<number>;
  showZero?: MaybeGetter<boolean>;
  children?: Renderable | (() => Renderable);
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Badge · 徽标（基础）
 * count 超过 max 截断为 `max+`；dot 渲染状态圆点；count 为 0 且非 showZero 渲染空片段。
 */
export function Badge(props: BadgeProps) {
  const tone = () => resolve(props.tone) ?? 'brand';
  const dot = () => resolve(props.dot) ?? false;
  const maxVal = () => resolve(props.max) ?? 99;
  const showZero = () => resolve(props.showZero) ?? false;
  const countVal = () => resolve(props.count);
  const hidden = () => {
    const c = countVal();
    return c != null && c === 0 && !showZero();
  };
  const content = () => {
    const c = countVal();
    return c != null ? (c > maxVal() ? maxVal() + '+' : '' + c) : resolve(props.children);
  };
  return (
    <span
      id={resolve(props.id)}
      class={cx('ui-badge', resolve(props.className))}
      style={() => {
        const st = resolve(props.style);
        return {
          background: 'var(--ui-color-' + tone() + '-soft)',
          color: 'var(--ui-color-' + tone() + ')',
          ...(st && typeof st === 'object' ? st : {}),
          display: hidden() ? 'none' : '',
        };
      }}
    >
      {dot() && <span class="ui-badge-dot"></span>}
      {content()}
    </span>
  );
}
