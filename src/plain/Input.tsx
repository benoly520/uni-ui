import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type InputSize = 'lg' | 'md' | 'sm' | 'xs';

export interface InputProps {
  value?: MaybeGetter<string>;
  defaultValue?: MaybeGetter<string>;
  onChange?: (value: string, e: Event) => void;
  size?: MaybeGetter<InputSize>;
  disabled?: MaybeGetter<boolean>;
  error?: MaybeGetter<boolean>;
  placeholder?: MaybeGetter<string>;
  type?: MaybeGetter<string>;
  name?: MaybeGetter<string>;
  id?: MaybeGetter<string>;
  prefix?: Renderable | (() => Renderable);
  suffix?: Renderable | (() => Renderable);
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  'aria-label'?: MaybeGetter<string>;
  [key: string]: any;
}

/**
 * Input · 输入框（输入）
 * 受控/非受控；error 加 --error 类与 aria-invalid；前后缀包入 .ui-input-wrap。
 */
export function Input(props: InputProps) {
  const {
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
    prefix,
    suffix,
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const isControlled = value != null;
  const inner = signal<string>(
    value != null ? String(resolve(value)) : defaultValue != null ? String(resolve(defaultValue)) : '',
  );

  const renderInput = () => (
    <input
      class={cx(
        'ui-input',
        resolve(size) !== 'md' && 'ui-size-' + resolve(size),
        resolve(error) && 'ui-input--error',
      )}
      type={resolve(type)}
      value={isControlled ? String(resolve(value)) : inner()}
      placeholder={resolve(placeholder)}
      name={resolve(name)}
      id={resolve(id)}
      disabled={resolve(disabled)}
      aria-invalid={resolve(error) || undefined}
      aria-label={resolve(ariaLabel)}
      onInput={(e: Event) => {
        const v = (e.target as HTMLInputElement).value;
        if (!isControlled) inner.set(v);
        onChange?.(v, e);
      }}
    />
  );

  const p = resolve(prefix);
  const s = resolve(suffix);
  if (p == null && s == null) return renderInput();
  return (
    <span {...rest} class="ui-input-wrap" style={resolve(style)}>
      {p != null && <span class="ui-icon" aria-hidden="true">{p}</span>}
      {renderInput()}
      {s != null && <span class="ui-icon" aria-hidden="true">{s}</span>}
    </span>
  );
}
