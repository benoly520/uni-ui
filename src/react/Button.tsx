import React, {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type ButtonVariant = 'primary' | 'default' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'lg' | 'md' | 'xs' | 'sm';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> {
  /** 语义变体（颜色语义） */
  variant?: ButtonVariant;
  /** 尺寸 Scale（全局修饰，md 默认无类） */
  size?: ButtonSize;
  /** 胶囊形状，与语义正交，可叠加任意变体 */
  pill?: boolean;
  /** 文字透明 + spinner，pointer-events:none，aria-busy */
  loading?: boolean;
  /** 表单语义：button / submit / reset */
  type?: 'button' | 'submit' | 'reset';
  /** 图标插槽：任意 24×24 + currentColor 节点，置于文本前 */
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Button · 毛玻璃按钮（基础输入组）
 * - 变体 primary/default/ghost/outline/danger；形状 pill；尺寸 ui-size-*
 * - loading 设 aria-busy、禁用点击；disabled 原生禁用
 * - 图标节点包入 .ui-icon（见 icon.md）；纯声明式，无独立 init JS
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'default',
    size = 'md',
    pill = false,
    loading = false,
    disabled = false,
    type = 'button',
    icon,
    onClick,
    className,
    style,
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
        'ui-btn',
        `ui-btn--${variant}`,
        size !== 'md' && `ui-size-${size}`,
        pill && 'ui-btn--pill',
        loading && 'ui-btn--loading',
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={isDisabled ? undefined : onClick}
      style={style}
      {...rest}
    >
      {icon != null && <span className="ui-icon">{icon}</span>}
      {children}
    </button>
  );
});
