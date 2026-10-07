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

export interface DialogProps {
  /** 受控打开状态 */
  open: boolean;
  /** 打开/关闭回调（Esc/遮罩/动作均可触发） */
  onOpenChange?: (open: boolean) => void;
  /** 标题，渲染为面板内 <h3>，并作默认 aria-label */
  title?: ReactNode;
  /** 底部操作区（按钮组） */
  footer?: ReactNode;
  /** 无障碍标签（默认取 title 或 '对话框'） */
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
 * Dialog · 模态对话框（浮层导航组）
 * - 焦点陷阱：打开聚焦首项、Tab/Shift+Tab 循环、Esc 关闭、点遮罩关闭、关闭恢复触发焦点
 * - role=dialog + aria-modal=true；受控 open + onOpenChange
 * - 不携带样式，全部走 theme.css
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    open,
    onOpenChange,
    title,
    footer,
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
      className={cx('ui-overlay', open && 'show')}
      role="presentation"
      aria-hidden={open ? undefined : true}
      onMouseDown={onOverlayClick}
      onKeyDown={onKeyDown}
    >
      <div
        className={cx('ui-dialog', 'ui-glass', className)}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (typeof title === 'string' ? title : '对话框')}
      >
        {title != null && <h3>{title}</h3>}
        {children}
        {footer != null && <div className="ui-dialog-actions">{footer}</div>}
      </div>
    </div>
  );
});
