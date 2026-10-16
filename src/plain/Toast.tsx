import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface ToastProps {
  /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
  show?: MaybeGetter<boolean>;
  /** 轻提示正文 */
  content?: MaybeGetter<Renderable>;
  /** 前置图标插槽（24×24 + currentColor），如 ✓ Avatar */
  icon?: MaybeGetter<Renderable>;
  /** 直接传复杂节点（图标 + 文本混排），覆盖 content */
  children?: MaybeGetter<Renderable>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Toast · 轻提示（反馈组）
 * 根 ui-toast + ui-glass 毛玻璃；role=status aria-live=polite。
 * icon 包入 .ui-icon；content 为文本/节点，children 可覆盖。
 * 命令式入口见 toast.ts（挂 body）。
 */
export function Toast(props: ToastProps) {
  const show = () => resolve(props.show) ?? false;
  return (
    <div
      id={resolve(props.id)}
      // 可见态加独立的 `show` 类（CSS 是 `.ui-toast.show`），写成 'ui-toast.show' 永远匹配不上
      class={cx('ui-toast', 'ui-glass', show() && 'show', resolve(props.className))}
      role="status"
      aria-live="polite"
      style={resolve(props.style)}
    >
      {resolve(props.icon) != null && (
        <span class="ui-icon">{resolve(props.icon)}</span>
      )}
      {resolve(props.children) ?? resolve(props.content)}
    </div>
  );
}
