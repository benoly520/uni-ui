import { resolve, signal, effect } from 'plain';
import { cx, mergeStyle } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface ContextMenuItem {
  /** 唯一命令键（data-key） */
  key: string;
  /** 项文案 */
  label: MaybeGetter<Renderable>;
  /** 右侧快捷键提示（可选） */
  shortcut?: string;
  /** 危险项（红 hover） */
  danger?: boolean;
  /** 渲染为分隔线 */
  separator?: boolean;
}

export interface ContextMenuProps {
  /** 菜单项（命令式传入） */
  items: MaybeGetter<ContextMenuItem[]>;
  /** 右键触发目标（元素 / 返回元素的函数 / { current }） */
  target?: HTMLElement | (() => HTMLElement | null) | { current: HTMLElement | null } | null;
  /** 受控显隐（可选） */
  open?: MaybeGetter<boolean>;
  /** 非受控初始 */
  defaultOpen?: MaybeGetter<boolean>;
  /** 显隐变化 */
  onOpenChange?: (open: boolean) => void;
  /** 点击项执行 */
  onSelect?: (key: string) => void;
  'aria-label'?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * ContextMenu · 右键菜单（标的一行操作）
 * 右键光标处弹出（近视口边缘翻转）、点项执行、外部/Esc 关闭、危险项红 hover。
 * 受控 open + 命令式 items。文档级监听在 ref 清理里回收，消除旧实现的监听器泄漏。
 */
export function ContextMenu(props: ContextMenuProps) {
  const items = () => resolve(props.items) || [];
  const isControlled = () => resolve(props.open) != null;
  const inner = signal<boolean>(!!(resolve(props.defaultOpen) ?? false));
  const shown = () => (isControlled() ? !!resolve(props.open) : inner());
  const pos = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  const ariaLabel = () => resolve(props['aria-label']) ?? '操作菜单';

  const setOpen = (v: boolean) => {
    if (!isControlled()) inner.set(v);
    props.onOpenChange?.(v);
  };
  const close = () => setOpen(false);

  const getTarget = (): HTMLElement | null => {
    const t = resolve(props.target) as any;
    if (!t) return null;
    if (t.current) return t.current as HTMLElement;
    if (typeof t === 'function') return t();
    return t as HTMLElement;
  };

  let rootEl: HTMLElement | null = null;
  const fixEdge = () => {
    requestAnimationFrame(() => {
      const menu = rootEl;
      if (!menu) return;
      const r = menu.getBoundingClientRect();
      const p = pos();
      let x = p.x;
      let y = p.y;
      if (x + r.width > window.innerWidth) x = window.innerWidth - r.width - 8;
      if (y + r.height > window.innerHeight) y = window.innerHeight - r.height - 8;
      if (x !== p.x || y !== p.y) pos.set({ x, y });
    });
  };
  effect(() => {
    if (shown()) fixEdge();
  });

  const onDoc = (e: MouseEvent) => {
    if (!shown()) return;
    if (rootEl && rootEl.contains(e.target as Node)) return;
    close();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && shown()) close();
  };

  const refCb = (el: HTMLElement) => {
    rootEl = el;
    const t = getTarget();
    if (t && t.addEventListener) {
      const onCtx = (e: MouseEvent) => {
        e.preventDefault();
        pos.set({ x: e.clientX, y: e.clientY });
        setOpen(true);
      };
      t.addEventListener('contextmenu', onCtx);
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
      return () => {
        t.removeEventListener('contextmenu', onCtx);
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
        rootEl = null;
      };
    }
    return () => {
      rootEl = null;
    };
  };

  return (
    <div
      id={resolve(props.id)}
      ref={refCb}
      class={cx('ui-contextmenu', shown() && 'is-open', resolve(props.className))}
      role="menu"
      aria-label={ariaLabel()}
      style={mergeStyle(
        { left: pos().x + 'px', top: pos().y + 'px' },
        resolve(props.style),
      )}
    >
      {items().map((it) =>
        it.separator ? (
          <div class="ui-contextmenu-sep" />
        ) : (
          <div
            class={cx('ui-contextmenu-item', it.danger && 'is-danger')}
            role="menuitem"
            data-key={it.key}
            onClick={() => {
              props.onSelect?.(it.key);
              close();
            }}
          >
            <span>{resolve(it.label)}</span>
            {it.shortcut != null && <span class="ui-contextmenu-shortcut">{it.shortcut}</span>}
          </div>
        ),
      )}
    </div>
  );
}
