import { resolve } from 'plain';
import { cx, mergeStyle } from './_shared';
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
      style={mergeStyle(
        {
          background: 'var(--ui-color-' + tone() + '-soft, var(--ui-color-brand-soft))',
          color: 'var(--ui-color-' + tone() + ', var(--ui-color-brand))',
          display: hidden() ? 'none' : '',
        },
        resolve(props.style),
      )}
    >
      {dot() && (
        <span
          class="ui-badge-dot"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'currentColor',
            flex: 'none',
          }}
        ></span>
      )}
      {content()}
    </span>
  );
}
