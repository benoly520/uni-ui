import { resolve } from 'plain';
import { cx } from './_shared';
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
  [key: string]: any;
}

const SIZE_PX: Record<string, number> = { xs: 24, sm: 28, md: 32, lg: 40 };

/**
 * Avatar · 头像（基础）
 * 来源优先级 src > icon > text；尺寸 xs/sm/md/lg 或数字像素，文字字号按比例缩放。
 */
export function Avatar(props: AvatarProps) {
  const {
    src,
    alt = '',
    text,
    icon,
    size = 'md',
    tone = 'brand',
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const sz = resolve(size);
  const px = typeof sz === 'number' ? sz : SIZE_PX[sz] ?? 32;
  const s = resolve(src);
  return (
    <span
      {...rest}
      class={cx('ui-avatar', resolve(className))}
      aria-label={resolve(ariaLabel)}
      style={() => {
        const base: any = {
          width: px + 'px',
          height: px + 'px',
          fontSize: Math.round(px * 0.4) + 'px',
          background: 'var(--ui-color-' + resolve(tone) + ')',
        };
        const extra = resolve(style);
        return { ...base, ...(typeof extra === 'string' ? {} : extra || {}) };
      }}
    >
      {s ? (
        <img class="ui-avatar-img" src={s} alt={resolve(alt)} />
      ) : (
        <>
          {resolve(icon) != null && <span class="ui-icon">{resolve(icon)}</span>}
          {resolve(text) != null && document.createTextNode(String(resolve(text)))}
        </>
      )}
    </span>
  );
}
