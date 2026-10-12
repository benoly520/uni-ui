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
  [key: string]: any;
}

/**
 * Switch · 开关（输入）
 * 受控/非受控双模式；aria-checked 为状态真理源（CSS 据此移动滑块）。
 */
export function Switch(props: SwitchProps) {
  const {
    checked,
    defaultChecked = false,
    onChange,
    size = 'md',
    disabled = false,
    label,
    className,
    style,
    ...rest
  } = props;
  const isControlled = checked != null;
  const inner = signal<boolean>(!!resolve(defaultChecked));
  const on = () => (isControlled ? !!resolve(checked) : inner());
  return (
    <button
      {...rest}
      type="button"
      role="switch"
      class={cx('ui-switch', resolve(size) !== 'md' && 'ui-size-' + resolve(size), resolve(className))}
      aria-checked={on()}
      aria-label={resolve(label)}
      disabled={resolve(disabled)}
      style={resolve(style)}
      onClick={() => {
        if (resolve(disabled)) return;
        const next = !on();
        if (!isControlled) inner.set(next);
        onChange?.(next);
      }}
    ></button>
  );
}
