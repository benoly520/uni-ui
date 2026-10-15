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
}

/**
 * Input · 输入框（输入）
 * 受控/非受控；error 加 --error 类与 aria-invalid；前后缀包入 .ui-input-wrap。
 */
export function Input(props: InputProps) {
  const isControlled = () => resolve(props.value) != null;
  const size = () => resolve(props.size) ?? 'md';
  const disabled = () => resolve(props.disabled) ?? false;
  const error = () => resolve(props.error) ?? false;
  const inner = signal<string>(
    resolve(props.value) != null
      ? String(resolve(props.value))
      : resolve(props.defaultValue) != null
        ? String(resolve(props.defaultValue))
        : '',
  );
  const cur = () => (isControlled() ? String(resolve(props.value)) : inner());

  const prefix = () => resolve(props.prefix);
  const suffix = () => resolve(props.suffix);
  const showWrap = () => prefix() != null || suffix() != null;
  const onInput = (e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    if (!isControlled()) inner.set(v);
    props.onChange?.(v, e);
  };
  return (
    <>
      {showWrap() ? (
        <span class="ui-input-wrap" style={resolve(props.style)}>
          {prefix() != null && <span class="ui-icon" aria-hidden="true">{prefix()}</span>}
          <input
            class={cx('ui-input', size() !== 'md' && 'ui-size-' + size(), error() && 'ui-input--error')}
            type={resolve(props.type) ?? 'text'}
            value={cur()}
            placeholder={resolve(props.placeholder)}
            name={resolve(props.name)}
            id={resolve(props.id)}
            disabled={disabled()}
            aria-invalid={error() || undefined}
            aria-label={resolve(props['aria-label'])}
            onInput={onInput}
          />
          {suffix() != null && <span class="ui-icon" aria-hidden="true">{suffix()}</span>}
        </span>
      ) : (
        <input
          class={cx('ui-input', size() !== 'md' && 'ui-size-' + size(), error() && 'ui-input--error')}
          type={resolve(props.type) ?? 'text'}
          value={cur()}
          placeholder={resolve(props.placeholder)}
          name={resolve(props.name)}
          id={resolve(props.id)}
          disabled={disabled()}
          aria-invalid={error() || undefined}
          aria-label={resolve(props['aria-label'])}
          onInput={onInput}
        />
      )}
    </>
  );
}
