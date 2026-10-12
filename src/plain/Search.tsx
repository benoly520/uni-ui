import { resolve, signal } from 'plain';
import { cx } from './_shared';
import { IconSearch } from './icons';
import type { MaybeGetter } from './_shared';

export interface SearchTag {
  text: string;
  variant?: 'up' | 'down' | 'brand';
}
export interface SearchOption {
  label: string;
  value: string;
  code?: string;
  tag?: SearchTag;
}

export interface SearchProps {
  options?: MaybeGetter<SearchOption[]>;
  value?: MaybeGetter<string>;
  defaultValue?: MaybeGetter<string>;
  placeholder?: MaybeGetter<string>;
  onChange?: (value: string) => void;
  onSelect?: (option: SearchOption) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

/**
 * Search · 搜索框（输入）
 * 带联想列表；支持键盘上下导航、回车确认；点击外部 / Esc 关闭建议。
 */
export function Search(props: SearchProps) {
  const {
    options,
    value,
    defaultValue,
    placeholder = '搜索…',
    onChange,
    onSelect,
    className,
    style,
    ...rest
  } = props;
  const isControlled = value != null;
  const inner = signal<string>(
    value != null ? String(resolve(value)) : defaultValue != null ? String(resolve(defaultValue)) : '',
  );
  const cur = () => (isControlled ? String(resolve(value)) : inner());
  const open = signal(false);
  const active = signal(0);

  const visible = () => {
    const q = cur().toLowerCase();
    const opts = (resolve(options) as SearchOption[]) || [];
    if (!q) return opts;
    return opts.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.code || '').toLowerCase().includes(q),
    );
  };

  const select = (o: SearchOption) => {
    onSelect?.(o);
    if (!isControlled) inner.set(o.label);
    open.set(false);
  };

  const handleKey = (e: KeyboardEvent) => {
    const items = visible();
    if (e.key === 'ArrowDown') {
      active.set(Math.min(items.length - 1, active() + 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      active.set(Math.max(0, active() - 1));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const o = items[active()];
      if (o) select(o);
    } else if (e.key === 'Escape') {
      open.set(false);
    }
  };

  return (
    <div
      {...rest}
      class={cx('ui-search', open() && 'open', resolve(className))}
      style={resolve(style)}
    >
      <span class="ico ui-icon">
        <IconSearch />
      </span>
      <input
        class="ui-search-input"
        placeholder={resolve(placeholder)}
        aria-label="全局搜索"
        value={cur()}
        onFocus={() => {
          open.set(true);
          active.set(0);
        }}
        onInput={(e: Event) => {
          const v = (e.target as HTMLInputElement).value;
          if (!isControlled) inner.set(v);
          onChange?.(v);
          open.set(true);
          active.set(0);
        }}
        onKeyDown={handleKey}
      />
      {open() ? (
        <div class="ui-search-suggest" role="listbox">
          {visible().map((git, i) => {
            const o = git;
            const isAct = () => active() === i;
            return (
              <div
                class={cx('opt', isAct() && 'active')}
                role="option"
                onMouseDown={(e: Event) => {
                  e.preventDefault();
                  select(o);
                }}
              >
                <span>{o.label}</span>
                {o.tag && (
                  <span class={cx('ui-tag', o.tag.variant && 'ui-tag--' + o.tag.variant)}>
                    {o.tag.text}
                  </span>
                )}
                {o.code && <span class="code">{o.code}</span>}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
