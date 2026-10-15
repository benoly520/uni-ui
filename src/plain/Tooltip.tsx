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
}

let tipSeq = 0;

/**
 * Tooltip · 悬浮提示（浮层导航组）
 * 默认 invert 反转色；hover / focus 显示；Esc 关闭并归还焦点；外部点击关闭。
 * ARIA：气泡 role=tooltip + id；触发元素 aria-describedby 指向该 id。
 * 焦点跟随改用 ref 注入 focusin/focusout（新框架无 onFocusIn/Out），并回收监听。
 */
export function Tooltip(props: TooltipProps) {
  const variant = () => resolve(props.variant) ?? 'invert';
  const placement = () => resolve(props.placement) ?? 'top';
  const isControlled = () => resolve(props.open) != null;
  const inner = signal<boolean>(!!(resolve(props.defaultOpen) ?? false));
  const shown = () => (isControlled() ? !!resolve(props.open) : inner());
  const delay = () => resolve(props.delay) ?? 0;
  const disabled = () => resolve(props.disabled) ?? false;
  const tipId = props.id || 'tip-' + ++tipSeq;

  const setOpen = (v: boolean) => {
    if (disabled()) return;
    if (!isControlled()) inner.set(v);
    props.onOpenChange?.(v);
  };
  let showTimer: number | undefined;
  let hideTimer: number | undefined;
  const clearTimers = () => {
    if (showTimer) window.clearTimeout(showTimer);
    if (hideTimer) window.clearTimeout(hideTimer);
  };
  const show = () => {
    if (disabled()) return;
    clearTimers();
    showTimer = window.setTimeout(() => setOpen(true), Number(delay()));
  };
  const hide = () => {
    clearTimers();
    hideTimer = window.setTimeout(() => setOpen(false), 120);
  };

  let rootEl: HTMLElement | null = null;
  const refCb = (el: HTMLElement) => {
    rootEl = el;
    const trigger = el.firstElementChild as HTMLElement | null;
    if (trigger) {
      trigger.setAttribute('aria-describedby', tipId);
      const onFocusIn = () => show();
      const onFocusOut = (e: FocusEvent) => {
        if (el.contains(e.relatedTarget as Node)) return;
        hide();
      };
      el.addEventListener('focusin', onFocusIn);
      el.addEventListener('focusout', onFocusOut);
      return () => {
        el.removeEventListener('focusin', onFocusIn);
        el.removeEventListener('focusout', onFocusOut);
        rootEl = null;
      };
    }
    return () => {
      rootEl = null;
    };
  };

  return (
    <span
      class={cx(
        'ui-tip',
        variant() === 'surface' && 'ui-tip--surface',
        placement() !== 'top' && 'ui-tip--' + placement(),
        shown() && 'is-open',
      )}
      style={resolve(props.style)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape' && shown()) {
          setOpen(false);
          (rootEl?.firstElementChild as HTMLElement | null)?.focus?.();
        }
      }}
      ref={refCb}
    >
      {resolve(props.children)}
      <span class="bubble" role="tooltip" id={tipId} aria-hidden={!shown()}>
        {resolve(props.content)}
      </span>
    </span>
  );
}
