import { signal } from 'plain';
import { cx } from './_shared';

export type SwitchSize = 'lg' | 'md' | 'sm' | 'xs';

export interface SwitchProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  label?: string;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Switch · 开关（输入）
 * 受控/非受控双模式；aria-checked 为状态真理源（CSS 据此移动滑块）。
 */
export function Switch(props: SwitchProps) {
  const isControlled = () => props.checked != null;
  const size = () => props.size ?? 'md';
  const disabled = () => props.disabled ?? false;
  const inner = signal<boolean>(!!(props.defaultChecked ?? false));
  const on = () => (isControlled() ? !!props.checked : inner());
  return (
    <button
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      type="button"
      role="switch"
      class={cx('ui-switch', size() !== 'md' && 'ui-size-' + size(), props.className)}
      aria-checked={on() ? 'true' : 'false'}
      aria-label={props.label}
      disabled={disabled()}
      style={props.style}
      onClick={() => {
        if (disabled()) return;
        const next = !on();
        if (!isControlled()) inner.set(next);
        props.onChange?.(next);
      }}
    ></button>
  );
}
