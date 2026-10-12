import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type TooltipVariant = 'invert' | 'surface';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** 气泡内容（文本或任意节点） */
  content: MaybeGetter<Renderable>;
  /** invert=反转色（默认）；surface=跟随主题表面 + 毛玻璃 */
  variant?: MaybeGetter<TooltipVariant>;
  /** 气泡方位 */
  placement?: MaybeGetter<TooltipPlacement>;
  /** 受控显示 */
  open?: MaybeGetter<boolean>;
  /** 非受控初始显示 */
  defaultOpen?: MaybeGetter<boolean>;
  /** 显隐变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 显示延迟（ms） */
  delay?: MaybeGetter<number>;
  /** 禁用提示 */
  disabled?: MaybeGetter<boolean>;
  /** 气泡 id（默认自动生成，用于 aria-describedby） */
  id?: string;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  /** 触发元素（建议可聚焦节点，如 button） */
  children?: MaybeGetter<Renderable>;
  [key: string]: any;
}

let tipSeq = 0;

/**
 * Tooltip · 悬浮提示（浮层导航组）
 * - 默认 invert 反转色；hover / focus 显示；Esc 关闭并归还焦点；外部点击关闭
 * - ARIA：气泡 role=tooltip + id；触发元素 aria-describedby 指向该 id
 * - 受控 / 非受控双模式；不携带任何样式，全部走 theme.css
 */
export function Tooltip(props: TooltipProps) {
  const {
    content,
    variant = 'invert',
    placement = 'top',
    open,
    defaultOpen = false,
    onOpenChange,
    delay = 0,
    disabled = false,
    id,
    className,
    style,
    children,
    ...rest
  } = props;

  const isControlled = open != null;
  const inner = signal<boolean>(!!resolve(defaultOpen));
  const shown = () => (isControlled ? !!resolve(open) : inner());
  const tipId = id || `tip-${++tipSeq}`;

  const setOpen = (v: boolean) => {
    if (resolve(disabled)) return;
    if (!isControlled) inner.set(v);
    onOpenChange?.(v);
  };

  let showTimer: number | undefined;
  let hideTimer: number | undefined;
  const clearTimers = () => {
    if (showTimer) window.clearTimeout(showTimer);
    if (hideTimer) window.clearTimeout(hideTimer);
  };
  const show = () => {
    if (resolve(disabled)) return;
    clearTimers();
    showTimer = window.setTimeout(() => setOpen(true), Number(resolve(delay)));
  };
  const hide = () => {
    clearTimers();
    hideTimer = window.setTimeout(() => setOpen(false), 120);
  };

  // 给触发元素注入 aria-describedby（容器挂载后触发元素才存在）
  requestAnimationFrame(() => {
    const root = document.getElementById(tipId)?.parentElement;
    const trigger = root?.firstElementChild as HTMLElement | null;
    if (trigger && !trigger.hasAttribute('aria-describedby')) {
      trigger.setAttribute('aria-describedby', tipId);
    }
  });

  return (
    <span
      {...rest}
      class={cx(
        'ui-tip',
        resolve(variant) === 'surface' && 'ui-tip--surface',
        resolve(placement) !== 'top' && `ui-tip--${resolve(placement)}`,
        shown() && 'is-open',
      )}
      style={resolve(style)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusIn={show}
      onFocusOut={(e: FocusEvent) => {
        if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
        hide();
      }}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape' && shown()) {
          setOpen(false);
          const t = document
            .getElementById(tipId)
            ?.parentElement?.firstElementChild as HTMLElement | null;
          t?.focus?.();
        }
      }}
    >
      {resolve(children)}
      <span class="bubble" role="tooltip" id={tipId} aria-hidden={!shown()}>
        {() => resolve(content)}
      </span>
    </span>
  );
}
