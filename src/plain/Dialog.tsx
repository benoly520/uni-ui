import { resolve, signal, effect } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export interface DialogProps {
  open?: MaybeGetter<boolean>;
  defaultOpen?: MaybeGetter<boolean>;
  onOpenChange?: (open: boolean) => void;
  title?: MaybeGetter<Renderable>;
  children?: MaybeGetter<Renderable>;
  footer?: MaybeGetter<Renderable>;
  closeOnOverlay?: MaybeGetter<boolean>;
  closeOnEsc?: MaybeGetter<boolean>;
  ariaLabel?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Dialog · 对话框（浮层）
 * 遮罩 + 毛玻璃面板；受控/非受控；点击遮罩 / Esc 关闭；Tab 焦点循环；打开时聚焦首个可聚焦项。
 * 焦点逻辑改用 ref 抓取遮罩 + effect，消除旧实现在文档上长期挂监听的泄漏。
 */
export function Dialog(props: DialogProps) {
  const isControlled = () => resolve(props.open) != null;
  const inner = signal<boolean>(!!(resolve(props.defaultOpen) ?? false));
  const isOpen = () => (isControlled() ? !!resolve(props.open) : inner());
  const closeOnOverlay = () => resolve(props.closeOnOverlay) ?? true;
  const closeOnEsc = () => resolve(props.closeOnEsc) ?? true;
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

  effect(() => {
    const open = isOpen();
    applyInert();
    if (open) {
      requestAnimationFrame(() => {
        const f = overlayEl?.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (f && f.length) f[0].focus();
      });
    }
  });

  const dialogLabel = () =>
    resolve(props.ariaLabel) ||
    (typeof resolve(props.title) === 'string' ? (resolve(props.title) as string) : '对话框');

  return (
    <div
      id={resolve(props.id)}
      ref={refCb}
      class={cx('ui-overlay', isOpen() && 'show', resolve(props.className))}
      role="presentation"
      aria-hidden={!isOpen()}
      style={resolve(props.style)}
      onMouseDown={(e: MouseEvent) => {
        if (closeOnOverlay() && e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        class="ui-dialog ui-glass"
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel()}
      >
        {resolve(props.title) != null && <h3>{resolve(props.title)}</h3>}
        <div>{resolve(props.children)}</div>
        {resolve(props.footer) != null && (
          <div class="ui-dialog-actions">{resolve(props.footer)}</div>
        )}
      </div>
    </div>
  );
}
