import { cx } from './_shared';
import type { Renderable } from './_shared';

export interface ToastProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
  show?: boolean;
  /** 轻提示正文 */
  content?: Renderable;
  /** 前置图标插槽（24×24 + currentColor），如 ✓ Avatar */
  icon?: Renderable;
  /** 直接传复杂节点（图标 + 文本混排），覆盖 content */
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Toast · 轻提示（反馈组）
 * 根 ui-toast + ui-glass 毛玻璃；role=status aria-live=polite。
 * icon 包入 .ui-icon；content 为文本/节点，children 可覆盖。
 * 命令式入口见 toast.ts（挂 body）。
 */
export function Toast(props: ToastProps) {
  const show = () => props.show ?? false;
  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      // 可见态加独立的 `show` 类（CSS 是 `.ui-toast.show`），写成 'ui-toast.show' 永远匹配不上
      class={cx('ui-toast', 'ui-glass', show() && 'show', props.className)}
      role="status"
      aria-live="polite"
      style={props.style}
    >
      {props.icon != null && (
        <span class="ui-icon">{props.icon}</span>
      )}
      {props.children?.() ?? props.content}
    </div>
  );
}
