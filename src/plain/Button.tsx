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
  id?: MaybeGetter<string>;
  children?: Renderable | (() => Renderable);
}

/**
 * Button · 毛玻璃按钮（基础输入组）
 * 变体 primary/default/ghost/outline/danger；pill 全圆角；loading 置 aria-busy 且禁用点击。
 *
 * 约定：props 一律用 resolve(props.x) 读取；带默认值的拆成 thunk（PLAIN_E1105/1112 友好）。
 */
export function Button(props: ButtonProps) {
  const variant = () => resolve(props.variant) ?? 'default';
  const size = () => resolve(props.size) ?? 'md';
  const pill = () => resolve(props.pill) ?? false;
  const loading = () => resolve(props.loading) ?? false;
  const type = () => resolve(props.type) ?? 'button';
  const isDisabled = () => (resolve(props.disabled) ?? false) || loading();
  return (
    <button
      id={resolve(props.id)}
      class={cx(
        'ui-btn',
        'ui-btn--' + variant(),
        size() !== 'md' && 'ui-size-' + size(),
        pill() && 'ui-btn--pill',
        loading() && 'ui-btn--loading',
        resolve(props.className),
      )}
      type={type()}
      disabled={isDisabled()}
      aria-busy={loading() || undefined}
      style={resolve(props.style)}
      onClick={(e: MouseEvent) => {
        if (!isDisabled()) props.onClick?.(e);
      }}
    >
      {resolve(props.icon) != null && <span class="ui-icon">{resolve(props.icon)}</span>}
      {resolve(props.children)}
    </button>
  );
}
