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
  id?: MaybeGetter<string>;
}

/**
 * Select · 下拉（输入）
 * 单/多选；可搜索过滤；受控/非受控；点击外部 / Esc 关闭。
 */
export function Select(props: SelectProps) {
  const toArr = (v: any): string[] => (v == null ? [] : Array.isArray(v) ? [...v] : [v]);
  const isControlled = () => resolve(props.value) != null;
  const inner = signal<string[]>(
    isControlled()
      ? toArr(resolve(props.value))
      : resolve(props.defaultValue) != null
        ? toArr(resolve(props.defaultValue))
        : [],
  );
  const selected = () => (isControlled() ? toArr(resolve(props.value)) : inner());
  const open = signal(false);
  const query = signal('');
  const isMulti = () => !!resolve(props.multiple);
  const searchable = () => resolve(props.searchable) ?? false;
  const placeholder = () => resolve(props.placeholder) ?? '请选择';
  const ariaLabel = () => resolve(props['aria-label']);

  const opts = () => resolve(props.options) || [];
  const labelText = () => {
    const sel = selected();
    const o = opts() || [];
    if (!sel.length) return placeholder();
    const labels = sel
      .map((v) => ((o.find((x) => x.value === v) as SelectOption) || ({} as any)).label)
      .filter(Boolean);
    return isMulti() ? labels.join('、') : labels[0] ?? placeholder();
  };
  const filtered = () => {
    const q = query().toLowerCase();
    const o = opts() || [];
    if (!searchable() || !q) return o;
    return o.filter(
      (x) => x.label.toLowerCase().includes(q) || x.value.toLowerCase().includes(q),
    );
  };
  const onOptionClick = (o: SelectOption) => {
    if (o.disabled) return;
    if (isMulti()) {
      const set = new Set(selected());
      if (set.has(o.value)) set.delete(o.value);
      else set.add(o.value);
      const next = [...set];
      if (!isControlled()) inner.set(next);
      const selOpts = (opts() || []).filter((x) => next.includes(x.value));
      props.onChange?.(next, selOpts);
    } else {
      const next = [o.value];
      if (!isControlled()) inner.set(next);
      props.onChange?.(o.value, o);
      open.set(false);
    }
  };

  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-select', open() && 'open', resolve(props.className))}
      data-multiple={isMulti() ? '' : undefined}
      aria-label={ariaLabel()}
      style={resolve(props.style)}
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
          {searchable() && (
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
            return (
              <div
                class={cx(isMulti() && 'multi', isSel() && 'is-selected')}
                role="option"
                data-val={o.value}
                aria-selected={isSel() ? 'true' : 'false'}
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
