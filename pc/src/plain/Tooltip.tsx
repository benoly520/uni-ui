import { signal, effect } from 'plain';
import { cx } from './_shared';
import type { Renderable } from './_shared';

export type TooltipVariant = 'invert' | 'surface';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  /** 气泡内容（文本或任意节点） */
  content: Renderable;
  /** surface=跟随主题表面 + 毛玻璃（默认）；invert=反转色（浅色黑泡 / 暗色白泡） */
  variant?: TooltipVariant;
  /** 气泡方位 */
  placement?: TooltipPlacement;
  /** 受控显示 */
  open?: boolean;
  /** 非受控初始显示 */
  defaultOpen?: boolean;
  /** 显隐变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 显示延迟（ms） */
  delay?: number;
  /** 禁用提示 */
  disabled?: boolean;
  /** 气泡 id（默认自动生成，用于 aria-describedby） */
  id?: string;
  className?: string;
  style?: string | Record<string, string>;
  /** 触发元素（建议可聚焦节点，如 button） */
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
}

let tipSeq = 0;

/**
 * Tooltip · 悬浮提示（浮层导航组）
 * 默认 surface 跟随主题表面（毛玻璃，可被全站 data-glass="off" 回退为实心面）；
 * variant="invert" 可切回反转色（macOS 浮层惯例）。hover / focus 显示；Esc 关闭并归还焦点。
 * ARIA：气泡 role=tooltip + id；触发元素 aria-describedby 指向该 id。
 * 焦点跟随改用 ref 注入 focusin/focusout（新框架无 onFocusIn/Out），并回收监听。
 */
export function Tooltip(props: TooltipProps) {
  const variant = () => props.variant ?? 'surface';
  const placement = () => props.placement ?? 'top';
  const isControlled = () => props.open != null;
  const inner = signal<boolean>(!!(props.defaultOpen ?? false));
  const shown = () => (isControlled() ? !!props.open : inner());
  const delay = () => props.delay ?? 0;
  const disabled = () => props.disabled ?? false;
  const defaultTipId = 'tip-' + ++tipSeq;
  /** 优先读取传入 ID，缺省时使用实例级稳定 ID。 */
  const tipId = () => props.id || defaultTipId;

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
  let detach: (() => void) | null = null;
  const refCb = (el: HTMLElement) => {
    rootEl = el;
    const trigger = el.firstElementChild as HTMLElement | null;
    // 契约 tooltip.behavior.md：disabled 时整条交互链路不挂载
    //（不写 aria-describedby、不绑 focusin/focusout）。effect 让 disabled 变化时自动重建绑定。
    effect(() => {
      const off = disabled();
      if (detach) {
        detach();
        detach = null;
      }
      if (off || !trigger) return;
      trigger.setAttribute('aria-describedby', tipId());
      const onFocusIn = () => show();
      const onFocusOut = (e: FocusEvent) => {
        if (el.contains(e.relatedTarget as Node)) return;
        hide();
      };
      el.addEventListener('focusin', onFocusIn);
      el.addEventListener('focusout', onFocusOut);
      detach = () => {
        trigger.removeAttribute('aria-describedby');
        el.removeEventListener('focusin', onFocusIn);
        el.removeEventListener('focusout', onFocusOut);
        rootEl = null;
      };
    });
    return () => {
      if (detach) {
        detach();
        detach = null;
      }
      rootEl = null;
    };
  };

  return (
    <span
      data-glass={props.glass === false ? 'off' : undefined}
      class={cx(
        'ui-tip',
        variant() === 'surface' && 'ui-tip--surface',
        placement() !== 'top' && 'ui-tip--' + placement(),
        shown() && 'is-open',
        // 契约 tooltip.api.md：className 透传到根 span（此前漏接，导致外部布局类失效）
        props.className,
      )}
      style={props.style}
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
      {props.children?.()}
      <span class="bubble" role="tooltip" id={tipId()} aria-hidden={!shown()}>
        {props.content}
      </span>
    </span>
  );
}
