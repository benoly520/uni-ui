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
  [key: string]: any;
}

/**
 * Toast · 轻提示（反馈组）
 * - 根 ui-toast + ui-glass 毛玻璃；role=status aria-live=polite
 * - icon 包入 .ui-icon；content 为文本/节点，children 可覆盖
 * - 命令式入口见 toast.ts（挂 body）
 */
export function Toast(props: ToastProps) {
  const {
    show = false,
    content,
    icon,
    children,
    className,
    style,
    ...rest
  } = props;
  return (
    <div
      {...rest}
      class={cx('ui-toast', 'ui-glass', resolve(show) && 'ui-toast.show', resolve(className))}
      role="status"
      aria-live="polite"
      style={resolve(style)}
    >
      {resolve(icon) != null && (
        <span class="ui-icon">{() => resolve(icon)}</span>
      )}
      {() => (resolve(children) ?? resolve(content))}
    </div>
  );
}
