import React, {
  forwardRef,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from '../utils/cx';

export type SwitchSize = 'lg' | 'md' | 'xs' | 'sm';

export interface SwitchProps {
  /** 受控开/关 */
  checked?: boolean;
  /** 非受控初始值 */
  defaultChecked?: boolean;
  /** 切换回调，回传新状态 */
  onChange?: (checked: boolean) => void;
  /** 尺寸 Scale（track 高=控件高，宽=1.7×高） */
  size?: SwitchSize;
  disabled?: boolean;
  /** 无障碍标签（纯图标 toggle 必须） */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Switch · 毛玻璃开关（基础输入组）
 * - role="switch" + aria-checked 为状态真理源，CSS 据其移动滑块
 * - 受控 checked + onChange；非受控 defaultChecked
 * - 不携带样式，全部走 theme.css
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    size = 'md',
    disabled = false,
    label,
    className,
    style,
  },
  ref,
) {
  const isControlled = checked != null;
  const [inner, setInner] = useState<boolean>(defaultChecked);
  const on = isControlled ? (checked as boolean) : inner;

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cx('ui-switch', size !== 'md' && `ui-size-${size}`, className)}
      disabled={disabled}
      onClick={toggle}
      style={style}
    />
  );
});
