import React, {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { IconCaret } from './icons';

export interface AccordionItemData {
  /** 唯一标识（受控/非受控状态键） */
  key: string;
  /** 标题文本 */
  title: ReactNode;
  /** 右侧计数徽标（可选） */
  badge?: ReactNode;
  /** 折叠面板内容（可嵌 Switch / Checkbox 等） */
  content?: ReactNode;
}

export interface AccordionProps {
  /** 分组数据 */
  items: AccordionItemData[];
  /** 受控展开 key 列表 */
  activeKeys?: string[];
  /** 非受控初始展开 */
  defaultActiveKeys?: string[];
  /** 展开集合变化 */
  onChange?: (keys: string[]) => void;
  className?: string;
  style?: CSSProperties;
}

const AccordionItemView = ({
  item,
  open,
  onToggle,
}: {
  item: AccordionItemData;
  open: boolean;
  onToggle: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const p = panelRef.current;
    if (!p) return;
    p.style.maxHeight = open ? `${p.scrollHeight}px` : '0px';
  }, [open, item.content]);
  return (
    <div className={cx('ui-accordion-item', open && 'is-open')}>
      <button
        type="button"
        className="ui-accordion-header"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{item.title}</span>
        {item.badge != null && <span className="ui-accordion-badge">{item.badge}</span>}
        <span className="ui-accordion-caret ui-icon">
          <IconCaret strokeWidth={2.4} />
        </span>
      </button>
      <div className="ui-accordion-panel" ref={panelRef}>
        <div className="ui-accordion-panel-inner">{item.content}</div>
      </div>
    </div>
  );
};

/**
 * Accordion · 分组折叠（金融筛选条件分组）
 * - 多组可同时展开；aria-expanded 同步；max-height 过渡
 * - 受控 activeKeys + onChange；不携带样式，全部走 theme.css
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    { items, activeKeys, defaultActiveKeys, onChange, className, style },
    ref,
  ) {
    const isControlled = activeKeys != null;
    const [inner, setInner] = useState<string[]>(defaultActiveKeys ?? []);
    const keys = isControlled ? (activeKeys as string[]) : inner;
    const set = useMemo(() => new Set(keys), [keys]);

    const toggle = useCallback(
      (key: string) => {
        const next = set.has(key)
          ? keys.filter((k) => k !== key)
          : [...keys, key];
        if (!isControlled) setInner(next);
        onChange?.(next);
      },
      [set, keys, isControlled, onChange],
    );

    return (
      <div className={cx('ui-accordion', className)} style={style} ref={ref}>
        {items.map((item) => (
          <AccordionItemView
            key={item.key}
            item={item}
            open={set.has(item.key)}
            onToggle={() => toggle(item.key)}
          />
        ))}
      </div>
    );
  },
);
