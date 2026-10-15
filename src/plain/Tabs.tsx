import { resolve, signal, effect } from 'plain';
import { cx, boolAttr } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface TabItem {
  /** 唯一键，受控/非受控状态都以它为标识 */
  key: string;
  /** 标签文本/节点 */
  label: MaybeGetter<Renderable>;
  /** 面板内容 */
  content: MaybeGetter<Renderable>;
}

export interface TabsProps {
  /** 标签与面板数据 */
  items: MaybeGetter<TabItem[]>;
  /** 受控选中 key */
  value?: MaybeGetter<string>;
  /** 非受控初始选中（缺省取首项） */
  defaultValue?: MaybeGetter<string>;
  /** 选中变化回调 */
  onChange?: (key: string) => void;
  /** tablist 无障碍标签 */
  ariaLabel?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Tabs · 标签切换（浮层导航组）
 * 标签过多横向滚动：左右箭头 is-visible + scrollBy；scroll 实时刷新。
 * role=tablist/tab/tabpanel、aria-selected、roving tabindex、方向键切换。
 * 受控/非受控双模式。
 */
export function Tabs(props: TabsProps) {
  const itemsArr = () => resolve(props.items) || [];
  const isControlled = () => resolve(props.value) != null;
  const inner = signal<string>(
    (resolve(props.defaultValue) as string) ?? itemsArr()[0]?.key ?? '',
  );
  const selected = () => (isControlled() ? (resolve(props.value) as string) : inner());
  const ariaLabel = () => resolve(props.ariaLabel) ?? '标签页';

  const select = (key: string) => {
    if (!isControlled()) inner.set(key);
    props.onChange?.(key);
  };

  let scrollerEl: HTMLElement | null = null;
  const refScroller = (el: HTMLElement) => {
    scrollerEl = el;
  };
  const onScroll = (e: Event) => {
    const scroller = (e.currentTarget as HTMLElement) || scrollerEl;
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const x = scroller.scrollLeft;
    const left = scroller.parentElement?.querySelector(
      '.ui-tabs-arrow--left',
    ) as HTMLElement | null;
    const right = scroller.parentElement?.querySelector(
      '.ui-tabs-arrow--right',
    ) as HTMLElement | null;
    left?.classList.toggle('is-visible', x > 1);
    right?.classList.toggle('is-visible', x < max - 1);
  };
  // 初始化箭头可见态（一次性，无泄漏）
  requestAnimationFrame(() => {
    if (scrollerEl) onScroll({ currentTarget: scrollerEl } as unknown as Event);
  });

  // 选中项滚动入视
  effect(() => {
    const key = selected();
    requestAnimationFrame(() => {
      const tab = document.querySelector(`#tab-${CSS.escape(key)}`) as HTMLElement | null;
      tab?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
    });
  });

  const onKeyDown = (e: KeyboardEvent) => {
    const tabs = itemsArr();
    const i = tabs.findIndex((t) => t.key === selected());
    if (i < 0) return;
    let n = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    else return;
    e.preventDefault();
    const k = tabs[n].key;
    select(k);
    requestAnimationFrame(() => {
      const el = document.querySelector(`#tab-${CSS.escape(k)}`) as HTMLElement | null;
      el?.focus();
    });
  };

  const scrollByStep = (dir: -1 | 1) => {
    requestAnimationFrame(() => {
      const scroller = scrollerEl;
      if (!scroller) return;
      const step = Math.max(80, scroller.clientWidth * 0.8);
      scroller.scrollBy({ left: dir * step, behavior: 'smooth' });
    });
  };

  return (
    <>
      <div
        id={resolve(props.id)}
        class={cx('ui-tabs-wrap', resolve(props.className))}
        style={resolve(props.style)}
      >
        <button
          class="ui-tabs-arrow ui-tabs-arrow--left"
          aria-label="向左滚动标签"
          type="button"
          onClick={() => scrollByStep(-1)}
        />
        <div class="ui-tabs-scroll" ref={refScroller} onScroll={onScroll}>
          <div class="ui-tabs" role="tablist" aria-label={ariaLabel()} onKeyDown={onKeyDown}>
            {itemsArr().map((it) => {
              const active = () => it.key === selected();
              return (
                <button
                  role="tab"
                  id={`tab-${it.key}`}
                  aria-selected={active() ? 'true' : 'false'}
                  aria-controls={`panel-${it.key}`}
                  tabIndex={active() ? 0 : -1}
                  onClick={() => select(it.key)}
                >
                  {resolve(it.label)}
                </button>
              );
            })}
          </div>
        </div>
        <button
          class="ui-tabs-arrow ui-tabs-arrow--right"
          aria-label="向右滚动标签"
          type="button"
          onClick={() => scrollByStep(1)}
        />
      </div>
      {itemsArr().map((it) => {
        const active = () => it.key === selected();
        return (
          <div
            class="ui-tabpanel"
            id={`panel-${it.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${it.key}`}
            hidden={boolAttr(!active())}
          >
            {resolve(it.content)}
          </div>
        );
      })}
    </>
  );
}
