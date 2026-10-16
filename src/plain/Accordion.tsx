import { resolve, signal, effect } from 'plain';
import { cx } from './_shared';
import { IconCaret } from './icons';
import type { MaybeGetter, Renderable } from './_shared';

export interface AccordionItemData {
  key: string;
  title: Renderable | (() => Renderable);
  badge?: Renderable | (() => Renderable);
  content?: Renderable | (() => Renderable);
}

export interface AccordionProps {
  items: MaybeGetter<AccordionItemData[]>;
  activeKeys?: MaybeGetter<string[]>;
  defaultActiveKeys?: MaybeGetter<string[]>;
  onChange?: (keys: string[]) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

let accSeq = 0;

/**
 * Accordion · 手风琴（基础）
 * 多组可同时展开；面板 maxHeight 用 effect + rAF 测量。
 * 用 ref 抓取根节点定位面板，消除旧实现在文档上按 id 查询的做法。
 */
export function Accordion(props: AccordionProps) {
  const itemsArr = () => resolve(props.items) || [];
  const isControlled = () => resolve(props.activeKeys) != null;
  const uid = 'acc-' + ++accSeq;
  const inner = signal<string[]>(
    props.defaultActiveKeys != null ? [...(resolve(props.defaultActiveKeys) as string[])] : [],
  );
  const openSet = () =>
    new Set(isControlled() ? (resolve(props.activeKeys) as string[]) || [] : inner());

  const toggle = (key: string) => {
    const set = new Set(openSet());
    if (set.has(key)) set.delete(key);
    else set.add(key);
    if (!isControlled()) inner.set([...set]);
    props.onChange?.([...set]);
  };

  let accEl: HTMLElement | null = null;
  const refRoot = (el: HTMLElement) => {
    accEl = el;
  };

  return (
    <div
      id={resolve(props.id) || uid}
      ref={refRoot}
      class={cx('ui-accordion', resolve(props.className))}
      style={resolve(props.style)}
    >
      {itemsArr().map((item) => {
        const isOpen = () => openSet().has(item.key);
        effect(() => {
          const open = isOpen();
          requestAnimationFrame(() => {
            const panel = accEl?.querySelector(
              '[data-key="' + item.key + '"] .ui-accordion-panel',
            ) as HTMLElement | null;
            if (panel) panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
          });
        });
        return (
          <div class={cx('ui-accordion-item', isOpen() && 'is-open')} data-key={item.key}>
            <button
              type="button"
              class="ui-accordion-header"
              aria-expanded={isOpen()}
              onClick={() => toggle(item.key)}
            >
              <span>{item.title}</span>
              {item.badge != null && <span class="ui-accordion-badge">{item.badge}</span>}
              <span class="ui-accordion-caret ui-icon">
                <IconCaret strokeWidth={2.4} />
              </span>
            </button>
            <div class="ui-accordion-panel">
              <div class="ui-accordion-panel-inner">{resolve(item.content)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
