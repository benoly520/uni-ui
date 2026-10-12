import { resolve, signal, effect } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface PopoverProps {
  /** 面板内容（可含可交互元素，如按钮） */
  content: MaybeGetter<Renderable>;
  /** 受控显示 */
  open?: MaybeGetter<boolean>;
  /** 非受控初始显示 */
  defaultOpen?: MaybeGetter<boolean>;
  /** 显隐回调 */
  onOpenChange?: (open: boolean) => void;
  /** 面板无障碍标签 */
  ariaLabel?: MaybeGetter<string>;
  /** 面板 id（默认自动生成，用于 aria-controls） */
  id?: string;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  /** 触发元素 */
  children?: MaybeGetter<Renderable>;
  [key: string]: any;
}

let popSeq = 0;

/**
 * Popover · 可交互悬浮资料卡（浮层导航组）
 * - hover / focus 弹出；点击触发元素亦可切换；面板内按钮可点
 * - 外部点击 / Esc 关闭；受控 / 非受控双模式
 * - 不携带样式，全部走 theme.css
 */
export function Popover(props: PopoverProps) {
  const {
    content,
    open,
    defaultOpen = false,
    onOpenChange,
    ariaLabel = 'Popover',
    id,
    className,
    style,
    children,
    ...rest
  } = props;

  const isControlled = open != null;
  const inner = signal<boolean>(!!resolve(defaultOpen));
  const shown = () => (isControlled ? !!resolve(open) : inner());
  const popId = id || `pop-${++popSeq}`;

  const setOpen = (v: boolean) => {
    if (!isControlled) inner.set(v);
    onOpenChange?.(v);
  };

  let hideTimer: number | undefined;
  const show = () => {
    if (hideTimer) window.clearTimeout(hideTimer);
    setOpen(true);
  };
  const hide = () => {
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => setOpen(false), 120);
  };

  const syncTrigger = () => {
    const root = document.getElementById(popId)?.parentElement;
    const trigger = root?.firstElementChild as HTMLElement | null;
    if (!trigger) return;
    trigger.setAttribute('aria-controls', popId);
    trigger.setAttribute('aria-expanded', shown() ? 'true' : 'false');
    if (!(trigger as any).__popBound) {
      (trigger as any).__popBound = true;
      trigger.addEventListener('click', () => setOpen(!shown()));
    }
  };
  // 挂载后注入一次；open 变化后响应式同步
  requestAnimationFrame(syncTrigger);
  effect(syncTrigger);

  return (
    <div
      {...rest}
      class={cx('ui-popover', resolve(className))}
      style={resolve(style)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusIn={show}
      onFocusOut={(e: FocusEvent) => {
        if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
        hide();
      }}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape' && shown()) {
          setOpen(false);
          const t = document
            .getElementById(popId)
            ?.parentElement?.firstElementChild as HTMLElement | null;
          t?.focus?.();
        }
      }}
    >
      {resolve(children)}
      <div
        class="ui-popover-panel"
        id={popId}
        role="dialog"
        aria-label={resolve(ariaLabel)}
        hidden={!shown()}
      >
        {() => resolve(content)}
      </div>
    </div>
  );
}
