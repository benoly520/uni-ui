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
import { IconCaret, IconCheck } from './icons';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  /** 受控选中值：单选 string / 多选 string[] */
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  onChange?: (
    value: string | string[],
    option: SelectOption | SelectOption[] | undefined,
  ) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Select · 下拉选择（数据表单组）
 * - 单/多选(data-multiple)、搜索过滤、caret/check 图标
 * - 点击外部 / Esc 关闭；受控 value + onChange
 * - 还原预览 initSelect 开合/过滤逻辑（两侧一致）
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    multiple = false,
    searchable = false,
    placeholder = '请选择',
    onChange,
    className,
    style,
  },
  ref,
) {
  const isControlled = value != null;
  const [inner, setInner] = useState<string | string[]>(
    () => defaultValue ?? (multiple ? [] : ''),
  );
  const curVal = (isControlled ? value : inner) as string | string[];
  const selectedSet = useMemo(
    () => new Set(Array.isArray(curVal) ? curVal : curVal ? [curVal] : []),
    [curVal],
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      rootRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [ref],
  );

  const commit = useCallback(
    (next: string | string[]) => {
      if (!isControlled) setInner(next);
      if (multiple) {
        const opts = options.filter((o) => (next as string[]).includes(o.value));
        onChange?.(next, opts);
      } else {
        const opt = options.find((o) => o.value === next);
        onChange?.(next, opt);
      }
    },
    [isControlled, multiple, options, onChange],
  );

  const toggleOpen = useCallback(() => setOpen((o) => !o), []);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [options, searchable, query]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const onRootKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const onOptionClick = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const arr = selectedSet.has(opt.value)
        ? (curVal as string[]).filter((v) => v !== opt.value)
        : [...(curVal as string[]), opt.value];
      commit(arr);
    } else {
      commit(opt.value);
      setOpen(false);
    }
  };

  const labelText = useMemo(() => {
    if (multiple) {
      const labels = options
        .filter((o) => selectedSet.has(o.value))
        .map((o) => o.label);
      return labels.length ? labels.join('、') : placeholder;
    }
    const opt = options.find((o) => o.value === curVal);
    return opt ? opt.label : placeholder;
  }, [multiple, options, selectedSet, curVal, placeholder]);

  return (
    <div
      ref={setRef}
      className={cx('ui-select', open && 'open', className)}
      data-multiple={multiple || undefined}
      style={style}
      onKeyDown={onRootKey}
    >
      <button
        type="button"
        className="ui-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          toggleOpen();
        }}
      >
        {labelText}
        <span className="caret ui-icon">
          <IconCaret />
        </span>
      </button>
      <div className="ui-select-menu" role="listbox">
        {searchable && (
          <input
            className="ui-select-search"
            placeholder="搜索…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {filtered.map((opt) => (
          <div
            key={opt.value}
            className={cx('ui-select-option', multiple && 'multi')}
            role="option"
            data-val={opt.value}
            aria-selected={selectedSet.has(opt.value)}
            onClick={() => onOptionClick(opt)}
          >
            {opt.label}
            {multiple && (
              <span className="check ui-icon">
                <IconCheck strokeWidth={2.4} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
