import React, {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export interface PopoverProps {
  /** 面板内容（可含可交互元素，如按钮） */
  content: ReactNode;
  /** 受控显示 */
  open?: boolean;
  /** 非受控初始显示 */
  defaultOpen?: boolean;
  /** 显隐回调 */
  onOpenChange?: (open: boolean) => void;
  /** 面板无障碍标签 */
  ariaLabel?: string;
  /** 面板 id（默认自动生成，用于 aria-controls） */
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** 触发元素 */
  children?: ReactNode;
}

/**
 * Popover · 可交互悬浮资料卡（浮层导航组）
 * - hover / focus 弹出；面板内按钮可点（区别于 Tooltip 不可交互）
 * - 外部点击 / Esc 关闭；受控 / 非受控双模式
 * - 不携带样式，全部走 theme.css
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    content,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    ariaLabel = 'Popover',
    id,
    className,
    style,
    children,
  },
  ref,
) {
  const isControlled = openProp != null;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = isControlled ? (openProp as boolean) : innerOpen;
  const popId = id ?? useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const show = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setOpen(true);
  }, [setOpen]);

  const hide = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), 120);
  }, [setOpen]);

  const onRootEnter = () => show();
  const onRootLeave = () => hide();
  const onFocusIn = () => show();
  const onFocusOut = (e: ReactFocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    hide();
  };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      const t = (e.currentTarget.querySelector('[aria-controls]') ||
        e.currentTarget.firstElementChild) as HTMLElement | null;
      t?.focus();
    }
  };

  const trigger = (() => {
    if (!children || typeof children !== 'object' || Array.isArray(children)) return children;
    try {
      const child = children as React.ReactElement;
      const prevOnClick = child.props.onClick as
        | ((e: ReactMouseEvent) => void)
        | undefined;
      return React.cloneElement(child, {
        'aria-expanded': open,
        'aria-controls': popId,
        onClick: (e: ReactMouseEvent) => {
          prevOnClick?.(e);
          setOpen(!open);
        },
      });
    } catch {
      return children;
    }
  })();

  return (
    <div
      ref={ref}
      className={cx('ui-popover', className)}
      style={style}
      onMouseEnter={onRootEnter}
      onMouseLeave={onRootLeave}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
      onKeyDown={onKeyDown}
    >
      {trigger}
      <div
        className="ui-popover-panel"
        id={popId}
        role="dialog"
        aria-label={ariaLabel}
        hidden={!open}
      >
        {content}
      </div>
    </div>
  );
});
