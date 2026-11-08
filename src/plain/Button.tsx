import { cx } from './_shared';
import type { Renderable } from './_shared';

export type ButtonVariant = 'primary' | 'default' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

export interface ButtonProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: Renderable;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
}

/**
 * Button · 毛玻璃按钮（基础输入组）
 * 变体 primary/default/ghost/outline/danger；pill 全圆角；loading 置 aria-busy 且禁用点击。
 *
 * 约定：props 一律直接读 props.x；带默认值的拆成 thunk（PLAIN_E1105/1112 友好）。
 */
export function Button(props: ButtonProps) {
  const variant = () => props.variant ?? 'default';
  const size = () => props.size ?? 'md';
  const pill = () => props.pill ?? false;
  const loading = () => props.loading ?? false;
  const type = () => props.type ?? 'button';
  const isDisabled = () => (props.disabled ?? false) || loading();
  return (
    <button
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx(
        'ui-btn',
        'ui-btn--' + variant(),
        size() !== 'md' && 'ui-size-' + size(),
        pill() && 'ui-btn--pill',
        loading() && 'ui-btn--loading',
        props.className,
      )}
      type={type()}
      disabled={isDisabled()}
      aria-busy={loading() || undefined}
      style={props.style}
      onClick={(e: MouseEvent) => {
        if (!isDisabled()) props.onClick?.(e);
      }}
    >
      {props.icon != null && <span class="ui-icon">{props.icon}</span>}
      {props.children?.()}
    </button>
  );
}
