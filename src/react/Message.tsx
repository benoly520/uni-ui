import React, {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type MessageType = 'success' | 'warning' | 'info' | 'danger';

export interface MessageProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
  show?: boolean;
  /** 类型，左 .dot 用语义色 token */
  type?: MessageType;
  /** 通知正文 */
  content?: ReactNode;
  /** 直接传复杂节点，覆盖 content */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Message · 内联通知条（反馈组）
 * - 根 ui-message + ui-message--{type}；role=status aria-live=polite
 * - 固定结构：.dot（语义色圆点）+ .msg-text（正文）
 * - 命令式入口见 message.ts（createRoot 挂 body）
 */
export const Message = forwardRef<HTMLDivElement, MessageProps>(function Message(
  { glass, show = false, type = 'info', content, children, className, style },
  ref,
) {
  return (
    <div
      data-glass={glass === false ? 'off' : undefined}
      ref={ref}
      // 同 Toast：可见态加独立的 `show` 类（`.ui-message.show`），不能写成 'ui-message.show'
      className={cx('ui-message', `ui-message--${type}`, show && 'show', className)}
      role="status"
      aria-live="polite"
      style={style}
    >
      <span className="dot" />
      <span className="msg-text">{children ?? content}</span>
    </div>
  );
});
