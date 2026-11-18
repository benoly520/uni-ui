import { signal } from 'plain';
import { cx } from './_shared';
import { IconSearch } from './icons';

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
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  options?: SearchOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: SearchOption) => void;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Search · 搜索框（输入）
 * 带联想列表；支持键盘上下导航、回车确认；点击外部 / Esc 关闭建议。
 */
export function Search(props: SearchProps) {
  const isControlled = () => props.value != null;
  const inner = signal<string>(
    props.value != null
      ? String(props.value)
      : props.defaultValue != null
        ? String(props.defaultValue)
        : '',
  );
  const cur = () => (isControlled() ? String(props.value) : inner());
  const open = signal(false);
  // 初值 -1（与 React 一致）：否则聚焦后首次按 ↓ 会直接落到第 2 项
  const active = signal(-1);

  const visible = () => {
    const q = cur().trim().toLowerCase();
    const opts = (props.options as SearchOption[]) || [];
    if (!q) return opts;
    return opts.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.code || '').toLowerCase().includes(q),
    );
  };

  const select = (o: SearchOption) => {
    props.onSelect?.(o);
    if (!isControlled()) inner.set(o.label);
    open.set(false);
    active.set(-1);
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
      active.set(-1);
    }
  };

  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-search', open() && 'open', props.className)}
      style={props.style}
    >
      <span class="ico ui-icon">
        <IconSearch />
      </span>
      <input
        class="ui-search-input"
        placeholder={props.placeholder ?? '搜索…'}
        aria-label="全局搜索"
        value={cur()}
        onFocus={() => {
          open.set(true);
        }}
        onInput={(e: Event) => {
          const v = (e.target as HTMLInputElement).value;
          if (!isControlled()) inner.set(v);
          props.onChange?.(v);
          open.set(true);
          active.set(-1);
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
