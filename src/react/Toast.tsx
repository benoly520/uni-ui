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
      // 注意：可见态必须加**独立的** `show` 类（CSS 选择器是 `.ui-toast.show`）。
      // 写成 `'ui-toast.show'` 会变成单个带点的类名，永远匹配不上 -> 元素 opacity:0 不可见。
      className={cx('ui-toast', 'ui-glass', show && 'show', className)}
      role="status"
      aria-live="polite"
      style={style}
    >
      {icon != null && <span className="ui-icon">{icon}</span>}
      {children ?? content}
    </div>
  );
});
