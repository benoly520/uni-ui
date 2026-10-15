import { resolve, signal, effect } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  open?: MaybeGetter<boolean>;
  defaultOpen?: MaybeGetter<boolean>;
  onOpenChange?: (open: boolean) => void;
  title?: MaybeGetter<Renderable>;
  children?: MaybeGetter<Renderable>;
  footer?: MaybeGetter<Renderable>;
  placement?: MaybeGetter<DrawerPlacement>;
  closeOnOverlay?: MaybeGetter<boolean>;
  closeOnEsc?: MaybeGetter<boolean>;
  ariaLabel?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Drawer · 抽屉（浮层）
 * 侧边/上下滑出；受控/非受控；点击遮罩 / Esc 关闭；Tab 焦点循环；打开时聚焦首个可聚焦项。
 * 焦点逻辑改用 ref + effect，消除旧实现在文档上长期挂监听的泄漏。
 */
export function Drawer(props: DrawerProps) {
  const isControlled = () => resolve(props.open) != null;
  const inner = signal<boolean>(!!(resolve(props.defaultOpen) ?? false));
  const isOpen = () => (isControlled() ? !!resolve(props.open) : inner());
  const closeOnOverlay = () => resolve(props.closeOnOverlay) ?? true;
  const closeOnEsc = () => resolve(props.closeOnEsc) ?? true;
  const placement = () => resolve(props.placement) ?? 'right';
  const onOpenChange = props.onOpenChange;

  const setOpen = (v: boolean) => {
    if (!isControlled()) inner.set(v);
    onOpenChange?.(v);
  };

  let panelEl: HTMLElement | null = null;
  const refCb = (el: HTMLElement) => {
    panelEl = el;
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
    if (isOpen()) {
      requestAnimationFrame(() => {
        const f = panelEl?.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (f && f.length) f[0].focus();
      });
    }
  });

  const dialogLabel = () =>
    resolve(props.ariaLabel) ||
    (typeof resolve(props.title) === 'string' ? (resolve(props.title) as string) : '抽屉');

  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-overlay', isOpen() && 'show', resolve(props.className))}
      role="presentation"
      aria-hidden={!isOpen()}
      style={resolve(props.style)}
      onMouseDown={(e: MouseEvent) => {
        if (closeOnOverlay() && e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={refCb}
        class={cx('ui-drawer', 'ui-glass', 'ui-drawer--' + placement())}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel()}
      >
        {resolve(props.title) != null && <h3>{() => resolve(props.title)}</h3>}
        <div class="ui-drawer-body">{() => resolve(props.children)}</div>
        {resolve(props.footer) != null && (
          <div class="ui-drawer-foot">{() => resolve(props.footer)}</div>
        )}
      </div>
    </div>
  );
}
