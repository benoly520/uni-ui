import { resolve, signal } from 'plain';
import { cx } from './_shared';
import { IconCaret } from './icons';
import type { MaybeGetter } from './_shared';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: MaybeGetter<SelectOption[]>;
  value?: MaybeGetter<string | string[]>;
  defaultValue?: MaybeGetter<string | string[]>;
  multiple?: MaybeGetter<boolean>;
  searchable?: MaybeGetter<boolean>;
  placeholder?: MaybeGetter<string>;
  onChange?: (value: string | string[], option: SelectOption | SelectOption[]) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  'aria-label'?: MaybeGetter<string>;
  [key: string]: any;
}

/**
 * Select · 下拉（输入）
 * 单/多选；可搜索过滤；受控/非受控；点击外部 / Esc 关闭。
 */
export function Select(props: SelectProps) {
  const {
    options,
    value,
    defaultValue,
    multiple = false,
    searchable = false,
    placeholder = '请选择',
    onChange,
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const isControlled = value != null;
  const toArr = (v: any): string[] => (v == null ? [] : Array.isArray(v) ? [...v] : [v]);
  const inner = signal<string[]>(
    isControlled ? toArr(resolve(value)) : defaultValue != null ? toArr(resolve(defaultValue)) : [],
  );
  const selected = () => (isControlled ? toArr(resolve(value)) : inner());
  const open = signal(false);
  const query = signal('');
  const isMulti = () => !!resolve(multiple);
  const dataMultiple = () => (isMulti() ? '' : undefined);

  const labelText = () => {
    const sel = selected();
    const opts = resolve(options) || [];
    if (!sel.length) return resolve(placeholder);
    const labels = sel
      .map((v) => ((opts.find((o) => o.value === v) as SelectOption) || ({} as any)).label)
      .filter(Boolean);
    return isMulti() ? labels.join('、') : labels[0] ?? resolve(placeholder);
  };

  const filtered = () => {
    const q = query().toLowerCase();
    const opts = resolve(options) || [];
    if (!resolve(searchable) || !q) return opts;
    return opts.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  };

  const onOptionClick = (o: SelectOption) => {
    if (o.disabled) return;
    if (isMulti()) {
      const set = new Set(selected());
      if (set.has(o.value)) set.delete(o.value);
      else set.add(o.value);
      const next = [...set];
      if (!isControlled) inner.set(next);
      const opts = (resolve(options) || []).filter((x) => next.includes(x.value));
      onChange?.(next, opts);
    } else {
      const next = [o.value];
      if (!isControlled) inner.set(next);
      onChange?.(o.value, o);
      open.set(false);
    }
  };

  return (
    <div
      {...rest}
      class={cx('ui-select', open() && 'open', resolve(className))}
      data-multiple={dataMultiple()}
      aria-label={resolve(ariaLabel)}
      style={resolve(style)}
    >
      <button
        class="ui-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open()}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          open.set(!open());
        }}
      >
        <span>{labelText()}</span>
        <span class="caret ui-icon">
          <IconCaret />
        </span>
      </button>
      {open() ? (
        <div class="ui-select-menu" role="listbox">
          {resolve(searchable) && (
            <input
              class="ui-select-search"
              placeholder="搜索…"
              value={query()}
              onInput={(e: Event) => query.set((e.target as HTMLInputElement).value)}
            />
          )}
          {filtered().map((git) => {
            const o = git;
            const isSel = () => selected().includes(o.value);
            const ariaSelected = () => (isSel() ? 'true' : 'false');
            return (
              <div
                class={cx(isMulti() && 'multi', isSel() && 'is-selected')}
                role="option"
                data-val={o.value}
                aria-selected={ariaSelected()}
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  onOptionClick(o);
                }}
              >
                {o.label}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
