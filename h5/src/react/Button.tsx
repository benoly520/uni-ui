import React, {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> {
  /** 语义变体，默认 primary */
  variant?: ButtonVariant;
  /** 尺寸，默认 medium */
  size?: ButtonSize;
  /** 通栏（占满父容器宽度） */
  block?: boolean;
  /** 胶囊形状 */
  round?: boolean;
  /** 加载态：展示 spinner、禁用点击并设置 aria-busy */
  loading?: boolean;
  /** 表单语义：button / submit / reset */
  type?: 'button' | 'submit' | 'reset';
  /** 图标节点（任意 1em 尺寸、currentColor 的 SVG），置于文本前 */
  icon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

/**
 * Button · 移动端按钮
 * - 变体 primary / secondary / outline / ghost / danger，尺寸 large / medium / small
 * - block 通栏、round 胶囊；loading 展示 spinner 且禁用点击
 * - 纯声明式，无运行时依赖；样式由 theme.css 提供
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'medium',
    block = false,
    round = false,
    loading = false,
    disabled = false,
    type = 'button',
    icon,
    onClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'h5-btn',
        `h5-btn--${variant}`,
        size !== 'medium' && `h5-btn--${size}`,
        block && 'h5-btn--block',
        round && 'h5-btn--round',
        loading && 'h5-btn--loading',
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      {loading ? (
        <span className="h5-btn__spinner" aria-hidden="true" />
      ) : (
        icon != null && <span className="h5-btn__icon">{icon}</span>
      )}
      {children}
    </button>
  );
});
