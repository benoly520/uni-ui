import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

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
  id?: MaybeGetter<string>;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * NumberInput · 数值输入（输入，金融增强）
 * 千分位 + 定点格式化；支持前缀/后缀符号；步进、失焦、回车提交均做 [min,max] 钳制。
 */
export function NumberInput(props: NumberInputProps) {
  const min = () => resolve(props.min) ?? -Infinity;
  const max = () => resolve(props.max) ?? Infinity;
  const step = () => resolve(props.step) ?? 1;
  const precision = () => resolve(props.precision) ?? 0;
  const prefix = () => resolve(props.prefix);
  const suffix = () => resolve(props.suffix);
  const isControlled = () => resolve(props.value) != null;
  const inner = signal<number>(
    resolve(props.value) != null
      ? Number(resolve(props.value))
      : Number(resolve(props.defaultValue) ?? 0),
  );
  const draft = signal<string | null>(null);
  // 受控时一切读数以 props.value 为准：受控分支 commit() 不写 inner，
  // 若 display()/stepBy() 仍读 inner() 会永远停在挂载时的初值（受控形同虚设）。
  const current = () => (isControlled() ? Number(resolve(props.value)) : inner());

  const clamp = (n: number) => Math.min(Number(max()), Math.max(Number(min()), n));
  const parse = (s: string): number | null => {
    const pp = prefix() ?? '';
    const ss = suffix() ?? '';
    const cleaned = String(s)
      .replace(new RegExp(escapeRe(pp) + '|' + escapeRe(ss), 'g'), '')
      .replace(/,/g, '')
      .trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };
  const commit = (n: number) => {
    const c = clamp(n);
    if (!isControlled()) inner.set(c);
    props.onChange?.(c);
    draft.set(null);
  };
  const display = () =>
    draft() != null
      ? (draft() as string)
      : (prefix() ?? '') +
        current().toLocaleString('en-US', {
          minimumFractionDigits: Number(precision()),
          maximumFractionDigits: Number(precision()),
        }) +
        (suffix() ?? '');

  const stepBy = (dir: number) => commit(clamp(current() + dir * Number(step())));

  const dataNum = (v: any) => String(v);

  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-number', resolve(props.className))}
      data-min={min() !== -Infinity ? dataNum(min()) : undefined}
      data-max={max() !== Infinity ? dataNum(max()) : undefined}
      data-step={dataNum(step())}
      data-precision={dataNum(precision())}
      data-prefix={prefix()}
      data-suffix={suffix()}
      aria-label={resolve(props['aria-label'])}
      style={resolve(props.style)}
    >
      {prefix() != null && <span class="ui-number-prefix">{prefix()}</span>}
      <button
        type="button"
        class="ui-number-step"
        data-step="down"
        aria-label="减少"
        onClick={() => stepBy(-1)}
      >
        −
      </button>
      <input
        class="ui-number-input"
        inputMode="decimal"
        aria-label={resolve(props['aria-label'])}
        value={display()}
        onInput={(e: Event) => draft.set((e.target as HTMLInputElement).value)}
        onBlur={(e: Event) => {
          const v = parse((e.target as HTMLInputElement).value);
          if (v != null) commit(v);
          else if (draft() != null) commit(current());
        }}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
      />
      <button
        type="button"
        class="ui-number-step"
        data-step="up"
        aria-label="增加"
        onClick={() => stepBy(1)}
      >
        +
      </button>
      {suffix() != null && <span class="ui-number-suffix">{suffix()}</span>}
    </div>
  );
}
