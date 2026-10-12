import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type DrawerSide = 'right' | 'left' | 'bottom';

export interface DrawerProps {
  /** 受控打开状态 */
  open: MaybeGetter<boolean>;
  /** 打开/关闭回调 */
  onOpenChange?: (open: boolean) => void;
  /** 滑出方向：right（默认）/ left / bottom */
  side?: MaybeGetter<DrawerSide>;
  /** 标题 */
  title?: MaybeGetter<Renderable>;
  /** 副标题（位于标题下方 .ui-label） */
  subtitle?: MaybeGetter<Renderable>;
  /** 是否显示关闭按钮（header 内） */
  showClose?: MaybeGetter<boolean>;
  /** 无障碍标签（默认取 title 或 '抽屉'） */
  ariaLabel?: MaybeGetter<string>;
  /** 点击遮罩是否关闭 */
  closeOnOverlay?: MaybeGetter<boolean>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  /** 主体内容 */
  children?: MaybeGetter<Renderable>;
  [key: string]: any;
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Drawer · 侧滑抽屉（浮层导航组）
 * - 方向 right/left/bottom（默认 right）；焦点陷阱 + Esc + 遮罩关闭
 * - role=dialog aria-modal=true；受控 open + onOpenChange
 * - 不携带样式，全部走 theme.css
 */
export function Drawer(props: DrawerProps) {
  const {
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
    ...rest
  } = props;

  const isOpen = () => !!resolve(open);

  const focusFirst = () => {
    const overlay = document.querySelector('.ui-drawer-overlay.show') as HTMLElement | null;
    const f = overlay?.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = f && f.length ? f[0] : overlay;
    if (first && !first.hasAttribute('disabled')) first.focus?.();
  };

  requestAnimationFrame(() => {
    if (isOpen()) focusFirst();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) onOpenChange?.(false);
    });
  });

  return (
    <div
      {...rest}
      class={cx('ui-drawer-overlay', isOpen() && 'show', resolve(className))}
      role="presentation"
      aria-hidden={!isOpen()}
      style={resolve(style)}
      onMouseDown={(e: MouseEvent) => {
        if (resolve(closeOnOverlay) && e.target === e.currentTarget) onOpenChange?.(false);
      }}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isOpen()) onOpenChange?.(false);
          return;
        }
        if (e.key !== 'Tab') return;
        const f = (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(FOCUSABLE);
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
      }}
    >
      <aside
        class={cx('ui-drawer', 'ui-glass', resolve(side) !== 'right' && `ui-drawer--${resolve(side)}`)}
        role="dialog"
        aria-modal="true"
        aria-label={
          resolve(ariaLabel) ||
          (typeof resolve(title) === 'string' ? (resolve(title) as string) : '抽屉')
        }
      >
        {title != null || resolve(showClose) ? (
          <header>
            <div>
              {title != null && <div class="ui-drawer-title">{() => resolve(title)}</div>}
              {subtitle != null && <div class="ui-label">{() => resolve(subtitle)}</div>}
            </div>
            {resolve(showClose) && (
              <button
                class="ui-btn ui-btn--ghost ui-size-sm"
                aria-label="关闭"
                type="button"
                onClick={() => onOpenChange?.(false)}
              >
                {'✕'}
              </button>
            )}
          </header>
        ) : null}
        <div class="body">{resolve(children)}</div>
      </aside>
    </div>
  );
}
