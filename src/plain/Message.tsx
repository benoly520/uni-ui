import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type MessageType = 'success' | 'warning' | 'info' | 'danger';

export interface MessageProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: MaybeGetter<boolean>;
  /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
  show?: MaybeGetter<boolean>;
  /** 类型，左 .dot 用语义色 token */
  type?: MaybeGetter<MessageType>;
  /** 通知正文 */
  content?: MaybeGetter<Renderable>;
  /** 直接传复杂节点，覆盖 content */
  children?: MaybeGetter<Renderable>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Message · 内联通知条（反馈组）
 * 根 ui-message + ui-message--{type}；role=status aria-live=polite。
 * 固定结构：.dot（语义色圆点）+ .msg-text（正文）。
 * 命令式入口见 message.ts（挂 body）。
 */
export function Message(props: MessageProps) {
  const show = () => resolve(props.show) ?? false;
  const type = () => resolve(props.type) ?? 'info';
  return (
    <div
      data-glass={resolve(props.glass) === false ? 'off' : undefined}
      id={resolve(props.id)}
      class={cx('ui-message', 'ui-message--' + type(), show() && 'show', resolve(props.className))}
      role="status"
      aria-live="polite"
      style={resolve(props.style)}
    >
      <span class="dot" />
      <span class="msg-text">{resolve(props.children) ?? resolve(props.content)}</span>
    </div>
  );
}
