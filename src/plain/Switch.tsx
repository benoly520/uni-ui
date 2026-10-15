import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

export type SwitchSize = 'lg' | 'md' | 'sm' | 'xs';

export interface SwitchProps {
  checked?: MaybeGetter<boolean>;
  defaultChecked?: MaybeGetter<boolean>;
  onChange?: (checked: boolean) => void;
  size?: MaybeGetter<SwitchSize>;
  disabled?: MaybeGetter<boolean>;
  label?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Switch · 开关（输入）
 * 受控/非受控双模式；aria-checked 为状态真理源（CSS 据此移动滑块）。
 */
export function Switch(props: SwitchProps) {
  const isControlled = () => resolve(props.checked) != null;
  const size = () => resolve(props.size) ?? 'md';
  const disabled = () => resolve(props.disabled) ?? false;
  const inner = signal<boolean>(!!(resolve(props.defaultChecked) ?? false));
  const on = () => (isControlled() ? !!resolve(props.checked) : inner());
  return (
    <button
      id={resolve(props.id)}
      type="button"
      role="switch"
      class={cx('ui-switch', size() !== 'md' && 'ui-size-' + size(), resolve(props.className))}
      aria-checked={on()}
      aria-label={resolve(props.label)}
      disabled={disabled()}
      style={resolve(props.style)}
      onClick={() => {
        if (disabled()) return;
        const next = !on();
        if (!isControlled()) inner.set(next);
        props.onChange?.(next);
      }}
    ></button>
  );
}
