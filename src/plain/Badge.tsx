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
  [key: string]: any;
}

/**
 * Badge · 徽标（基础）
 * count 超过 max 截断为 `max+`；dot 渲染状态圆点；count 为 0 且非 showZero 返回空片段。
 */
export function Badge(props: BadgeProps) {
  const {
    tone = 'brand',
    dot = false,
    count,
    max = 99,
    showZero = false,
    children,
    className,
    style,
    ...rest
  } = props;
  const c = resolve(count);
  if (c != null && c === 0 && !resolve(showZero)) return document.createDocumentFragment();
  const maxVal = resolve(max) ?? 99;
  const st = resolve(style);
  const content =
    c != null ? (c > maxVal ? maxVal + '+' : '' + c) : resolve(children);
  return (
    <span
      {...rest}
      class={cx('ui-badge', resolve(className))}
      style={{
        background: 'var(--ui-color-' + resolve(tone) + '-soft)',
        color: 'var(--ui-color-' + resolve(tone) + ')',
        ...(st && typeof st === 'object' ? st : {}),
      }}
    >
      {resolve(dot) && <span class="ui-badge-dot"></span>}
      {content}
    </span>
  );
}
