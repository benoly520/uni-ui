import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export interface TabItem {
  /** 唯一键，受控/非受控状态都以它为标识 */
  key: string;
  /** 标签文本/节点 */
  label: ReactNode;
  /** 面板内容 */
  content: ReactNode;
}

export interface TabsProps {
  /** 标签与面板数据 */
  items: TabItem[];
  /** 受控选中 key */
  value?: string;
  /** 非受控初始选中（缺省取首项） */
  defaultValue?: string;
  /** 选中变化回调 */
  onChange?: (key: string) => void;
  /** tablist 无障碍标签 */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Tabs · 标签切换（浮层导航组）
 * - 标签过多横向滚动：左右箭头 is-visible + scrollBy；scroll/resize/ResizeObserver 实时刷新
 * - role=tablist/tab/tabpanel、aria-selected、roving tabindex、方向键切换
 * - 受控/非受控双模式；不携带样式，全部走 theme.css
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value,
    defaultValue,
    onChange,
    ariaLabel = '标签页',
    className,
    style,
  },
  ref,
) {
  const isControlled = value != null;
  const [inner, setInner] = useState<string>(
    () => defaultValue ?? items[0]?.key ?? '',
  );
  const selected = isControlled ? (value as string) : inner;

  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const select = useCallback(
    (key: string) => {
      if (!isControlled) setInner(key);
      onChange?.(key);
    },
    [isControlled, onChange],
  );

  const updateArrows = useCallback(() => {
    const scroller = scrollRef.current;
    const wrap = wrapRef.current;
    if (!scroller || !wrap) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const x = scroller.scrollLeft;
    const left = wrap.querySelector('.ui-tabs-arrow--left');
    const right = wrap.querySelector('.ui-tabs-arrow--right');
    left?.classList.toggle('is-visible', x > 1);
    right?.classList.toggle('is-visible', x < max - 1);
  }, []);

  useLayoutEffect(() => {
    updateArrows();
    const scroller = scrollRef.current;
    if (!scroller) return;
    const onScroll = () => updateArrows();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateArrows) : null;
    ro?.observe(scroller);
    window.addEventListener('resize', updateArrows);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      ro?.disconnect();
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, items.length]);

  // 选中项滚动入视
  useEffect(() => {
    const tab = scrollRef.current?.querySelector<HTMLElement>(`#tab-${CSS.escape(selected)}`);
    // scrollIntoView 在 jsdom / 老旧环境中不存在，可选链只保护 tab 为 null 的情况，故需显式判方法
    tab?.scrollIntoView?.({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const tabs = items;
    const i = tabs.findIndex((t) => t.key === selected);
    if (i < 0) return;
    let n = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    else return;
    e.preventDefault();
    const key = tabs[n].key;
    select(key);
    const el = scrollRef.current?.querySelector<HTMLElement>(`#tab-${CSS.escape(key)}`);
    el?.focus();
  };

  const scrollByStep = (dir: -1 | 1) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const step = Math.max(80, scroller.clientWidth * 0.8);
    scroller.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <>
      <div className={cx('ui-tabs-wrap', className)} style={style} ref={(node) => {
        (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}>
        <button
          className="ui-tabs-arrow ui-tabs-arrow--left"
          aria-label="向左滚动标签"
          type="button"
          onClick={() => scrollByStep(-1)}
        />
        <div className="ui-tabs-scroll" ref={scrollRef}>
          <div className="ui-tabs" role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}>
            {items.map((it) => {
              const active = it.key === selected;
              return (
                <button
                  key={it.key}
                  role="tab"
                  id={`tab-${it.key}`}
                  aria-selected={active}
                  aria-controls={`panel-${it.key}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(it.key)}
                >
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>
        <button
          className="ui-tabs-arrow ui-tabs-arrow--right"
          aria-label="向右滚动标签"
          type="button"
          onClick={() => scrollByStep(1)}
        />
      </div>
      {items.map((it) => {
        const active = it.key === selected;
        return (
          <div
            key={it.key}
            className="ui-tabpanel"
            id={`panel-${it.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${it.key}`}
            hidden={!active}
          >
            {it.content}
          </div>
        );
      })}
    </>
  );
});
