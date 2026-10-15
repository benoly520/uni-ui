import { resolve, signal, effect } from 'plain';
import { cx, boolAttr } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface PopoverProps {
  /** 面板内容（可含可交互元素，如按钮） */
  content: MaybeGetter<Renderable>;
  /** 受控显示 */
  open?: MaybeGetter<boolean>;
  /** 非受控初始显示 */
  defaultOpen?: MaybeGetter<boolean>;
  /** 显隐回调 */
  onOpenChange?: (open: boolean) => void;
  /** 面板无障碍标签 */
  ariaLabel?: MaybeGetter<string>;
  /** 面板 id（默认自动生成，用于 aria-controls） */
  id?: string;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  /** 触发元素 */
  children?: MaybeGetter<Renderable>;
}

let popSeq = 0;

/**
 * Popover · 可交互悬浮资料卡（浮层导航组）
 * hover / focus 弹出；点击触发元素亦可切换；面板内按钮可点。
 * 外部点击 / Esc 关闭；受控 / 非受控双模式。
 * 焦点跟随改用 ref 注入 focusin/focusout（新框架无 onFocusIn/Out），并回收监听。
 */
export function Popover(props: PopoverProps) {
  const isControlled = () => resolve(props.open) != null;
  const inner = signal<boolean>(!!(resolve(props.defaultOpen) ?? false));
  const shown = () => (isControlled() ? !!resolve(props.open) : inner());
  const popId = props.id || 'pop-' + ++popSeq;
  const ariaLabel = () => resolve(props.ariaLabel) ?? 'Popover';

  const setOpen = (v: boolean) => {
    if (!isControlled()) inner.set(v);
    props.onOpenChange?.(v);
  };
  let hideTimer: number | undefined;
  const show = () => {
    if (hideTimer) window.clearTimeout(hideTimer);
    setOpen(true);
  };
  const hide = () => {
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => setOpen(false), 120);
  };

  let rootEl: HTMLElement | null = null;
  const refCb = (el: HTMLElement) => {
    rootEl = el;
    const trigger = el.firstElementChild as HTMLElement | null;
    if (trigger) {
      trigger.setAttribute('aria-controls', popId);
      // 初始态也要写 aria-expanded：下面的 effect 首次运行时 ref 可能还没绑定
      trigger.setAttribute('aria-expanded', shown() ? 'true' : 'false');
      const onClick = () => setOpen(!shown());
      const onFocusIn = () => show();
      const onFocusOut = (e: FocusEvent) => {
        if (el.contains(e.relatedTarget as Node)) return;
        hide();
      };
      trigger.addEventListener('click', onClick);
      el.addEventListener('focusin', onFocusIn);
      el.addEventListener('focusout', onFocusOut);
      return () => {
        trigger.removeEventListener('click', onClick);
        el.removeEventListener('focusin', onFocusIn);
        el.removeEventListener('focusout', onFocusOut);
        rootEl = null;
      };
    }
    return () => {
      rootEl = null;
    };
  };
  // open 变化后响应式同步触发元素的 aria-expanded
  effect(() => {
    const trigger = rootEl?.firstElementChild as HTMLElement | null;
    if (trigger) trigger.setAttribute('aria-expanded', shown() ? 'true' : 'false');
  });

  return (
    <div
      class={cx('ui-popover', resolve(props.className))}
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
      <div
        class="ui-popover-panel"
        id={popId}
        role="dialog"
        aria-label={ariaLabel()}
        hidden={boolAttr(!shown())}
      >
        {resolve(props.content)}
      </div>
    </div>
  );
}
