import { signal } from 'plain';
import { cx } from './_shared';
import { IconCaret, IconCheck } from './icons';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  options: SelectOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  onChange?: (value: string | string[], option: SelectOption | SelectOption[]) => void;
  className?: string;
  style?: string | Record<string, string>;
  'aria-label'?: string;
  id?: string;
}

/**
 * Select · 下拉（输入）
 * 单/多选；可搜索过滤；受控/非受控；点击外部 / Esc 关闭。
 */
export function Select(props: SelectProps) {
  const toArr = (v: any): string[] => (v == null ? [] : Array.isArray(v) ? [...v] : [v]);
  const isControlled = () => props.value != null;
  const inner = signal<string[]>(
    isControlled()
      ? toArr(props.value)
      : props.defaultValue != null
        ? toArr(props.defaultValue)
        : [],
  );
  const selected = () => (isControlled() ? toArr(props.value) : inner());
  const open = signal(false);
  const query = signal('');
  const isMulti = () => !!props.multiple;
  const searchable = () => props.searchable ?? false;
  const placeholder = () => props.placeholder ?? '请选择';
  const ariaLabel = () => props['aria-label'];

  const opts = () => props.options || [];
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

  // 根节点用于「点击外部关闭」判定；document 监听在 ref 清理里回收，避免泄漏。
  let rootEl: HTMLElement | null = null;
  const onDocClick = (e: MouseEvent) => {
    if (!open()) return;
    if (rootEl && rootEl.contains(e.target as Node)) return;
    open.set(false);
  };
  const onDocKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open()) open.set(false);
  };
  const refRoot = (el: HTMLElement) => {
    rootEl = el;
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onDocKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onDocKey);
      rootEl = null;
    };
  };

  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      ref={refRoot}
      class={cx('ui-select', open() && 'open', props.className)}
      data-multiple={isMulti() || undefined}
      aria-label={ariaLabel()}
      style={props.style}
    >
      <button
        type="button"
        class="ui-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open() ? 'true' : 'false'}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          open.set(!open());
        }}
      >
        <span class="ui-select-value">{labelText()}</span>
        <span class="caret ui-icon">
          <IconCaret />
        </span>
      </button>
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
              class={cx('ui-select-option', isMulti() && 'multi')}
              role="option"
              data-val={o.value}
              aria-selected={isSel() ? 'true' : 'false'}
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                onOptionClick(o);
              }}
            >
              {o.label}
              {isMulti() && (
                <span class="check ui-icon">
                  <IconCheck strokeWidth={2.4} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
