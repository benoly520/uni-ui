import { resolve } from 'plain';
import { cx, mergeStyle } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type AvatarTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | number;

export interface AvatarProps {
  src?: MaybeGetter<string>;
  alt?: MaybeGetter<string>;
  text?: MaybeGetter<string>;
  icon?: Renderable | (() => Renderable);
  size?: MaybeGetter<AvatarSize>;
  tone?: MaybeGetter<AvatarTone>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  'aria-label'?: MaybeGetter<string>;
  id?: MaybeGetter<string>;
}

const SIZE_PX: Record<string, number> = { xs: 24, sm: 28, md: 32, lg: 40 };

/**
 * Avatar · 头像（基础）
 * 来源优先级 src > icon > text；尺寸 xs/sm/md/lg 或数字像素，文字字号按比例缩放。
 */
export function Avatar(props: AvatarProps) {
  const tone = () => resolve(props.tone) ?? 'brand';
  const sizePx = () => {
    const sz = resolve(props.size) ?? 'md';
    return typeof sz === 'number' ? sz : SIZE_PX[sz] ?? 32;
  };
  return (
    <span
      id={resolve(props.id)}
      class={cx('ui-avatar', resolve(props.className))}
      aria-label={resolve(props['aria-label'])}
      style={mergeStyle(
        {
          width: sizePx() + 'px',
          height: sizePx() + 'px',
          fontSize: Math.round(sizePx() * 0.4) + 'px',
          background: 'var(--ui-color-' + tone() + ')',
        },
        resolve(props.style),
      )}
    >
      {resolve(props.src) ? (
        <img
          class="ui-avatar-img"
          src={resolve(props.src)}
          alt={resolve(props.alt) ?? ''}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <>
          {resolve(props.icon) != null && <span class="ui-icon">{resolve(props.icon)}</span>}
          {resolve(props.text) != null &&
            document.createTextNode(String(resolve(props.text)))}
        </>
      )}
    </span>
  );
}
