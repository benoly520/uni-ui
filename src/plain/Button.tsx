import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type ButtonVariant = 'primary' | 'default' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

export interface ButtonProps {
  variant?: MaybeGetter<ButtonVariant>;
  size?: MaybeGetter<ButtonSize>;
  pill?: MaybeGetter<boolean>;
  loading?: MaybeGetter<boolean>;
  type?: MaybeGetter<'button' | 'submit' | 'reset'>;
  icon?: Renderable | (() => Renderable);
  disabled?: MaybeGetter<boolean>;
  onClick?: (e: MouseEvent) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  children?: Renderable | (() => Renderable);
  [key: string]: any;
}

/**
 * Button · 毛玻璃按钮（基础输入组）
 * 变体 primary/default/ghost/outline/danger；pill 全圆角；loading 置 aria-busy 且禁用点击。
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'default',
    size = 'md',
    pill = false,
    loading = false,
    type = 'button',
    icon,
    disabled = false,
    onClick,
    className,
    style,
    children,
    ...rest
  } = props;
  const isDisabled = () => resolve(disabled) || resolve(loading);
  return (
    <button
      {...rest}
      class={cx(
        'ui-btn',
        'ui-btn--' + resolve(variant),
        resolve(size) !== 'md' && 'ui-size-' + resolve(size),
        resolve(pill) && 'ui-btn--pill',
        resolve(loading) && 'ui-btn--loading',
        resolve(className),
      )}
      type={resolve(type)}
      disabled={resolve(disabled) || resolve(loading)}
      aria-busy={resolve(loading) || undefined}
      style={resolve(style)}
      onClick={(e: MouseEvent) => {
        if (!isDisabled()) onClick?.(e);
      }}
    >
      {resolve(icon) != null && <span class="ui-icon">{resolve(icon)}</span>}
      {resolve(children)}
    </button>
  );
}
