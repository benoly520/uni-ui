import React, {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type AvatarTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | number;

const SIZE_PX: Record<'xs' | 'sm' | 'md' | 'lg', number> = {
  xs: 24,
  sm: 28,
  md: 32,
  lg: 40,
};

function pxOf(size: AvatarSize): number {
  if (typeof size === 'number') return size;
  return SIZE_PX[size] ?? 32;
}

export interface AvatarProps {
  /** 图片头像（优先）；存在时忽略 text / icon */
  src?: string;
  /** 图片替代文本（无障碍） */
  alt?: string;
  /** 文字头像（首字母/文字） */
  text?: string;
  /** 图标头像节点（24×24 + currentColor） */
  icon?: ReactNode;
  /** 尺寸：预设档或自定义像素 */
  size?: AvatarSize;
  /** 文字/图标头像底色（token 驱动） */
  tone?: AvatarTone;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

/**
 * Avatar · 头像（基础输入组）
 * - 三种源：图片(src) > 图标(icon) > 文字(text)
 * - 尺寸经内联 style 写 width/height/font-size（预览实证），不派生尺寸 class
 * - 不携带样式，全部走 theme.css
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    text,
    icon,
    size = 'md',
    tone = 'brand',
    className,
    style,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const px = pxOf(size);
  const fs = Math.round(px * 0.4);
  const rootStyle: CSSProperties = {
    width: `${px}px`,
    height: `${px}px`,
    fontSize: `${fs}px`,
    background: `var(--ui-color-${tone})`,
    ...style,
  };

  if (src) {
    return (
      <span ref={ref} className={cx('ui-avatar', className)} style={rootStyle} aria-label={ariaLabel}>
        <img
          className="ui-avatar-img"
          src={src}
          alt={alt ?? ''}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      </span>
    );
  }

  return (
    <span ref={ref} className={cx('ui-avatar', className)} style={rootStyle} aria-label={ariaLabel}>
      {icon != null && <span className="ui-icon">{icon}</span>}
      {text}
    </span>
  );
});
