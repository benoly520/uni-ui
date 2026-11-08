import { signal, effect } from 'plain';
import { cx } from './_shared';
import type { Renderable } from './_shared';

/** 焦点陷阱可聚焦选择器：与 React / Vue 端保持一致 */
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type DrawerSide = 'right' | 'left' | 'bottom';

/** @deprecated 旧命名，等价于 DrawerSide（保留以兼容已发布的类型引用） */
export type DrawerPlacement = DrawerSide;

export interface DrawerProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 滑出方向：right（默认）/ left / bottom */
  side?: DrawerSide;
  /** @deprecated 旧命名，等价于 side */
  placement?: DrawerSide;
  title?: Renderable;
  /** 副标题（位于标题下方 .ui-label） */
  subtitle?: Renderable;
  /** 是否显示右上角关闭按钮 */
  showClose?: boolean;
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Drawer · 抽屉（浮层）
 * 侧边/上下滑出；受控/非受控；点击遮罩 / Esc 关闭；Tab 焦点循环；关闭时置 inert。
 * DOM 结构与 React / Vue 端逐字对齐（.ui-drawer-overlay > aside.ui-drawer > header/.body）。
 */
export function Drawer(props: DrawerProps) {
  const isControlled = () => props.open != null;
  const inner = signal<boolean>(!!(props.defaultOpen ?? false));
  const isOpen = () => (isControlled() ? !!props.open : inner());
  const closeOnOverlay = () => props.closeOnOverlay ?? true;
  const closeOnEsc = () => props.closeOnEsc ?? true;
  const side = () => props.side ?? props.placement ?? 'right';
  const showClose = () => props.showClose ?? true;
  const onOpenChange = props.onOpenChange;

  const setOpen = (v: boolean) => {
    if (!isControlled()) inner.set(v);
    onOpenChange?.(v);
  };

  let overlayEl: HTMLElement | null = null;

  /** 同步 inert / aria-hidden：关闭时把整块遮罩移出无障碍树与 Tab 序列 */
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (closeOnEsc() && e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const el = overlayEl;
    if (!el) return;
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

  const refCb = (el: HTMLElement) => {
    overlayEl = el;
    el.addEventListener('keydown', onKeyDown);
    applyInert();
    return () => {
      el.removeEventListener('keydown', onKeyDown);
      overlayEl = null;
    };
  };

  // open 变化时同步 inert，并在打开时把焦点移入面板
  let lastFocus: HTMLElement | null = null;
  effect(() => {
    const open = isOpen();
    applyInert();
    if (!open) {
      // 关闭时归还焦点（契约 drawer.behavior.md:25）
      lastFocus?.focus?.();
      lastFocus = null;
      return;
    }
    lastFocus = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => {
      const el = overlayEl;
      if (!el) return;
      const f = el.querySelectorAll<HTMLElement>(FOCUSABLE);
      (f[0] ?? el).focus();
    });
  });

  const dialogLabel = () =>
    props.ariaLabel ||
    (typeof props.title === 'string' ? (props.title as string) : '抽屉');

  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      ref={refCb}
      class={cx('ui-drawer-overlay', isOpen() && 'show')}
      role="presentation"
      aria-hidden={!isOpen()}
      onMouseDown={(e: MouseEvent) => {
        if (closeOnOverlay() && e.target === e.currentTarget) setOpen(false);
      }}
    >
      <aside
        // 契约 drawer.api.md：className / style 透传到 .ui-drawer 面板（而非遮罩）
        class={cx(
          'ui-drawer',
          'ui-glass',
          side() !== 'right' && 'ui-drawer--' + side(),
          props.className,
        )}
        style={props.style}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel()}
      >
        {(props.title != null || showClose()) && (
          <header>
            <div>
              {props.title != null && (
                <div class="ui-drawer-title">{props.title}</div>
              )}
              {props.subtitle != null && (
                <div class="ui-label">{props.subtitle}</div>
              )}
            </div>
            {showClose() && (
              <button
                class="ui-btn ui-btn--ghost ui-size-sm"
                aria-label="关闭"
                type="button"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            )}
          </header>
        )}
        <div class="body">{props.children?.()}</div>
      </aside>
    </div>
  );
}
