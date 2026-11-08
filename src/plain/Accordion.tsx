import { signal, effect } from 'plain';
import { cx } from './_shared';
import { IconCaret } from './icons';
import type { Renderable } from './_shared';

export interface AccordionItemData {
  key: string;
  title: Renderable;
  badge?: Renderable;
  content?: Renderable;
}

export interface AccordionProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  items: AccordionItemData[];
  activeKeys?: string[];
  defaultActiveKeys?: string[];
  onChange?: (keys: string[]) => void;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

let accSeq = 0;

/**
 * Accordion · 手风琴（基础）
 * 多组可同时展开；面板 maxHeight 用 effect + rAF 测量。
 * 用 ref 抓取根节点定位面板，消除旧实现在文档上按 id 查询的做法。
 */
export function Accordion(props: AccordionProps) {
  const itemsArr = () => props.items || [];
  const isControlled = () => props.activeKeys != null;
  const uid = 'acc-' + ++accSeq;
  const inner = signal<string[]>(
    props.defaultActiveKeys != null ? [...(props.defaultActiveKeys as string[])] : [],
  );
  const openSet = () =>
    new Set(isControlled() ? (props.activeKeys as string[]) || [] : inner());

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
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id || uid}
      ref={refRoot}
      class={cx('ui-accordion', props.className)}
      style={props.style}
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
              <div class="ui-accordion-panel-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
