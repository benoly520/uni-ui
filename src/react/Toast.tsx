import React, {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export interface ToastProps {
  /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
  show?: boolean;
  /** 轻提示正文 */
  content?: ReactNode;
  /** 前置图标插槽（24×24 + currentColor），如 ✓ Avatar */
  icon?: ReactNode;
  /** 直接传复杂节点（图标 + 文本混排），覆盖 content */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Toast · 轻提示（反馈组）
 * - 根 ui-toast + ui-glass 毛玻璃；role=status aria-live=polite
 * - icon 包入 .ui-icon；content 为文本/节点，children 可覆盖
 * - 命令式入口见 toast.ts（createRoot 挂 body）
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { show = false, content, icon, children, className, style },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('ui-toast', 'ui-glass', show && 'ui-toast.show', className)}
      role="status"
      aria-live="polite"
      style={style}
    >
      {icon != null && <span className="ui-icon">{icon}</span>}
      {children ?? content}
    </div>
  );
});
