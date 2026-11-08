import { cx, mergeStyle } from './_shared';
import type { Renderable } from './_shared';

export type AvatarTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | number;

export interface AvatarProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  src?: string;
  alt?: string;
  text?: string;
  icon?: Renderable;
  size?: AvatarSize;
  tone?: AvatarTone;
  className?: string;
  style?: string | Record<string, string>;
  'aria-label'?: string;
  id?: string;
}

const SIZE_PX: Record<string, number> = { xs: 24, sm: 28, md: 32, lg: 40 };

/**
 * Avatar · 头像（基础）
 * 来源优先级 src > icon > text；尺寸 xs/sm/md/lg 或数字像素，文字字号按比例缩放。
 */
export function Avatar(props: AvatarProps) {
  const tone = () => props.tone ?? 'brand';
  const sizePx = () => {
    const sz = props.size ?? 'md';
    return typeof sz === 'number' ? sz : SIZE_PX[sz] ?? 32;
  };
  return (
    <span
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-avatar', props.className)}
      aria-label={props['aria-label']}
      style={mergeStyle(
        {
          width: sizePx() + 'px',
          height: sizePx() + 'px',
          fontSize: Math.round(sizePx() * 0.4) + 'px',
          background: 'var(--ui-color-' + tone() + ')',
        },
        props.style,
      )}
    >
      {props.src ? (
        <img
          class="ui-avatar-img"
          src={props.src}
          alt={props.alt ?? ''}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <>
          {props.icon != null && <span class="ui-icon">{props.icon}</span>}
          {props.text != null &&
            document.createTextNode(String(props.text))}
        </>
      )}
    </span>
  );
}
