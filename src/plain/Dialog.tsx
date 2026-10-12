import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface DialogProps {
  /** 受控打开状态 */
  open: MaybeGetter<boolean>;
  /** 打开/关闭回调（Esc/遮罩/动作均可触发） */
  onOpenChange?: (open: boolean) => void;
  /** 标题，渲染为面板内 <h3>，并作默认 aria-label */
  title?: MaybeGetter<Renderable>;
  /** 底部操作区（按钮组） */
  footer?: MaybeGetter<Renderable>;
  /** 无障碍标签（默认取 title 或 '对话框'） */
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
 * Dialog · 模态对话框（浮层导航组）
 * - 焦点陷阱：打开聚焦首项、Tab/Shift+Tab 循环、Esc 关闭、点遮罩关闭
 * - role=dialog + aria-modal=true；受控 open + onOpenChange
 * - 不携带样式，全部走 theme.css
 */
export function Dialog(props: DialogProps) {
  const {
    open,
    onOpenChange,
    title,
    footer,
    ariaLabel,
    closeOnOverlay = true,
    className,
    style,
    children,
    ...rest
  } = props;

  const isOpen = () => !!resolve(open);

  const focusFirst = () => {
    const overlay = document.querySelector('.ui-overlay.show') as HTMLElement | null;
    const f = overlay?.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = f && f.length ? f[0] : overlay;
    if (first && !first.hasAttribute('disabled')) first.focus?.();
  };

  // 打开时聚焦首个可聚焦元素
  requestAnimationFrame(() => {
    if (isOpen()) focusFirst();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) onOpenChange?.(false);
    });
  });

  return (
    <div
      {...rest}
      class={cx('ui-overlay', isOpen() && 'show', resolve(className))}
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
      <div
        class={cx('ui-dialog', 'ui-glass', resolve(className))}
        role="dialog"
        aria-modal="true"
        aria-label={
          resolve(ariaLabel) ||
          (typeof resolve(title) === 'string' ? (resolve(title) as string) : '对话框')
        }
      >
        {title != null && <h3>{() => resolve(title)}</h3>}
        <div>{resolve(children)}</div>
        {footer != null && <div class="ui-dialog-actions">{() => resolve(footer)}</div>}
      </div>
    </div>
  );
}
