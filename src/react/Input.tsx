import React, {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type InputSize = 'lg' | 'md' | 'xs' | 'sm';

export interface InputProps {
  /** 受控值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 值变更回调，回传当前 value 与原始事件 */
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 尺寸 Scale（全局修饰，md 默认无类） */
  size?: InputSize;
  /** 禁用 */
  disabled?: boolean;
  /** 错误态：danger 描边 + 软光晕 + aria-invalid */
  error?: boolean;
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  maxLength?: number;
  /** 前导图标/装饰（包入 .ui-icon，装饰性 sibling） */
  prefix?: ReactNode;
  /** 后导图标/装饰（包入 .ui-icon，装饰性 sibling） */
  suffix?: ReactNode;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

/**
 * Input · 单行文本输入（基础输入组）
 * - 受控 value + onChange；非受控 defaultValue
 * - 前后缀图标包入 .ui-icon（装饰性 sibling，不进边框）；size/error 走 class
 * - 不携带样式，全部走 theme.css
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    value,
    defaultValue,
    onChange,
    size = 'md',
    disabled = false,
    error = false,
    placeholder,
    type = 'text',
    name,
    id,
    maxLength,
    prefix,
    suffix,
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const isControlled = value != null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value, e);
  };

  const inputEl = (
    <input
      ref={ref}
      className={cx('ui-input', size !== 'md' && `ui-size-${size}`, error && 'ui-input--error', className)}
      type={type}
      value={isControlled ? value : undefined}
      defaultValue={isControlled ? undefined : defaultValue}
      placeholder={placeholder}
      name={name}
      id={id}
      maxLength={maxLength}
      disabled={disabled}
      aria-invalid={error || undefined}
      aria-label={ariaLabel}
      onChange={handleChange}
      style={style}
      {...rest}
    />
  );

  if (!prefix && !suffix) return inputEl;

  return (
    <span className="ui-input-wrap">
      {prefix != null && (
        <span className="ui-icon" aria-hidden="true">
          {prefix}
        </span>
      )}
      {inputEl}
      {suffix != null && (
        <span className="ui-icon" aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  );
});
