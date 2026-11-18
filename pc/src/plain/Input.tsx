import { signal } from 'plain';
import { cx } from './_shared';
import type { Renderable } from './_shared';

export type InputSize = 'lg' | 'md' | 'sm' | 'xs';

export interface InputProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: Event) => void;
  size?: InputSize;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  maxLength?: number;
  prefix?: Renderable;
  suffix?: Renderable;
  className?: string;
  style?: string | Record<string, string>;
  'aria-label'?: string;
}

/**
 * Input · 输入框（输入）
 * 受控/非受控；error 加 --error 类与 aria-invalid；前后缀包入 .ui-input-wrap。
 */
export function Input(props: InputProps) {
  const isControlled = () => props.value != null;
  const size = () => props.size ?? 'md';
  const disabled = () => props.disabled ?? false;
  const error = () => props.error ?? false;
  const inner = signal<string>(
    props.value != null
      ? String(props.value)
      : props.defaultValue != null
        ? String(props.defaultValue)
        : '',
  );
  const cur = () => (isControlled() ? String(props.value) : inner());

  const prefix = () => props.prefix;
  const suffix = () => props.suffix;
  const showWrap = () => prefix() != null || suffix() != null;
  const onInput = (e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    if (!isControlled()) inner.set(v);
    props.onChange?.(v, e);
  };
  return (
    <>
      {showWrap() ? (
        <span
          data-glass={props.glass === false ? 'off' : undefined}
          class="ui-input-wrap"
          style={props.style}
        >
          {prefix() != null && <span class="ui-icon" aria-hidden="true">{prefix()}</span>}
          <input
            class={cx('ui-input', size() !== 'md' && 'ui-size-' + size(), error() && 'ui-input--error')}
            type={props.type ?? 'text'}
            value={cur()}
            placeholder={props.placeholder}
            name={props.name}
            id={props.id}
            disabled={disabled()}
            aria-invalid={error() || undefined}
            aria-label={props['aria-label']}
            onInput={onInput}
          />
          {suffix() != null && <span class="ui-icon" aria-hidden="true">{suffix()}</span>}
        </span>
      ) : (
        <input
          data-glass={props.glass === false ? 'off' : undefined}
          class={cx(
            'ui-input',
            size() !== 'md' && 'ui-size-' + size(),
            error() && 'ui-input--error',
            props.className,
          )}
          style={props.style}
          type={props.type ?? 'text'}
          value={cur()}
          placeholder={props.placeholder}
          name={props.name}
          id={props.id}
          maxLength={props.maxLength}
          disabled={disabled()}
          aria-invalid={error() || undefined}
          aria-label={props['aria-label']}
          onInput={onInput}
        />
      )}
    </>
  );
}
