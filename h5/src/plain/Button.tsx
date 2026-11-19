import { cx } from './_shared';
import type { Renderable } from './_shared';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonProps {
  /** 语义变体，默认 primary */
  variant?: ButtonVariant;
  /** 尺寸，默认 medium */
  size?: ButtonSize;
  /** 通栏（占满父容器宽度） */
  block?: boolean;
  /** 胶囊形状 */
  round?: boolean;
  /** 加载态：展示 spinner、禁用点击并设置 aria-busy */
  loading?: boolean;
  /** 表单语义：button / submit / reset */
  type?: 'button' | 'submit' | 'reset';
  /** 图标节点（任意 1em 尺寸、currentColor 的 SVG），置于文本前 */
  icon?: Renderable;
  /** 原生禁用 */
  disabled?: boolean;
  /** 点击回调；disabled / loading 时不触发 */
  onClick?: (event: MouseEvent) => void;
  /** 附加 class（原生属性透传） */
  className?: string;
  id?: string;
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
}

/**
 * Button · 移动端按钮（Plain）
 * 变体 primary / secondary / outline / ghost / danger，尺寸 large / medium / small；
 * block 通栏、round 胶囊；loading 展示 spinner 且禁用点击。
 *
 * 约定：props 一律直接读 props.x；带默认值的拆成 thunk，children 需显式调用。
 */
export function Button(props: ButtonProps) {
  const variant = () => props.variant ?? 'primary';
  const size = () => props.size ?? 'medium';
  const block = () => props.block ?? false;
  const round = () => props.round ?? false;
  const loading = () => props.loading ?? false;
  const type = () => props.type ?? 'button';
  const isDisabled = () => (props.disabled ?? false) || loading();

  return (
    <button
      id={props.id}
      class={cx(
        'h5-btn',
        'h5-btn--' + variant(),
        size() !== 'medium' && 'h5-btn--' + size(),
        block() && 'h5-btn--block',
        round() && 'h5-btn--round',
        loading() && 'h5-btn--loading',
        props.className,
      )}
      type={type()}
      disabled={isDisabled()}
      aria-busy={loading() || undefined}
      onClick={(event: MouseEvent) => {
        if (!isDisabled()) props.onClick?.(event);
      }}
    >
      {loading() ? (
        <span class="h5-btn__spinner" aria-hidden="true" />
      ) : (
        props.icon != null && <span class="h5-btn__icon">{props.icon}</span>
      )}
      {props.children?.()}
    </button>
  );
}
