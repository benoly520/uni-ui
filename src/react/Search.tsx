import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from '../utils/cx';

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
  options?: SearchOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: SearchOption) => void;
  className?: string;
  style?: CSSProperties;
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

/**
 * Search · 搜索框（数据表单组）
 * - 左放大镜、联想 listbox、键盘 ↑↓ 选择 / Enter 确认 / Esc 关闭
 * - 受控 value + onChange / onSelect
 * - 还原预览 initSearch 逻辑（两侧一致）
 */
export const Search = forwardRef<HTMLDivElement, SearchProps>(function Search(
  {
    options = [],
    value,
    defaultValue,
    placeholder = '搜索…',
    onChange,
    onSelect,
    className,
    style,
  },
  ref,
) {
  const isControlled = value != null;
  const [inner, setInner] = useState<string>(defaultValue ?? '');
  const curVal = isControlled ? (value as string) : inner;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      rootRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [ref],
  );

  const visible = useMemo(() => {
    const q = curVal.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.code ?? '').toLowerCase().includes(q),
    );
  }, [options, curVal]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const commitValue = useCallback(
    (next: string) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const selectOption = useCallback(
    (opt: SearchOption) => {
      commitValue(opt.label);
      onSelect?.(opt);
      setOpen(false);
      setActive(-1);
    },
    [commitValue, onSelect],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, visible.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (visible[active]) {
        e.preventDefault();
        selectOption(visible[active]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div
      ref={setRef}
      className={cx('ui-search', open && 'open', className)}
      style={style}
    >
      <span className="ico ui-icon">
        <SearchIcon />
      </span>
      <input
        className="ui-search-input"
        placeholder={placeholder}
        aria-label="全局搜索"
        value={curVal}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          commitValue(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
      />
      <div className="ui-search-suggest" role="listbox">
        {visible.map((opt, i) => (
          <div
            key={opt.value}
            className={cx('opt', i === active && 'active')}
            role="option"
            onMouseDown={(e) => {
              e.preventDefault();
              selectOption(opt);
            }}
          >
            <span>
              {opt.label}
              {opt.tag && (
                <span
                  className={cx(
                    'ui-tag',
                    opt.tag.variant && `ui-tag--${opt.tag.variant}`,
                  )}
                >
                  {opt.tag.text}
                </span>
              )}
            </span>
            {opt.code && <span className="code">{opt.code}</span>}
          </div>
        ))}
      </div>
    </div>
  );
});
