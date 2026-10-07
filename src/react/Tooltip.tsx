import React, {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type TooltipVariant = 'invert' | 'surface';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** 气泡内容（文本或任意节点） */
  content: ReactNode;
  /** invert=反转色（默认 macOS 惯例）；surface=跟随主题表面 + 毛玻璃 */
  variant?: TooltipVariant;
  /** 气泡方位（仅 top 已有 CSS，其余见交付报告） */
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
  style?: CSSProperties;
  /** 触发元素（建议可聚焦节点，如 button） */
  children?: ReactNode;
}

/**
 * Tooltip · 悬浮提示（浮层导航组）
 * - 默认 invert 反转色；`variant="surface"` 跟随主题表面 + 毛玻璃（--ui-tooltip-glass-*）
 * - hover / focus 显示；Esc 关闭并归还焦点；外部点击关闭
 * - ARIA：气泡 role=tooltip + id；触发元素 aria-describedby 指向该 id
 * - 受控 / 非受控双模式；不携带任何样式，全部走 theme.css
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    content,
    variant = 'invert',
    placement = 'top',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    delay = 0,
    disabled = false,
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
  const tipId = id ?? useId();
  const hideTimer = useRef<number | undefined>(undefined);
  const showTimer = useRef<number | undefined>(undefined);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const clearTimers = () => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(showTimer.current);
  };

  const show = useCallback(() => {
    if (disabled) return;
    clearTimers();
    showTimer.current = window.setTimeout(() => setOpen(true), delay);
  }, [disabled, delay, setOpen]);

  const hide = useCallback(() => {
    if (disabled) return;
    clearTimers();
    hideTimer.current = window.setTimeout(() => setOpen(false), 120);
  }, [disabled, setOpen]);

  const onMouseEnter = () => show();
  const onMouseLeave = () => hide();
  const onFocusIn = () => show();
  const onFocusOut = (e: ReactFocusEvent<HTMLSpanElement>) => {
    // 焦点仍在根内（如移到气泡）时不隐藏
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    hide();
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      const t = (e.currentTarget.querySelector('[aria-describedby]') ||
        e.currentTarget.firstElementChild) as HTMLElement | null;
      t?.focus();
    }
  };

  // 给触发元素注入 aria-describedby（仅单元素子节点时）
  const trigger = (() => {
    if (!children || typeof children !== 'object' || Array.isArray(children)) return children;
    try {
      return React.cloneElement(children as React.ReactElement, {
        'aria-describedby': tipId,
      });
    } catch {
      return children;
    }
  })();

  return (
    <span
      ref={ref}
      className={cx(
        'ui-tip',
        variant === 'surface' && 'ui-tip--surface',
        placement !== 'top' && `ui-tip--${placement}`,
        open && 'is-open',
        className,
      )}
      style={style}
      onMouseEnter={disabled ? undefined : onMouseEnter}
      onMouseLeave={disabled ? undefined : onMouseLeave}
      onFocus={disabled ? undefined : onFocusIn}
      onBlur={disabled ? undefined : onFocusOut}
      onKeyDown={disabled ? undefined : onKeyDown}
    >
      {trigger}
      <span
        className="bubble"
        role="tooltip"
        id={tipId}
        aria-hidden={open ? undefined : true}
      >
        {content}
      </span>
    </span>
  );
});
