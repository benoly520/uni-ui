import React, {
  forwardRef,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type DrawerSide = 'right' | 'left' | 'bottom';

export interface DrawerProps {
  /** 受控打开状态 */
  open: boolean;
  /** 打开/关闭回调 */
  onOpenChange?: (open: boolean) => void;
  /** 滑出方向：right（默认）/ left / bottom */
  side?: DrawerSide;
  /** 标题 */
  title?: ReactNode;
  /** 副标题（位于标题下方 .ui-label） */
  subtitle?: ReactNode;
  /** 是否显示关闭按钮（header 内） */
  showClose?: boolean;
  /** 无障碍标签（默认取 title 或 '抽屉'） */
  ariaLabel?: string;
  /** 点击遮罩是否关闭 */
  closeOnOverlay?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 主体内容 */
  children?: ReactNode;
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Drawer · 侧滑抽屉（浮层导航组）
 * - 方向 right/left/bottom（默认 right）；焦点陷阱 + Esc + 遮罩关闭（与 Dialog 同标准）
 * - role=dialog aria-modal=true；受控 open + onOpenChange
 * - 不携带样式，全部走 theme.css
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open,
    onOpenChange,
    side = 'right',
    title,
    subtitle,
    showClose = true,
    ariaLabel,
    closeOnOverlay = true,
    className,
    style,
    children,
  },
  ref,
) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const focusables = () =>
    Array.from(
      overlayRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    ).filter((el) => !el.hasAttribute('disabled'));

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      overlay.removeAttribute('inert');
      overlay.setAttribute('aria-hidden', 'false');
      const id = requestAnimationFrame(() => {
        const f = focusables();
        (f[0] ?? overlay).focus();
      });
      return () => cancelAnimationFrame(id);
    } else {
      overlay.setAttribute('inert', '');
      overlay.setAttribute('aria-hidden', 'true');
      lastFocus.current?.focus?.();
    }
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const f = focusables();
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

  const onOverlayClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && e.target === overlayRef.current) onOpenChange?.(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  return (
    <div
      ref={(node) => {
        (overlayRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cx('ui-drawer-overlay', open && 'show')}
      role="presentation"
      aria-hidden={open ? undefined : true}
      onMouseDown={onOverlayClick}
      onKeyDown={onKeyDown}
    >
      <aside
        className={cx('ui-drawer', 'ui-glass', side !== 'right' && `ui-drawer--${side}`, className)}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (typeof title === 'string' ? title : '抽屉')}
      >
        {(title != null || showClose) && (
          <header>
            <div>
              {title != null && <div className="ui-drawer-title">{title}</div>}
              {subtitle != null && <div className="ui-label">{subtitle}</div>}
            </div>
            {showClose && (
              <button
                className="ui-btn ui-btn--ghost ui-size-sm"
                aria-label="关闭"
                type="button"
                onClick={() => onOpenChange?.(false)}
              >
                ✕
              </button>
            )}
          </header>
        )}
        <div className="body">{children}</div>
      </aside>
    </div>
  );
});
