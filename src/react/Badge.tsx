import React, {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type BadgeTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';

export interface BadgeProps {
  /** 语义色（token 驱动，无硬色值） */
  tone?: BadgeTone;
  /** 前置状态圆点 */
  dot?: boolean;
  /** 计数值；配合 max 截断为 99+ */
  count?: number;
  /** 截断阈值 */
  max?: number;
  /** count===0 时是否仍渲染 */
  showZero?: boolean;
  /** 徽标文本/标签 */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Badge · 标记 / 计数徽标（基础输入组）
 * - tone 经内联 style 写 --ui-color-*（soft 作底、主色作字），无硬色值
 * - dot 前置 currentColor 圆点；count 覆盖文本并支持 max 截断
 * - 不携带样式，全部走 theme.css
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    tone = 'brand',
    dot = false,
    count,
    max = 99,
    showZero = false,
    children,
    className,
    style,
  },
  ref,
) {
  if (count != null && count === 0 && !showZero) return null;

  const toneStyle: CSSProperties = {
    background: `var(--ui-color-${tone}-soft, var(--ui-color-brand-soft))`,
    color: `var(--ui-color-${tone}, var(--ui-color-brand))`,
  };

  const content: ReactNode =
    count != null ? (count > max ? `${max}+` : `${count}`) : children;

  return (
    <span
      ref={ref}
      className={cx('ui-badge', className)}
      style={{ ...toneStyle, ...style }}
    >
      {dot && (
        <span
          className="ui-badge-dot"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'currentColor',
            flex: 'none',
          }}
        />
      )}
      {content}
    </span>
  );
});
