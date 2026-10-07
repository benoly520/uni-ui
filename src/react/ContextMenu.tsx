import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { cx } from '../utils/cx';

export interface ContextMenuItem {
  /** 唯一命令键（data-key） */
  key: string;
  /** 项文案 */
  label: ReactNode;
  /** 右侧快捷键提示（可选） */
  shortcut?: string;
  /** 危险项（红 hover） */
  danger?: boolean;
  /** 渲染为分隔线 */
  separator?: boolean;
}

export interface ContextMenuProps {
  /** 菜单项（命令式传入） */
  items: ContextMenuItem[];
  /** 右键触发目标 */
  targetRef: RefObject<HTMLElement | null>;
  /** 受控显隐（可选） */
  open?: boolean;
  /** 非受控初始 */
  defaultOpen?: boolean;
  /** 显隐变化 */
  onOpenChange?: (open: boolean) => void;
  /** 点击项执行 */
  onSelect?: (key: string) => void;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * ContextMenu · 右键菜单（标的一行操作）
 * - 右键光标处弹出（近视口边缘翻转）、点项执行、外部/Esc 关闭、危险项红 hover
 * - 受控 open + 命令式 items；不携带样式，全部走 theme.css
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  function ContextMenu(
    {
      items,
      targetRef,
      open,
      defaultOpen = false,
      onOpenChange,
      onSelect,
      'aria-label': ariaLabel = '操作菜单',
      className,
      style,
    },
    ref,
  ) {
    const isControlled = open != null;
    const [innerOpen, setInnerOpen] = useState(defaultOpen);
    const isOpen = isControlled ? (open as boolean) : innerOpen;
    const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement | null>(null);

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setInnerOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const openAt = useCallback(
      (x: number, y: number) => {
        setPos({ x, y });
        setOpen(true);
      },
      [setOpen],
    );

    useEffect(() => {
      const target = targetRef.current;
      if (!target) return;
      const onCtx = (e: MouseEvent) => {
        e.preventDefault();
        openAt(e.clientX, e.clientY);
      };
      target.addEventListener('contextmenu', onCtx);
      return () => target.removeEventListener('contextmenu', onCtx);
    }, [targetRef, openAt]);

    useEffect(() => {
      if (!isOpen) return;
      const onDoc = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
      };
    }, [isOpen, setOpen]);

    useLayoutEffect(() => {
      if (!isOpen || !menuRef.current) return;
      const r = menuRef.current.getBoundingClientRect();
      let px = pos.x;
      let py = pos.y;
      if (px + r.width > window.innerWidth) px = px - r.width;
      if (py + r.height > window.innerHeight) py = py - r.height;
      setPos({ x: px, y: py });
    }, [isOpen, pos, items]);

    return (
      <div
        ref={(node) => {
          menuRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cx('ui-contextmenu', isOpen && 'is-open', className)}
        role="menu"
        aria-label={ariaLabel}
        style={{ ...style, left: `${pos.x}px`, top: `${pos.y}px` }}
      >
        {items.map((it) =>
          it.separator ? (
            <div key={it.key} className="ui-contextmenu-sep" />
          ) : (
            <div
              key={it.key}
              className={cx('ui-contextmenu-item', it.danger && 'is-danger')}
              role="menuitem"
              data-key={it.key}
              onClick={() => {
                onSelect?.(it.key);
                setOpen(false);
              }}
            >
              <span>{it.label}</span>
              {it.shortcut != null && (
                <span className="ui-contextmenu-shortcut">{it.shortcut}</span>
              )}
            </div>
          ),
        )}
      </div>
    );
  },
);
