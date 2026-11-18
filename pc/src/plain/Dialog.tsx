import { signal, effect } from 'plain';
import { cx } from './_shared';
import type { Renderable } from './_shared';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export interface DialogProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: Renderable;
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
  footer?: Renderable;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Dialog · 对话框（浮层）
 * 遮罩 + 毛玻璃面板；受控/非受控；点击遮罩 / Esc 关闭；Tab 焦点循环；打开时聚焦首个可聚焦项。
 * 焦点逻辑改用 ref 抓取遮罩 + effect，消除旧实现在文档上长期挂监听的泄漏。
 */
export function Dialog(props: DialogProps) {
  const isControlled = () => props.open != null;
  const inner = signal<boolean>(!!(props.defaultOpen ?? false));
  const isOpen = () => (isControlled() ? !!props.open : inner());
  const closeOnOverlay = () => props.closeOnOverlay ?? true;
  const closeOnEsc = () => props.closeOnEsc ?? true;
  const onOpenChange = props.onOpenChange;

  const setOpen = (v: boolean) => {
    if (!isControlled()) inner.set(v);
    onOpenChange?.(v);
  };

  let overlayEl: HTMLElement | null = null;

  /** 同步 inert / aria-hidden：关闭时把整块遮罩移出无障碍树与 Tab 序列（与 React / Vue 端一致） */
  const applyInert = () => {
    const el = overlayEl;
    if (!el) return;
    if (isOpen()) {
      el.removeAttribute('inert');
      el.setAttribute('aria-hidden', 'false');
    } else {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }
  };

  const refCb = (el: HTMLElement) => {
    overlayEl = el;
    applyInert();
    const onKey = (e: KeyboardEvent) => {
      if (closeOnEsc() && e.key === 'Escape' && isOpen()) {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const f = el.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  };

  let lastFocus: HTMLElement | null = null;
  effect(() => {
    const open = isOpen();
    applyInert();
    if (open) {
      // 记录打开前的焦点元素，关闭时归还（契约 dialog.behavior.md:26）
      lastFocus = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        const f = overlayEl?.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (f && f.length) f[0].focus();
      });
    } else {
      lastFocus?.focus?.();
      lastFocus = null;
    }
  });

  const dialogLabel = () =>
    props.ariaLabel ||
    (typeof props.title === 'string' ? (props.title as string) : '对话框');

  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      ref={refCb}
      class={cx('ui-overlay', isOpen() && 'show')}
      role="presentation"
      aria-hidden={!isOpen()}
      onMouseDown={(e: MouseEvent) => {
        if (closeOnOverlay() && e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        // 契约 dialog.api.md：className / style 透传到 .ui-dialog 面板（而非遮罩）
        class={cx('ui-dialog', 'ui-glass', props.className)}
        style={props.style}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel()}
      >
        {props.title != null && <h3>{props.title}</h3>}
        <div>{props.children?.()}</div>
        {props.footer != null && (
          <div class="ui-dialog-actions">{props.footer}</div>
        )}
      </div>
    </div>
  );
}
