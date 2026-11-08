import { cx } from './_shared';
import type { Renderable } from './_shared';

export type MessageType = 'success' | 'warning' | 'info' | 'danger';

export interface MessageProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
  show?: boolean;
  /** 类型，左 .dot 用语义色 token */
  type?: MessageType;
  /** 通知正文 */
  content?: Renderable;
  /** 直接传复杂节点，覆盖 content */
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Message · 内联通知条（反馈组）
 * 根 ui-message + ui-message--{type}；role=status aria-live=polite。
 * 固定结构：.dot（语义色圆点）+ .msg-text（正文）。
 * 命令式入口见 message.ts（挂 body）。
 */
export function Message(props: MessageProps) {
  const show = () => props.show ?? false;
  const type = () => props.type ?? 'info';
  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-message', 'ui-message--' + type(), show() && 'show', props.className)}
      role="status"
      aria-live="polite"
      style={props.style}
    >
      <span class="dot" />
      <span class="msg-text">{props.children?.() ?? props.content}</span>
    </div>
  );
}
