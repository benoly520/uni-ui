import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface NumberInputProps {
  min?: MaybeGetter<number>;
  max?: MaybeGetter<number>;
  step?: MaybeGetter<number>;
  precision?: MaybeGetter<number>;
  prefix?: MaybeGetter<string>;
  suffix?: MaybeGetter<string>;
  value?: MaybeGetter<number | null>;
  defaultValue?: MaybeGetter<number>;
  onChange?: (value: number) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  'aria-label'?: MaybeGetter<string>;
  [key: string]: any;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * NumberInput · 数值输入（输入，金融增强）
 * 千分位 + 定点格式化；支持前缀/后缀符号；步进、失焦、回车提交均做 [min,max] 钳制。
 */
export function NumberInput(props: NumberInputProps) {
  const {
    min = -Infinity,
    max = Infinity,
    step = 1,
    precision = 0,
    prefix,
    suffix,
    value,
    defaultValue = 0,
    onChange,
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const isControlled = value != null;
  const inner = signal<number>(
    value != null ? Number(resolve(value)) : Number(resolve(defaultValue)),
  );
  const draft = signal<string | null>(null);

  const clamp = (n: number) => Math.min(Number(resolve(max)), Math.max(Number(resolve(min)), n));
  const parse = (s: string): number | null => {
    const pp = resolve(prefix) ?? '';
    const ss = resolve(suffix) ?? '';
    const cleaned = String(s)
      .replace(new RegExp(escapeRe(pp) + '|' + escapeRe(ss), 'g'), '')
      .replace(/,/g, '')
      .trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };
  const commit = (n: number) => {
    const c = clamp(n);
    if (!isControlled) inner.set(c);
    onChange?.(c);
    draft.set(null);
  };
  const display = () =>
    draft() != null
      ? (draft() as string)
      : (resolve(prefix) ?? '') +
        inner().toLocaleString('en-US', {
          minimumFractionDigits: Number(resolve(precision)),
          maximumFractionDigits: Number(resolve(precision)),
        }) +
        (resolve(suffix) ?? '');

  const stepBy = (dir: number) => commit(clamp(inner() + dir * Number(resolve(step))));
  const p = resolve(prefix);
  const s = resolve(suffix);
  const dataNum = (v: any) => String(v);

  return (
    <div
      {...rest}
      class={cx('ui-number', resolve(className))}
      data-min={dataNum(resolve(min))}
      data-max={dataNum(resolve(max))}
      data-step={dataNum(resolve(step))}
      data-precision={dataNum(resolve(precision))}
      data-prefix={p ?? ''}
      data-suffix={s ?? ''}
      aria-label={resolve(ariaLabel)}
      style={resolve(style)}
    >
      {p != null && <span class="ui-number-prefix">{p}</span>}
      <input
        class="ui-number-input"
        inputMode="decimal"
        aria-label={resolve(ariaLabel)}
        value={display()}
        onInput={(e: Event) => draft.set((e.target as HTMLInputElement).value)}
        onBlur={(e: Event) => {
          const v = parse((e.target as HTMLInputElement).value);
          if (v != null) commit(v);
          else if (draft() != null) commit(inner());
        }}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
      />
      {s != null && <span class="ui-number-suffix">{s}</span>}
      <button class="ui-number-step" data-step="down" aria-label="减少" onClick={() => stepBy(-1)}>
        −
      </button>
      <button class="ui-number-step" data-step="up" aria-label="增加" onClick={() => stepBy(1)}>
        +
      </button>
    </div>
  );
}
